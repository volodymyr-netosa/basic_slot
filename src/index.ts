import "./public/style.css";
// @ts-ignore
import { RESOLUTION_CONFIG } from "./controllers/config.ts";
// @ts-ignore
import { Game } from "./controllers/Game.ts"

window.addEventListener("resize", (e) => {
  let viewport = document.getElementById("viewport");
  resizeViewport(viewport);
  centerElement(viewport);
});

function resizeViewport(viewport: HTMLElement) {
  const ratio = Math.min(
    window.innerWidth/viewport.clientWidth,
    window.innerHeight/viewport.clientHeight
  )
  viewport.style.transform = `scale(${ratio})`;
}

function setupViewport(viewport: HTMLElement) {
  viewport.style.height = `${RESOLUTION_CONFIG.height}px`;
  viewport.style.width = `${RESOLUTION_CONFIG.width}px`;
}

function centerElement(element: HTMLElement) {
  let topOffset = (window.innerHeight - element.clientHeight)/2;
  let leftOffset = (window.innerWidth - element.clientWidth)/2;
  console.log('resizing', topOffset, leftOffset);
  element.style.top = `${topOffset}px`;
  element.style.left = `${leftOffset}px`;
}

function initRender() {
  const app = new Game();
  let gameElement = document.getElementById('gameElements');
  let viewport = document.getElementById("viewport");
  setupViewport(viewport);
  resizeViewport(viewport);
  centerElement(viewport);
  app.renderCanvas(gameElement);
}

initRender();