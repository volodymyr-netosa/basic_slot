import * as PIXI from "pixi.js";
// @ts-ignore
import { ASSETS_URL } from "./config.ts";

export class Loader {
  private loader: PIXI.Loader;
  private barProgress: HTMLElement;
  
  constructor(onLoadCb: ()=>void) {
    this.loader = new PIXI.Loader();
    this.initialize(onLoadCb);
  }

  async initialize(cb: () => void) {
    let data = await this.fetchAssets();
    this.initializeLoaderUI();
    this.loader.add(Object.values(data.files))
      .on("progress", this.loadProgressHandler.bind(this))
      .load(()=>{
        let loader = document.querySelector('#loader');
        if (loader) loader.parentElement.removeChild(loader);
        cb();
      });
  }

  async fetchAssets() {
    const response = await fetch(ASSETS_URL);
    let data = await response.json();
    return data;
  }

  initializeLoaderUI() {
    let loaderDiv = document.createElement('div');
    loaderDiv.id = "loader";

    let loaderInnerDiv = document.createElement('div');
    loaderInnerDiv.id = 'loader-inner';

    let loadingText = document.createElement('h1');
    loadingText.innerText = "Its loading...";

    let loaderBarDiv = document.createElement('div');
    loaderBarDiv.id = "loader-bar";

    this.barProgress = document.createElement('div');
    this.barProgress.id = "loader-bar-progress";

    document.body.appendChild(loaderDiv);
    loaderDiv.appendChild(loaderInnerDiv);
    loaderInnerDiv.appendChild(loadingText);
    loaderInnerDiv.appendChild(loaderBarDiv);
    loaderBarDiv.appendChild(this.barProgress);
  }

  loadProgressHandler() {
    console.log("loading", this.loader.progress);
    this.barProgress.style.width = `${this.loader.progress}%`;
  }

  getLoader() {
    return this.loader;
  }
}