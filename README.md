## Overview

Mrs. Snaccman is a multiplayer twist on the popular retro arcade game Pacman. Many of us have played this timeless classic. In the original,the player controls pacman as he avoids ghosts and attempts to collect as many pellets as he can before dying. The controls use the simple arrow keys on the keyboard to move Pacman around the grid.

In Mrs. Snaccman, we plan to add multiplayer functionalities to make the game more engaging and fun to play with friends. We will follow the classic, retro style of Pacman and make it better with modern day technologies of javscript canvas and web sockets.

### Functionality and MVP Features

#### Functionality
*Players will use the arrow keys to control their sprites
*Snaccman
    *Goal is to collect all the pellets on the screen
    *Game ends when the player runs out of lives
*Ghosts
    *Goal is to work together to kill Snaccman as many times as possible
    *Unless Snaccman is powered up, touching Snaccman will kill her

#### MVP Features

- [ ] Create a perfect clone of original Pacman: We can't have the same dimensions and animations but we will try our best to have the gameplay exactly the same

- [ ] Implement multiplayer: Add multiplayer to our clone. This multiplayer will allow users to play as either Snaccman or the ghosts chasing her.

- [ ] Add scores and statistics: Will have statistics be binded to a user's account. Leaderboards will contain the top ranked players in specific categories.

- [ ] Balancing and Upgrades: Implement changes that will make the game more even for both the Snaccman and Ghost teams.

### Wireframe
INSERT PICTURE OF WELCOME SCREEN HERE

The app will initially consist of a single page that will contain a create and join lobby. 

INSERT PICTURE OF LOBBY HERE

Upon creating or joining a lobby, the user will be automatically assigned as a ghost and can move over as Snaccman unless there is already someone who claimed it. A start button will be at the bottom that the creator of the room can click to start the game.

INSERT PICTURE OF START HERE

The grid will be rendered and the game will be started after a short countdown. Game will be played until either snaccman clears the level or loses all her lives.

### Architecture and Technologies

#### Technologies 
* MERN stack
    * MangoDB/Express/Redux/Node.js
    * used to connect the front-end and back-end functionalities
* Canvas
    * Renders our game in our react component
    * Simplest and easiest to learn tool to render a game
* Socket.io
    * Handles multiplayer input
    * essential for multiplayer
* Webpack
    * bundles multiple scripts into one accessible source
    * makes life a lot easier

#### Architecture
In addition to the webpack entry file, we will have four main folders/files:

Classes: This folder holds all the classes for the various game objects and the grid for the game.

Game.js: Handles all the game logic and rendering

### Implementation Timeline
#### Day 1:

- [ ] Build a grid and walls that Snaccman can transverse
- [ ] Start User Authentication

#### Day 2:
- [ ] Add moving sprites and basic game logic
- [ ] Complete User Authentication

#### Day 3:
- [ ] Finish clone and integrate with User Authentication
- [ ] Start adding multiplayer functionalities

#### Day 4:
- [ ] Finish adding multiplayer
- [ ] Style website
- [ ] Start lobby

#### Day 5: 
- [ ] Finish lobby