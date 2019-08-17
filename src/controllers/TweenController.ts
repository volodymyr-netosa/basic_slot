import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH, REEL_COUNT, SYMBOL_SIZE } from "./config.ts"
// @ts-ignore 
import { Reel } from "./Reel.ts"

interface Tween {
  reelObject: Reel,
  property: string,
  propertyBeginValue: number,
  target: number,
  easing,
  time: number,
  change: (...args: any) => void,
  complete: (...args: any) => void,
  start: number,
}

export class TweenController {
  private tweening: Tween[] = [];
  private _reels: Reel[] = [];
  private addHandlerToTicker: (func: (delta: number) => any) => void;

  constructor(addHandlerToTicker: (func: (delta: number) => any) => void) {
    this.addHandlerToTicker = addHandlerToTicker;
    this.initialize();
  }

  get reels() {
    return this._reels;
  }

  set reels(value: Reel[]) {
    this._reels = value;
  }

  tweenTo(reelObject, property, target, time, backout_amount, onchange, oncomplete) {
    const tween: Tween = {
      reelObject,
      property,
      propertyBeginValue: reelObject[property],
      target,
      easing: this.backout(backout_amount),
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    this.tweening.push(tween);
    return tween;
  }

  initialize() {
    this.addHandlerToTicker((delta) => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < this.tweening.length; i++) {
          const t = this.tweening[i];
          const phase = Math.min(1, (now - t.start) / t.time);
  
          t.reelObject[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
          if (t.change) t.change(t);
          if (phase === 1) {
              t.reelObject[t.property] = t.target;
              if (t.complete) t.complete(t);
              remove.push(t);
          }
      }
      for (let i = 0; i < remove.length; i++) {
          this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
      }
    })

    this.addHandlerToTicker((delta) => {
      console.log(this.reels.length);
      for (let i = 0; i < this.reels.length; i++) {
        const r = this.reels[i];
          r.updateBlurAndPosition();
          let symbols = r.getSymbolState();
          for (let j = 0; j < symbols.length; j++) {
              const symbolSprite = symbols[j];
              const prevy = symbolSprite.y;
              symbolSprite.y = ((r.getPosition() + j) % symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
              if (symbolSprite.y < 0 && prevy > SYMBOL_SIZE) {
                   symbolSprite.texture = r.getRandomSprite().texture;
                  symbolSprite.scale.x = symbolSprite.scale.y = Math.min(
                    SYMBOL_SIZE / symbolSprite.texture.width, 
                    SYMBOL_SIZE / symbolSprite.texture.height
                  );
                  symbolSprite.x = Math.round((SYMBOL_SIZE - symbolSprite.width) / 2);
              }
            }
          }
    })
  } 

  lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
  }

  backout(amount) {
    return t => (--t * t * ((amount + 1) * t + amount) + 1);
  }

}