import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH, REEL_COUNT, SYMBOL_PER_REEL } from "./config.ts"
// @ts-ignore 
import { Reel } from "./Reel.ts"

export class ReelController {
  private margin: {top: number, left: number} = {top: 30, left: 65};
  private container: PIXI.Container;
  private state: Reel[] = [];
  private toggleButton: () => void;

  constructor(
    private loader: PIXI.Loader, 
    public tweenController:any,
    private onWinCb: ()=>void
  ) {
    this.container = new PIXI.Container();
    this.initialize();
  }

  initialize() {
    this.createReels(REEL_COUNT);
    this.container.position.set(this.margin.left, this.margin.top);
    this.tweenController.reels = this.state;

  }
  
  // class architecture without event emitters and sub/pub is so awful but whatever
  setToggleButtonCb(cb: () => void) {
    this.toggleButton = cb;
  };

  createReels(reelCount: number) {
    this.state = [];
    for (let i=0; i < reelCount; i++) {
      let reel = new Reel(this.loader, SYMBOL_PER_REEL);
      let reelContainer = reel.getContainer();
      reelContainer.x = i * REEL_WIDTH;
      this.state.push(reel);
      this.container.addChild(reelContainer);
    }
  }

  onSpinEnd() {
    this.state.forEach((reel)=>reel.onSpinEnd());
    this.toggleButton();
    let win = this.checkWin();
    if (win) this.onWinCb();
  }

  startSpin() {
    this.tweenController.setTweenObjects(this.state);
    for (let i = 0; i < this.state.length; i++) {
      const reel = this.state[i];
      const extra = Math.floor(Math.random() * 3);
      const targetPosition = reel.position.current + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;
      this.tweenController.tweenTo(
        reel,
        reel.position.current,
        targetPosition,
        time,
        0.5,
        null, 
        i === this.state.length - 1 ? this.onSpinEnd.bind(this) : null
      );
    }
  }

  stopSpin() {
    this.state.forEach((reel)=>this.tweenController.stopTweening(reel));
  }
  
  checkWin(): boolean {
    //pls dont look at this solution, it just works, i promise :(
    let wild_id = 0;
    let symbolIds = this.state.map(reel => reel.getReelValues());

    let winMask = symbolIds.slice().reduce((winMask, column, index) => {
      column.forEach((symbol_id: number, index: number) => {
        if (winMask[index] == wild_id) winMask[index] = symbol_id;
        if (symbol_id != winMask[index] && symbol_id != wild_id) winMask[index] = -1;
      })
      return winMask;
    });
    /* winMask algorythm:
      1) Took first reel column as initial value
      2) Compare next column value with winMask per row
        - if symbol id in winMask is 0 (wild symbol id), that means that
          every reel before contains wild symbol on this row
        - if symbol in next column on this row is different from 
          winMask symbol and not 0 (wild), that means that it's losing row and 
          thats why i'm setting winMask value to -1
        - after processing all columns, i recieve specil mask array, that 
          indicates if there is winning row if it contains elements, that are not
          0 (full row of wild symbols) and not -1 (losing row)
      3) Process next column, etc
    */
    return winMask.some((id:number)=>id>0);
  }

  getContainer() {
    return this.container;
  }
}