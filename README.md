# Kinetic Typography
## 1MD003 User Interface Programming II Project VT2023

## Group 3
- Emanuel Jansson (time: 106h)
- Martin Kalling (time: )
- Mujtaba Jawad (time: )

## Project Description

Kinetic Typography can be described as 'moving text', an animation technique that mixes motion and text to express ideas using animated objects. The purpose of this application is to allow users interact with the system and explore various creative ideas by changing text animations, typefaces and other parameters as well as typing a custom text. There isn't a traditional "Reward" or "Ultimate goal" to this application, unlike many games or applications out there, rather here we have a medium in which tries to be a source of inspiration for the clients, as well as provide entertainment.

## Running it online

The main branch is deployed on Firebase, accessible on https://kinetic-typography-uu.web.app/

## Running it locally:

install node.js: https://nodejs.org/en/download \
install yaireo ui-range: `npm i @yaireo/ui-range` 
(from https://github.com/yairEO/ui-range)

Clone this repository, then from the project directory you can start it by running:
### `npm start`
Then open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Known Bugs
- On some screens font size will scale incorrectly for mobile view.
- The language selector does not re-render the text to update the language (language can still be changed by manually editing the currentLanguage variable between 'en' and 'sv').
- The app can sometimes freeze for a second or two seemingly at random. Likely caused by some inefficiency in what we render and how often we read input data (such as mouse movement).
- Volume doesn't reset when changing effects or when minimizing the window.