import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH, SYMBOL_SIZE } from "./config.ts"

export class ReelController {
  private reels = [];
  private container: PIXI.Container;

  constructor(
    slotTextures: PIXI.Texture[], 
    reelCount:number,
    symbolCount: number
  ) {
    this.container = new PIXI.Container();
    for (let i=0; i<reelCount; i++) {
      const rc = new PIXI.Container();
      rc.x = i * REEL_WIDTH;
      this.container.addChild(rc);

      const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new PIXI.filters.BlurFilter()
      };
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];
      for (let j=0; j<symbolCount; j++) {
        const symbol = new PIXI.Sprite(
          slotTextures[Math.floor(Math.random() * slotTextures.length)]
        );
        symbol.y = j * SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
        symbol.x = Math.round((REEL_WIDTH - SYMBOL_SIZE) / 2);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      
      this.container.y = 50;
      this.container.x = 60;
    }
  }

  getContainer() {
    return this.container;
  }
}