## Description
Slot machine game. [Live demo](http://178.157.91.109:8080/game) 
<br>
<img src="https://is.gd/HFilGl" widht="600">
<br>
In case you want to run this on local machine: `npm run build & npm start` and go to http://localhost:8080/game page.  

In theory index http://localhost:8080 page should contain iframe of game page, but it isn't done yet.  
### Loading
Game starts with fetching json assets file from server
and loading this images to PIXI.Loader, while displaying loading screen:  
<img src='https://is.gd/StzFfK' width='400'>  
This file list contains big image (~60 Mb) to make sure that loading works correctly

### Game
UI is pretty obvious. After pressing button, reels start to spin and stop after ~2.5 sec. This time can be skipped by pressing button second time (when it's "disabled").
If there is winning row, winning screen appears (that can be skipped by clicking anywhere on canvas, but it anyway disappears after 3 sec).  
<img src='https://i.imgur.com/mR8DeYS.png' width='400'>  
If you are not lucky enough and reach out of money, next screen appears that disappears after 1 sec (i set bet to 200 before making this screen, so don't be fooled by money amount :) ) and wheel is disabled forever. 
<img src='https://is.gd/ezx9OW' width='400'>  
To fix this you can refresh page and receive starting 100 coins. Money amount saving to localStorage after every spin, so you can safely refresh page when you want (not including 0 coins exception) without losing coins.

### Resizing
Game is resizing-friendly, so you can set arbitary resolution and play on laptops/mobiles, but due to assets and time limitations, portrait mobile layout seems not very good.   
<img src='https://i.imgur.com/FVQPEQr.png' height='400'> 
<img src='https://i.imgur.com/Pp8w4uH.png' width='400'><br>  
<img src='https://media.giphy.com/media/eHXvYkxNdt5z6pFPeP/giphy.gif' widht='400'>

### Architecture
Event-based architecture on my opinion is better solution, so the next developing step will be refactoring this multiple classes with callback injection to events.  
In this application i have next classes:  
* Game - main class that contains PIXI.Application and handle all dependency and other class instantiations
* ReelController - Controls all Reels, like a container for them, calculates if there is winning row or not
* Reel - Class that describes reel itself. Contains wheel spin logic and other stuff
* Bank - obviously
* Loader - handle external assets dependency, render loading screen
* TweenController - handle spin animation, calculates tween position for reels and handle all animation logic.  

There can be a bit of unused or/and duplicate code that i forgot to remove.  
Thanks for reading :)
