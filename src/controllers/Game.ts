import * as PIXI from "pixi.js";
// @ts-ignore
import { RESOLUTION_CONFIG, ASSETS_URL } from "./config.ts";
// @ts-ignore
import { ReelController } from "./ReelController.ts";
// @ts-ignore
import { Button } from "./Button.ts";

const REEL_COUNT = 3;
const SYMBOL_COUNT = 3;

export class Game {
  private app: PIXI.Application;
  private loader: PIXI.Loader;
  private resolution: {x: number, y: number};
  private container : PIXI.Container;

  constructor() {
    this.app = new PIXI.Application({...RESOLUTION_CONFIG});
    this.container = new PIXI.Container();
    this.loader = new PIXI.Loader();

    this.initialize();
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

  private initializeReels(
    slotTextures: PIXI.Texture[],
    reelCount: number,
    symbolCount: number
  ) {
    let reelController = new ReelController(
      slotTextures, reelCount, symbolCount
    );
    this.app.stage.addChild(reelController.getContainer());
  }

  private onLoad() {
    let bgImage = new PIXI.Sprite(
      this.loader.resources["assets/BG.png"].texture
    )
    this.setBackground(bgImage);

    const slotTextures = [3,4,5,6,7].map((i) => 
      PIXI.Texture.from(`assets/SYM${i}.png`)
    );
    this.initializeReels(slotTextures, REEL_COUNT, SYMBOL_COUNT)
    this.initializeButtons();
  }

  private initializeButtons() {
    let button = new Button(()=>console.log("pressed"), this.loader);
    this.app.stage.addChild(button.getContainer());
  }

  private initialize() {
    this.loadImages();
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