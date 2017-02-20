# Bollywood Mania Quiz

## Description
A single page quiz application (Frontend only).


##Contains: 

* Ducks architecture (https://github.com/erikras/ducks-modular-redux). Simple pattern to write redux apps.
* ES6 - 7 Support with Babel
* React Routing
* Hot module reloading
* webpack
* Sass support, just import your styles wherever you need them
* eslint to keep your js readable


## Run the app (Development)

0. ```npm install```. (``yarn install`` also works fine)
0. ```npm start```

## Build the app (Deployment)
```npm run build```

This will build the app into the "dist" directory in the root of the project. It contains the index.html along with the minified assets, ready for production.


## Base Cloned from:
https://github.com/jpsierens/webpack-react-redux.git

## Basic feature added till now:
0. Open localhost:3000, you'll see landing page to ask your user name
<img src="/docs/screenshots/1.png" alt="Landing page" width="550">

0. Enter your user name and press Play
<img src="/docs/screenshots/2.png" alt="Enter username and start playing" width="550">

0. Timer of 3 seconds will be shown
<img src="/docs/screenshots/3.png" alt="3 seconds timer" width="550">

0. Questions screen looks like this. Only 1 options is correct. Click on each button brings ripple effect
<img src="/docs/screenshots/4.png" alt="Sample question screen" width="550">

0. After completing 5 questions, you'll be shown report.
<img src="/docs/screenshots/5.png" alt="Your quiz report" width="550">



## TODO:
0. Add random quiz questions instead of 1 set
0. Add retry option at the end

0. Add middleware to make promise call to apis and attach to store actions
0. On demand module loading
0. Code splitting
0. Add offline functionality / Service worker[pretty good example since it also has an app shell]
