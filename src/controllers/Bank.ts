import * as PIXI from "pixi.js";

export class Bank {
  private amount: number;
  private bet: number;
  private lastWin: number = 0;

  private container: PIXI.Container;
  
  constructor() {
    this.container = new PIXI.Container();
    this.initialize();
  }

  initialize() {
    let value = this.getFromLocalStorage();
    if (!value) {
      this.amount = 100;
      this.bet = 5;
    }
    this.createUI();
  }

  createUI() {
    let style = new PIXI.TextStyle({
      fontFamily: "Comic Sans MS",
      fontSize: 18,
      fill: "yellow",
    });
    let bank = new PIXI.Graphics();
    bank.lineStyle(4, 0xd5de31);
    bank.beginFill(0x0E4954);
    bank.drawRect(0, 0, 120, 85);
    bank.position.set(815, 370);
    bank.endFill();
    bank.name = 'bank';
    let bankInfo = new PIXI.Text("Money: ", style);
    let winInfo = new PIXI.Text("Win: ", style);

    bankInfo.position.set(
      bank.position.x + bank.width/8,
      bank.position.y + bank.height/8
    )
    bankInfo.name = 'bankInfo';
    winInfo.position.set(
      bankInfo.position.x,
      bankInfo.position.y + bankInfo.height + bank.height/8
    )
    winInfo.name = 'winInfo';

    this.container.addChild(bank);
    this.container.addChild(bankInfo);
    this.container.addChild(winInfo);
    this.renderBankAmount();
  }

  makeBet(bet?: number): boolean {
    let betAmount = bet || this.bet;
    if (this.amount < betAmount) {
      return false
    }
    this.lastWin = 0;
    this.bet = betAmount;
    this.amount-= betAmount;
    this.renderBankAmount();
    return true;
  }

  winHandler() {
    let winAmount = this.bet*2;
    this.lastWin = winAmount;
    this.amount += winAmount;
    this.renderBankAmount();
  }

  loseHandler() {
    this.lastWin = 0;
    this.renderBankAmount();
  }

  renderBankAmount() {
    (<PIXI.Text>this.container.getChildByName('bankInfo')).text = `Money: ${this.amount}`;
    (<PIXI.Text>this.container.getChildByName('winInfo')).text = `Win: ${this.lastWin}`;

  }

  saveToLocalStorage() {
    window.localStorage.setItem('bank', JSON.stringify({
      amount: this.amount,
      bet: this.bet
    }));
  }

  getFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem('bank'));
  }

  getContainer() {
    return this.container;
  }
}