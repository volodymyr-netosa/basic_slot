import * as express from "express";
import * as morgan from "morgan";
import { Request, Response } from "express";
import * as path from "path";

const app:express.Application = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, 'public/index.html'),
  CONFIG_FILE = path.join(DIST_DIR, '../assets.json'),
  GAME_HTML = path.join(DIST_DIR, 'public/game.html');

app.use(express.static(DIST_DIR));
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(HTML_FILE);
});

app.get('/config', (req: Request, res: Response) => {
  res.sendFile(CONFIG_FILE);
});

app.get('/game', (req: Request, res: Response) => {
  res.sendFile(GAME_HTML)
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
})