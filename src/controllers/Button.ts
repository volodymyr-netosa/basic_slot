import * as PIXI from "pixi.js";
// @ts-ignore

export class Button {
  private container: PIXI.Container;
  private active: boolean;
  private activeBtn: PIXI.Texture;
  private inactiveBtn: PIXI.Texture;
  private button: PIXI.Sprite;

  constructor(
    private onClickCb: () => void, 
    private onDisabledClickCb: () => void, 
    private loader: PIXI.Loader
  ) {
    this.container = new PIXI.Container();
    this.active = true;
    this.initialize();
    this.button.on('click', this.onButtonClick.bind(this));
  }

  private initialize(): void {
    this.activeBtn = this.loader.resources["assets/BTN_Spin.png"].texture;
    this.inactiveBtn = this.loader.resources["assets/BTN_Spin_d.png"].texture;

    this.container.position.set(824, 219);
    this.button = this.createButton();
    this.container.addChild(this.button);
  }

  private createButton(): PIXI.Sprite {
    let btn = new PIXI.Sprite(this.activeBtn);
    btn.buttonMode = true;
    btn.interactive = true;
    return btn;
  }

  private onButtonClick(): void {
    if (!this.active) {
      this.onDisabledClickCb();
    }
    else {
      this.onClickCb();
      this.toggleButton();
    }
  }

  toggleButton(): void {
    this.active = !this.active;
    this.button.texture = this.active? this.activeBtn : this.inactiveBtn;
  }

  getContainer(): PIXI.Container {
    return this.container;
  }
}