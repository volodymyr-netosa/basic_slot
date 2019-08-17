import * as PIXI from "pixi.js";
import "./public/style.css";
// @ts-ignore
import { ASSETS_URL } from "./config.ts";

const app = new PIXI.Application();
renderCanvas(app);

function setupFullScreenPixi(app: PIXI.Application) {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.renderer.autoDensity = true;
}

function renderCanvas(app: PIXI.Application) {
  app.renderer.backgroundColor = 0x061639;
  setupFullScreenPixi(app);
  document.getElementById('gameElements').appendChild(app.view);
}

async function fetchAssets() {
  const response = await fetch(ASSETS_URL);
  let data = await response.json();
  return data; 
}