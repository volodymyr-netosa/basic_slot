import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH, REEL_COUNT, SYMBOL_PER_REEL } from "./config.ts"
// @ts-ignore 
import { Reel } from "./Reel.ts"

export class ReelController {
  private margin: {top: number, left: number} = {top: 30, left: 50};
  private container: PIXI.Container;
  private state: Reel[] = [];

  constructor(private loader: PIXI.Loader, public tweenController:any) {
    this.container = new PIXI.Container();
    this.initialize();
  }

  initialize() {
    this.createReels(REEL_COUNT);
    this.container.position.set(this.margin.left, this.margin.top);
    this.tweenController.reels = this.state;
    this.startSpin();
  }

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

  startSpin() {
    for (let i = 0; i < 3; i++) {
      const r = this.state[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;
      this.tweenController.tweenTo(r, 'position', target, time, 0.5, null, i === this.state.length - 1 ? ()=>console.log("LUL") : null);
    }
  }


  getContainer() {
    return this.container;
  }
}