import * as PIXI from "pixi.js";
// @ts-ignore 
import { REEL_WIDTH } from "./config.ts"
// @ts-ignore
import { TweenControlled } from "./TweenController.ts"

interface Texture {
  id: number,
  texture: PIXI.Texture
}

interface Symbol {
  texture_id: number,
  sprite: PIXI.Sprite
}

interface Position { 
  current: number,
  prev: number
}

export class Reel implements TweenControlled {
  private maxSymbolHeight: number = 180;
  private maxSymbolWidth: number = 180;
  private animation: boolean = true;
  private delayStop: number = 0;
  private container: PIXI.Container;
  private textures: Texture[];
  private state: Symbol[];
  private blur: PIXI.filters.BlurFilter;
  private _position: Position = { current:0, prev: 0};

  constructor(private loader: PIXI.Loader, public symbolCount: number) {
    this.blur = new PIXI.filters.BlurFilter();
    this.blur.blurX = 0;
    this.blur.blurY = 0;

    this.container = new PIXI.Container();
    this.container.filters = [this.blur];
    this.initialize();
  }
  
  initialize() {
    this.textures = [1,3,4,5,6,7].map(
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
    for (let i = 0; i < this.symbolCount+1; i++){
      let randomTexture = this.getRandomTexture();
      let symbolSprite = this.prepareSymbolSprite(randomTexture, i);
      
      this.container.addChild(symbolSprite);
      this.state.push({
        texture_id: randomTexture.id,
        sprite: symbolSprite
      });
    }
  }

  prepareSymbolSprite(texture: Texture, position: number): PIXI.Sprite {
    let symbolSprite = new PIXI.Sprite(texture.texture);
    symbolSprite.y = position * this.maxSymbolHeight;
    symbolSprite.scale.x = symbolSprite.scale.y = Math.min(
      this.maxSymbolHeight/symbolSprite.height,
      this.maxSymbolWidth/symbolSprite.width
    );
    symbolSprite.x = (REEL_WIDTH - this.maxSymbolWidth)/2;
    return symbolSprite;
  }

  getRandomTexture(): Texture {
    return this.textures[Math.floor(Math.random() * this.textures.length)];
  }

  setRandomTextureToSymbol(symbol: Symbol): void {
    let randomTexture = this.getRandomTexture();
    symbol.sprite.texture = randomTexture.texture;  
    symbol.texture_id = randomTexture.id;
  }


  startAnimation() {
    if (this.animation) return;
    this.animation = true;
  }

  spin() {
    this.updateBlurAndPosition();
    for (let i=0; i < this.state.length; i++) {
      const sprite = this.state[i].sprite;
      const prevPosition = sprite.y;
      sprite.y = ((this.position.current + i) % this.state.length) * this.maxSymbolHeight - this.maxSymbolHeight+1;
      if (sprite.y < 0 && prevPosition > this.maxSymbolHeight) {
        this.setRandomTextureToSymbol(this.state[i]);
      }
    }
  }

  updateBlurAndPosition() {
    this.blur.blurY = (this.position.current - this.position.prev) * 8;
    this.position.prev = this.position.current;
  }

  getMovingSprites() {
    return this.state.map(val => val.sprite);
  }

  get position(): Position {
    return this._position;
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