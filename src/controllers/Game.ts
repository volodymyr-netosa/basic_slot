import * as PIXI from "pixi.js";
// @ts-ignore
import { RESOLUTION_CONFIG, ASSETS_URL } from "./config.ts";
// @ts-ignore
import { ReelController } from "./ReelController.ts";
// @ts-ignore
import { Button } from "./Button.ts";
// @ts-ignore
import { TweenController } from "./TweenController.ts";
// @ts-ignore 
import { Reel } from "./Reel.ts"
// @ts-ignore 
import { Button } from "./Button";

const REEL_COUNT = 3;
const SYMBOL_COUNT = 3;

export class Game {
  private app: PIXI.Application;
  private loader: PIXI.Loader;
  private resolution: {x: number, y: number};
  private container : PIXI.Container;
  private tweenController: TweenController<Reel>;
  private reelController: ReelController;
  private button: Button;
  private winningScreenDisplay: boolean;
  private winningTextContainer: PIXI.Container;

  constructor() {
    this.app = new PIXI.Application({...RESOLUTION_CONFIG});
    this.container = new PIXI.Container();
    this.loader = new PIXI.Loader();
    this.tweenController = new TweenController(this.addEventToTicker.bind(this));
    this.initialize();
  }

  addEventToTicker(func: (delta: any) => void) {
    this.app.ticker.add(func);
  }

  initialize() {
    this.loadImages();
    this.winningTextContainer = this.generateWinningTextContainer();
    this.app.stage.interactive = true;
    this.app.stage.on('click', this.onClick.bind(this));
  }

  onClick() {
    if (this.winningScreenDisplay) {
      this.winningScreenDisplay = false;
      this.winningTextContainer.visible = false;
    }
  }

  generateWinningTextContainer(): PIXI.Container {
    let container = new PIXI.Container();
    let style = new PIXI.TextStyle({
      fontFamily: "Comic Sans MS",
      fontSize: 100,
      fill: "yellow",
      stroke: '#ff3300',
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });
    let message = new PIXI.Text('YOU WON!', style);
    let background = new PIXI.Graphics();
    background.beginFill(0x0E4954);
    background.drawRect(60,30,730,490);
    background.endFill();
    background.alpha=0.9;
    message.position.set(
      background.position.x + background.width/5,
      background.position.y + background.height/3
    )
    container.addChild(background);
    container.addChild(message);
    return container;
  }

  setBackground = (bgImage: PIXI.Sprite) => {
    let background = new PIXI.Container();
    background.addChild(bgImage);
    this.app.stage.addChild(background)
  }

  renderCanvas(element: HTMLElement){ 
    if (this.app) element.appendChild(this.app.view) //todo: modify with event emitter?
    let parent = <HTMLElement>this.app.view.parentElement;
    this.fillParentElement();
  }

  private fillParentElement() {
    let parent = <HTMLElement>this.app.view.parentElement;
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
  }

  private initializeReels() {
    this.reelController = new ReelController(
      this.loader,
      this.tweenController,
      this.onWin.bind(this)
    );
    this.app.stage.addChild(this.reelController.getContainer());
  }

  private onLoad() {
    let bgImage = new PIXI.Sprite(
      this.loader.resources["assets/BG.png"].texture
    )
    this.setBackground(bgImage);

    this.initializeReels()
    this.initializeButtons();
  }

  private onWin() {
    this.winningTextContainer.visible = true;
    this.app.stage.addChild(this.winningTextContainer);
    this.winningScreenDisplay = true;
    setTimeout(()=> {
      this.winningScreenDisplay = false;
      this.winningTextContainer.visible = false
    }, 3000);
  }

  private initializeButtons() {
    this.button = new Button(
      this.reelController.startSpin.bind(this.reelController), 
      this.reelController.stopSpin.bind(this.reelController),
      this.loader);
    this.reelController.setToggleButtonCb(
      this.button.toggleButton.bind(this.button)
    );
    this.app.stage.addChild(this.button.getContainer());
  }

  async fetchAssets() {
    const response = await fetch(ASSETS_URL);
    let data = await response.json();
    return data;
  }

  async loadImages() {
    let data = await this.fetchAssets();
    this.loader.add(Object.values(data.files)).load(this.onLoad.bind(this));
  }
}