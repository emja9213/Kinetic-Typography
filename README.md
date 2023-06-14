# Kinetic Typography

[![Deploy to Firebase Hosting on merge](https://github.com/emja9213/Kinetic-Typography/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/emja9213/Kinetic-Typography/actions/workflows/firebase-hosting-merge.yml) [![Deploy to Firebase Hosting on PR](https://github.com/emja9213/Kinetic-Typography/actions/workflows/firebase-hosting-pull-request.yml/badge.svg)](https://github.com/emja9213/Kinetic-Typography/actions/workflows/firebase-hosting-pull-request.yml)

![Screenshot of main application page](https://ptpimg.me/9uda51.png)

As part of User Interface Programming II / VT23
Group Members:
* Bo Jakob Martin Kalling
* Emanuel Jansson
* Mujtaba Jawad

<!-- Description of the application -->
# Description
We intend to create an application to explore the concept of kinetic typography. Kinetic Typography can be described as 'moving text', an animation technique that mixes motion and text to express ideas using animated objects. The purpose of this application is to allow users interact with the system and explore various creative ideas by changing text animations, typefaces and other parameters as well as typing a custom text. There isn't a traditional "Reward" or "Ultimate goal" to this application, unlike many games or applications out there, rather here we have a medium in which tries to be a source of inspiration for the clients, as well as provide entertainment.

<!-- How to run -->
# How To Run
Start the application using a live-server on any IDE. Once launched, you may see the regular menu and animations.
You can navigate through different animations via the drop-down menu, as well as use the sliders to play around with vaious parameters.
There is also a possibility to change language and color for the background and text, and the knob on the menu controls the font size.
A text box is included so the user can use their own preffered text, feel free to be creative here, use non-alphanumeric characters, use more spaces between letters and etc.

The Neon Effect includes an audio file playing as the user moves their mouse pointer, the faster the mouse movement speed, the higher the sound volume.

<!-- Local Setup -->
## Running it locally:

install node.js: https://nodejs.org/en/download \
install yaireo ui-range: `npm i @yaireo/ui-range` 
(from https://github.com/yairEO/ui-range)

<!-- Live Version URL -->
# Live Version
A live version of the current project based on the 'main' branch is available through the following url:

https://kinetic-typography-uu.web.app/

<!-- Work contribution -->
# Work contribution
Starting from planning phase, it was a team effort and we all discussed the ideas and the design of the application through meetings, while creating sketches and mockups.
Team leader was on a rolling basis, while each member took responsibility at different stages of the project.

Mujtaba (~73 Hours): 

Emanuel Jansson (106 Hours)

Bo Jakob Martin Kalling (? Hours)

Clone this repository, then from the project directory you can start it by running:
### `npm start`
Then open [http://localhost:3000](http://localhost:3000) to view it in your browser.

<!-- Bugs and limitations-->
## Known Bugs
- On some screens font size will scale incorrectly for mobile view.
- The language selector does not re-render the text to update the language (language can still be changed by manually editing the currentLanguage variable between 'en' and 'sv').
- The app can sometimes freeze for a second or two seemingly at random. Likely caused by some inefficiency in what we render and how often we read input data (such as mouse movement).
- Volume doesn't reset when changing effects or when minimizing the window.
- App is missing a tutorial feature, due to time constraints.
