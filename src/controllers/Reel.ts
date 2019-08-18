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
  sprite: PIXI.Sprite,
  row: number
}

interface Position { 
  current: number,
  prev: number
}

export class Reel implements TweenControlled {
  private maxSymbolHeight: number = 180;
  private maxSymbolWidth: number = 180;
  private container: PIXI.Container;
  private textures: Texture[];
  private state: Symbol[];
  private blur: PIXI.filters.BlurFilter;
  private _position: Position = { current:0, prev: 0 }; //this is position for spinning
  private lastSpinPosition: number = 0;  
  // and this is position for calculation row for symbols https://i.pinimg.com/236x/9e/50/b8/9e50b88236ffedc09fe3159df10344e3.jpg
                                    
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
      const symbol = {
        texture_id: randomTexture.id,
        sprite: symbolSprite,
        row: i
      };
      this.container.addChild(symbolSprite);
      this.state.push(symbol);
    }
  }

  prepareSymbolSprite(texture: Texture, position: number): PIXI.Sprite {
    let symbolSprite = new PIXI.Sprite(texture.texture);
    symbolSprite.y = (position - 1) * this.maxSymbolHeight; // -1 cause 1st element is hidden on top of screen
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

  spin() {
    this.updateBlurAndPosition();
    for (let i=0; i < this.state.length; i++) {
      const sprite = this.state[i].sprite;
      const prev_y = sprite.y;
      const position = (this.position.current + i) % this.state.length;
      sprite.y = (position - 1) * this.maxSymbolHeight;
      if (sprite.y < 0 && prev_y > this.maxSymbolHeight) {
        this.setRandomTextureToSymbol(this.state[i]);
      }
    }
  }

  onSpinEnd() { 
    let offset = (this.position.current - this.lastSpinPosition) % this.state.length;
    this.state.map((symbol) => {
      symbol.row = (symbol.row + offset) % this.state.length;
    });
    this.lastSpinPosition = this.position.current;
  }

  updateBlurAndPosition() {
    this.blur.blurY = (this.position.current - this.position.prev) * 8;
    this.position.prev = this.position.current;
  }

  getMovingSprites() {
    return this.state.map(val => val.sprite);
  }

  getReelValues() {
    //remove top row, that uses only for animation
    let visibleSymbols = this.state.filter(symbol => symbol.row != 0)
      .sort((a,b) => a.row - b.row) 
      .map(symbol => symbol.texture_id);
    console.log('visible', visibleSymbols);
    return visibleSymbols
  }

  get position(): Position {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  getContainer() {
    return this.container;
  }
}