interface Symbol {
  id: number,
  texture: PIXI.Texture
}

export class Reel {
  private reelWidth: number = 230;
  private maxSymbolHeight: number = 180;
  private maxSymbolWidth: number = 180;
  private animation: boolean = true;
  private position: {x: number, y: number} = { x: 0, y: 0}
  private delayStop: number = 0;
  private container: PIXI.Container;
  private symbols: Symbol[];
  private state: Symbol[];

  constructor(private loader: PIXI.Loader, public symbolCount: number) {
    this.container = new PIXI.Container();
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
  }

  createReel() {
    this.state = [];
    for (let i = 0; i < this.symbolCount; i++){
      let random_symbol = this.getRandomSymbol();
      let symbolSprite = this.getSymbolSprite(random_symbol, i);
      
      this.container.addChild(symbolSprite);
      this.state.push(random_symbol);
    }
  }

  getSymbolSprite(symbol: Symbol, position: number): PIXI.Sprite {
    let symbolSprite = new PIXI.Sprite(symbol.texture);
    symbolSprite.y = position * this.maxSymbolHeight;
    symbolSprite.scale.x = symbolSprite.scale.y = Math.min(
      this.maxSymbolHeight/symbolSprite.height,
      this.maxSymbolWidth/symbolSprite.width
    );
    symbolSprite.x = (this.reelWidth - this.maxSymbolWidth)/2;
    return symbolSprite;
  }

  getRandomSymbol(): Symbol {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  startAnimation() {

  }

  stopAnimation() {

  }

  getContainer() {
    return this.container;
  }

  getResult() {
  }
}