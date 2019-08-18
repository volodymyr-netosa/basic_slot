import * as PIXI from "pixi.js";
// @ts-ignore
import { RESOLUTION_CONFIG } from "./config.ts";
// @ts-ignore
import { ReelController } from "./ReelController.ts";
// @ts-ignore
import { Button } from "./Button.ts";
// @ts-ignore
import { TweenController } from "./TweenController.ts";
// @ts-ignore 
import { Reel } from "./Reel.ts"
// @ts-ignore 
import { Loader } from "./Loader.ts";
// @ts-ignore 
import { Bank } from "./Bank.ts"; 

export class Game {
  private app: PIXI.Application;
  private loader: Loader;
  private resolution: {x: number, y: number};
  private container : PIXI.Container;
  private tweenController: TweenController<Reel>;
  private reelController: ReelController;
  private button: Button;
  private winningScreenDisplay: boolean = false;
  private noMoneyScreenDisplay: boolean = false;
  private bank: Bank;

  constructor() {
    this.app = new PIXI.Application({...RESOLUTION_CONFIG});
    this.container = new PIXI.Container();
    this.tweenController = new TweenController(this.addEventToTicker.bind(this));
    this.loader = new Loader(this.onAssetsLoad.bind(this));
    this.initialize();
  }

  addEventToTicker(func: (delta: any) => void) {
    this.app.ticker.add(func);
  }

  initialize() {
    this.app.stage.interactive = true;
    this.app.stage.on('pointerdown', this.onClick.bind(this));
  }

  onClick() { //make more flexible
    if (this.winningScreenDisplay) {
      this.winningScreenDisplay = false;
      this.app.stage.getChildByName('winningText').visible = false;
    }
  }

  initializeWinningScreen() {
    let text = this.generateWinningText();
    let winningTextContainer = this.generateTextContainer(text);
    winningTextContainer.name = 'winningText';
    winningTextContainer.visible = false;
    this.app.stage.addChild(winningTextContainer);
  }
  
  initializeNoMoneyScreen() {
    let text = this.generateNoMoneyText();
    let noMoneyTextContainer = this.generateTextContainer(text);
    noMoneyTextContainer.name = 'noMoneyText';
    noMoneyTextContainer.visible = false;
    this.app.stage.addChild(noMoneyTextContainer);
  }

  generateWinningText(): PIXI.Text {
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
    return message;
  }

  generateNoMoneyText(): PIXI.Text {
    let style = new PIXI.TextStyle({
      fontFamily: "Comic Sans MS",
      fontSize: 48,
      fill: "yellow",
      stroke: '#ff3300',
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });
    let message = new PIXI.Text('NOT ENOUGH MONEY!', style);
    return message;
  }

  generateTextContainer(text: PIXI.Text): PIXI.Container {
    let container = new PIXI.Container();
    let background = new PIXI.Graphics();
    background.beginFill(0x0E4954);
    background.drawRect(60,30,730,490);
    background.endFill();
    background.alpha=0.9;
    text.position.set(
      background.position.x + background.width/5,
      background.position.y + background.height/3
    )
    container.addChild(background);
    container.addChild(text);
    return container;
  }

  setBackground = (bgImage: PIXI.Sprite) => {
    let background = new PIXI.Container();
    background.addChild(bgImage);
    this.app.stage.addChild(background)
  }

  renderCanvas(element: HTMLElement){ 
    if (this.app) element.appendChild(this.app.view) //todo: modify with event emitter?
    this.fillParentElement();
  }

  private fillParentElement() {
    let parent = <HTMLElement>this.app.view.parentElement;
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
  }

  private initializeReels() {
    this.reelController = new ReelController(
      this.loader.getLoader(),
      this.tweenController,
      this.onWin.bind(this)
    );
    this.app.stage.addChild(this.reelController.getContainer());
  }

  private initializeBank() {
    this.bank = new Bank();
    this.app.stage.addChild(this.bank.getContainer())
  }

  private onAssetsLoad() {
    let bgImage = new PIXI.Sprite(
      this.loader.getLoader().resources["assets/BG.png"].texture
    )
    this.setBackground(bgImage);
    
    this.initializeReels()
    this.initializeButtons();
    this.initializeBank();
    this.initializeNoMoneyScreen();
    this.initializeWinningScreen();
  }

  private showTextScreen(
    containerName: string, 
    onTimeoutCloseCb: () => any, 
    timeout: number = 3000
  ) {
    let container = this.app.stage.getChildByName(containerName);
    container.visible = true;
    console.log(container.visible);
    setTimeout(() => {
      container.visible = false;
      onTimeoutCloseCb();
    }, timeout)
  }

  private onWin() {
    this.winningScreenDisplay = true;
    this.bank.winHandler();
    this.showTextScreen('winningText', () => this.winningScreenDisplay = false);
  }

  private onStartButtonClick() {
    let enoughMoney = this.bank.makeBet();
    if (enoughMoney) {
      this.reelController.startSpin();
    }
    else  {
      this.noMoneyScreenDisplay = true;
      this.showTextScreen('noMoneyText', () => this.noMoneyScreenDisplay = false, 1000);
    }
  }

  private initializeButtons() {
    this.button = new Button(
      this.onStartButtonClick.bind(this), 
      this.reelController.stopSpin.bind(this.reelController),
      this.loader.getLoader());
    this.reelController.setToggleButtonCb(
      this.button.toggleButton.bind(this.button)
    );
    this.app.stage.addChild(this.button.getContainer());
  }
}
