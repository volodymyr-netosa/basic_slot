import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH } from "./config.ts"

interface Symbol {
  id: number,
  texture: PIXI.Texture
}

export class Reel {
  private maxSymbolHeight: number = 180;
  private maxSymbolWidth: number = 180;
  private animation: boolean = true;
  private delayStop: number = 0;
  private container: PIXI.Container;
  private symbols: Symbol[];
  private state: PIXI.Sprite[];  //sprite 
  private blur: PIXI.filters.BlurFilter;
  position:number = 0;
  previousPosition: number =0;

  constructor(private loader: PIXI.Loader, public symbolCount: number) {
    this.blur = new PIXI.filters.BlurFilter();
    this.blur.blurX = 0;
    this.blur.blurY = 0;

    this.container = new PIXI.Container();
    this.container.filters = [this.blur];
    this.initialize();
  }
  
  initialize() {
    this.symbols = [1,3,4,5,6,7].map(
      (val, index) => (
        {
          id: index, 
          texture: this.loader.resources[`assets/SYM${val}.png`].texture
        }
    ));
    this.createReel();
  }

  createReel() {
    this.state = [];
    for (let i = 0; i < this.symbolCount; i++){
      let random_symbol = this.getRandomSymbol();
      let symbolSprite = this.getSymbolSprite(random_symbol, i);
      
      this.container.addChild(symbolSprite);
      this.state.push(symbolSprite);  //todo add normal state logic ?
    }
  }

  getSymbolSprite(symbol: Symbol, position: number): PIXI.Sprite {
    let symbolSprite = new PIXI.Sprite(symbol.texture);
    symbolSprite.y = position * this.maxSymbolHeight;
    symbolSprite.scale.x = symbolSprite.scale.y = Math.min(
      this.maxSymbolHeight/symbolSprite.height,
      this.maxSymbolWidth/symbolSprite.width
    );
    symbolSprite.x = (REEL_WIDTH - this.maxSymbolWidth)/2;
    return symbolSprite;
  }

  getRandomSymbol(): Symbol {  //static?
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }
  
  getRandomSprite(): any { //static?
    return this.getRandomSymbol();
  }

  startAnimation() {
    if (this.animation) return;
    this.animation = true;
    
  }

  updateBlurAndPosition() {
    this.blur.blurY = (this.position - this.previousPosition) * 8;
    this.previousPosition = this.position;
  }

  getSymbolState() {
    return this.state;
  }

  getPosition() {
    return this.position;
  }

  stopAnimation() {
    this.animation = false;
  }

  getContainer() {
    return this.container;
  }

  getBlurFilter() {
  }
}