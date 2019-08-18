import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH, REEL_COUNT, SYMBOL_SIZE } from "./config.ts"


interface Tween<T extends TweenControlled> {
  object: T,
  startPostition: number,
  targetPosition: number,
  easing: (t:number) => number,
  spinTime: number,
  change: (...args: any) => void,
  complete: (...args: any) => void,
  startTime: number,
}

export interface TweenControlled { 
  position: { current: number, prev: number };
  updateBlurAndPosition: () => void; // Updates every tick
  getMovingSprites: () => PIXI.Sprite[];  // returns symbols that moving by controller
  spin: any
}

export class TweenController<T extends TweenControlled> {
  private tweening: Tween<T>[] = [];
  private objArray: T[] = [];
  private addHandlerToTicker: (func: (delta: number) => any) => void;

  constructor(addHandlerToTicker: (func: (delta: number) => any) => void) {
    this.addHandlerToTicker = addHandlerToTicker;
    this.initialize();
  }

  setTweenObjects(objects: T[]) {
    this.objArray = objects;
  }

  tweenTo(
    object: T,
    startPostition: number,
    targetPosition: number,
    spinTime: number, 
    backout_amount: number, 
    onchange: (...args: any) => any, 
    oncomplete: (...args: any) => any
  ) {
    const tween: Tween<T> = {
      object,
      startPostition,
      targetPosition,
      easing: this.backout(backout_amount),
      spinTime,
      change: onchange,
      complete: oncomplete,
      startTime: Date.now(),  //Maybe it`s better to store this values in Date, not in number
    };

    this.tweening.push(tween);
    return tween;
  }

  stopTweening(object: T) {
    const index = this.tweening.findIndex((value)=> value.object === object);
    if (~index) {
      this.tweening[index].spinTime = 0;
    }
  }

  tweenObject(t: Tween<T>, now: number) {
    const phase = Math.min(1, (now - t.startTime)/t.spinTime);

    if (t.change) t.change();
    if (phase === 1) {
      t.object.position.current = t.targetPosition;
      if (t.complete) t.complete();
      return true;
    }
    t.object.position.current = this.lerp(
      t.startPostition,
      t.targetPosition,
      t.easing(phase)
    );
    return false;
  }

  initialize() {
    this.addHandlerToTicker((delta) => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < this.tweening.length; i++) {
          let done = this.tweenObject(this.tweening[i], now);
          if (done) remove.push(this.tweening[i]);
      };
      for (let i = 0; i < remove.length; i++) {
        this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
      }
    });

    this.addHandlerToTicker((delta) => {
      for (let i = 0; i < this.objArray.length; i++) {
        this.objArray[i].spin();
      }
    }); 
  } 

  //calculating intermediate points as linear interpolation
  lerp(current: number, target: number, phase: number): number { 
    return current * (1 - phase) + target * phase;
  }

  backout(amount: number): (phase: number) => any {
    return phase => {
      phase--;
      return phase*phase*((amount + 1)*phase + amount) + 1;
    }
  }
}