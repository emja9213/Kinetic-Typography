/**
 * File: App.js
 *
 * This file contains the app class containing the main part of the javaScript needed to run the app. 
 * It contains the canvas, menu, menu elements and effects which are drawn on the screen. 
 *
 * Authors: Emanuel Jansson, Martin Kalling, Mujstaba Jawad
 */
import React, { useState } from 'react';
import './App.css';
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound';
import '@yaireo/ui-range';
import _ from 'lodash';
import Knob from './Knob.js';

// Execute the code in strict mode, not allowing bad syntax such as undeclared variables.
//
"use strict";

class App extends React.Component {

  constructor(props) {
    super(props);
    // Variable for whether to use mobile or desktop view.
    //
    this.mobileView;

    // Variable for whether to display the menu closed or open.
    //
    this.menuOpen;

    // Containers for elements
    //
    this.parametersContainer;
    this.input;
    this.effectSelector;
    // this.fontSizeSliderDiv; // Not currently used (Replaced by rotary knob)
    //
    this.speedSliderDiv;
    this.amplitudeSliderDiv;
    this.waveLengthSliderDiv;
    this.bgColorPicker;
    this.fontColorPicker;
    this.glowColorPicker;
    this.languageSelector;

    // Variable storing the text to drawn on the canvas.
    //
    this.text;

    // Selectable effects.
    //
    this.effectActions = [
      { value: 'wave', label: 'Wave Effect' },
      { value: 'tanRot', label: 'Tan Rotation Effect' },
      { value: 'interactiveMouse', label: 'Interactive Mouse' },
      { value: 'neonEffect', label: 'Neon Effect' },
      { value: 'none', label: 'Blank Canvas' }
    ];

    // Effect variables applied to the drawn text.    
    //
    this.speed;    
    this.fontSize = 32;
    this.amplitude;
    this.waveLength;
    this.selectedWeight;
    this.brightness;
    this.bgBrighten;
    this.fontColor;
    this.fontShadowColor;
    this.fontWeights = ['p5.NORMAL','p5.ITALIC','p5.BOLD','p5.BOLDITALIC'];

    // Sound files are loaded into these sound variables.
    //
    this.song = null;
    this.hum = null;

    // Div containing the rotary knob.
    //
    this.knobDiv = null;

    // Language variables and dict.
    //
    this.currentLanguage = 'en';
    this.languages = [
      { key: 'en', name: 'English'},
      { key: 'sv', name: 'Svenska'}
    ]
    this.dict = {
      'en': {
      'language-selector': 'Choose language',
      'font-size': 'Font Size',
      'speed': 'Speed',
      'amplitude': 'Amplitude',
      'wave-length': 'Wave Length',
      'wave-effect': 'Wave',
      'tanrot-effect': 'Tan Rotation',
      'interactive-mouse-effect': 'Interactive Mouse',
      'neon-effect': 'Neon',
      'blank-canvas': 'Blank Canvas'
      },
      'sv': {
      'language-selector': 'Välj språk:',
      'font-size': 'Textstorlek',
      'speed': 'Hastighet',
      'amplitude': 'Amplitud',
      'wave-length': 'Våglängd',
      'wave-effect': 'Våg',
      'tanrot-effect': 'Tan Rotation',
      'interactive-mouse-effect': 'Interaktiv Mus',
      'neon-effect': 'Neon',
      'blank-canvas': 'Tomt Kanvas'
      }
    }
  }
  
  // Function used to select strings for the current language.
  //
  getTranslation = (language, key) => {
    return this.dict[language][key];
  }

  // Function for displaying the appropriate menu elements for the wave effect.
  // It sets positions relative to the screen size and with different values for mobile view.  
  // This is a helper function called by showSelectedMenuElements().
  // TODO: Adjust size of elements for high resolution screens.
  //
  // NOTE: ALL THE "MenuElements" FUNCTIONS ARE SPAGHETTI + REPEATED CODE + DEAD CODE, DUCT TAPED TOGETHER FOR FINAL PRESENTATION
  // TODO: CLEAN UP BEFORE HANDING IN
  waveMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    // this.fontSizeSliderDiv.show();
    this.speedSliderDiv.show();
    this.amplitudeSliderDiv.show();
    this.waveLengthSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
    this.languageSelector.show();
    if(this.knobDiv) { this.knobDiv.show(); }

    // Reposition elements
    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    if (this.mobileView) {
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);

      this.bgColorPicker.position(columnLeft, rowBottom);
  
      this.fontColorPicker.position(columnLeft + 70, rowBottom);

      this.glowColorPicker.position(columnLeft + 140, rowBottom);
      this.glowColorPicker.hide(); // TODO clean up, this is a "duct tape solution" to the glow color picker showing up on start
  
      this.languageSelector.position(columnRight, rowBottom);

      // this.fontSizeSliderDiv.position(columnLeft, rowTop);
      this.speedSliderDiv.position(columnRight, rowTop);
      this.amplitudeSliderDiv.position(columnLeft, rowMid);
      this.waveLengthSliderDiv.position(columnRight, rowMid);

    } else { // TODO Break up into helper function + avoid repeated code
      this.effectSelector.position(5,  3 + window.innerHeight * 0.02);
      this.input.position(5, 20 + window.innerHeight * 0.04);

      this.bgColorPicker.position(20, 200 + window.innerHeight * 0.30);
      this.fontColorPicker.position(20, 220 + window.innerHeight * 0.33);
      this.glowColorPicker.position(20, 240 + window.innerHeight * 0.36);
      this.glowColorPicker.hide(); // TODO proper solution, this is a "duct tape solution" to the glow color picker showing up on start

      this.languageSelector.position(20, 240 + window.innerHeight * 0.36);

      // this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
      this.speedSliderDiv.position(5, 80 + window.innerHeight * 0.12);
      this.amplitudeSliderDiv.position(5, 120 + window.innerHeight * 0.18);
      this.waveLengthSliderDiv.position(5, 160 + window.innerHeight * 0.24);
    }
  }

  // Function for displaying the appropriate menu elements for the tan rotation effect.
  // It sets positions relative to the screen size and with different values for mobile view.  
  // This is a helper function called by showSelectedMenuElements().
  // TODO: Adjust size of elements for high resolution screens.
  //
  tanRotMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    // this.fontSizeSliderDiv.show();
    this.speedSliderDiv.show();
    this.amplitudeSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
    this.languageSelector.show();
    if(this.knobDiv) { this.knobDiv.show(); }

    // Reposition elements
    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    if (this.mobileView) {
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);

      this.bgColorPicker.position(columnLeft, rowBottom);
  
      this.fontColorPicker.position(columnLeft + 70, rowBottom);

      this.glowColorPicker.position(columnLeft + 140, rowBottom);
  
      this.languageSelector.position(columnRight, rowBottom);

      // this.fontSizeSliderDiv.position(columnLeft, rowTop);
      this.speedSliderDiv.position(columnRight, rowTop);
      this.amplitudeSliderDiv.position(columnLeft, rowMid);
      this.waveLengthSliderDiv.position(columnRight, rowMid);

    } else { // TODO Break up into helper function + avoid repeated code
      this.effectSelector.position(5,  3 + window.innerHeight * 0.02);
      this.input.position(5, 20 + window.innerHeight * 0.04);
  
      this.bgColorPicker.position(20, 160 + window.innerHeight * 0.24);
      this.fontColorPicker.position(20, 180 + window.innerHeight * 0.27);

      this.languageSelector.position(20, 200 + window.innerHeight * 0.30);

      // this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
      this.speedSliderDiv.position(5, 80 + window.innerHeight * 0.12);
      this.amplitudeSliderDiv.position(5, 120 + window.innerHeight * 0.18);
    }
  }

  // Function for displaying the appropriate menu elements for the interactive mouse effect.
  // It sets positions relative to the screen size and with different values for mobile view.  
  // This is a helper function called by showSelectedMenuElements().
  // TODO: Adjust size of elements for high resolution screens.
  //
  intMouseMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    // this.fontSizeSliderDiv.show();
    this.languageSelector.show();
    if(this.knobDiv) { this.knobDiv.show(); }

    // Reposition elements
    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    if (this.mobileView) {
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);
  
      this.languageSelector.position(columnRight, rowBottom);

      // this.fontSizeSliderDiv.position(columnLeft, rowTop);
      this.speedSliderDiv.position(columnRight, rowTop);
      this.amplitudeSliderDiv.position(columnLeft, rowMid);
      this.waveLengthSliderDiv.position(columnRight, rowMid);
    } else {
      this.effectSelector.position(5,  3 + window.innerHeight * 0.02);
      this.input.position(5, 20 + window.innerHeight * 0.04);

      this.languageSelector.position(20, 80 + window.innerHeight * 0.12);
      
      // this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
    }
  }
  
  // Function for displaying the appropriate menu elements for the neon effect.
  // It sets positions relative to the screen size and with different values for mobile view. 
  // This is a helper function called by showSelectedMenuElements().
  // TODO: Adjust size of elements for high resolution screens.
  //
  neonMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    // this.fontSizeSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
    this.glowColorPicker.show();
    this.languageSelector.show();
    if(this.knobDiv) { this.knobDiv.show(); }

    // Reposition elements    
    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;
    
    if (this.mobileView) {
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);

      this.bgColorPicker.position(columnLeft, rowBottom);
      this.fontColorPicker.position(columnLeft + 70, rowBottom);
      this.glowColorPicker.position(columnLeft + 140, rowBottom);
  
      this.languageSelector.position(columnRight, rowBottom);

      // this.fontSizeSliderDiv.position(columnLeft, rowTop);
      this.speedSliderDiv.position(columnRight, rowTop);
      this.amplitudeSliderDiv.position(columnLeft, rowMid);
      this.waveLengthSliderDiv.position(columnRight, rowMid);
    } else {
      this.effectSelector.position(5,  3 + window.innerHeight * 0.02);
      this.input.position(5, 20 + window.innerHeight * 0.04);

      this.bgColorPicker.position(20, 80 + window.innerHeight * 0.12);
      this.fontColorPicker.position(20, 120 + window.innerHeight * 0.15);
      this.glowColorPicker.position(20, 160 + window.innerHeight * 0.18);

      this.languageSelector.position(20, 200 + window.innerHeight * 0.21);

      // this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
      this.speedSliderDiv.position(5, 80 + window.innerHeight * 0.12);
      this.amplitudeSliderDiv.position(5, 120 + window.innerHeight * 0.18);
      this.waveLengthSliderDiv.position(5, 160 + window.innerHeight * 0.24);
    }
  }

  // Function for displaying a blank background (no text is drawn on screen).
  // It only displays the effect selector and is mainly used for development.
  // In some earlier experiments this blank screen was used to add multiple texts onto the canvas that could be dragged and dropped.
  //
  blankMenuElements = () => {
    this.effectSelector.show();
  }

  // Function for hiding all menu elements whenever the menu is closed or when changing effects.
  // When changing effects call this function to clear the menu and then call showSelectedMenuElements() to display the appropriate menu elements.
  //
  hideAllMenuElements = () => {
    this.effectSelector.hide();
    this.input.hide();
    // this.fontSizeSliderDiv.hide();
    this.speedSliderDiv.hide();
    this.amplitudeSliderDiv.hide();
    this.waveLengthSliderDiv.hide();
    this.bgColorPicker.hide();
    this.fontColorPicker.hide();
    this.glowColorPicker.hide();
    this.languageSelector.hide();
    this.knobDiv.hide();
  }

  // Function for showing the appropriate menu elements whenever the menu is closed or when changing effects.
  // It selects the appropriate show-function depending on what value is selected in the effect selector. 
  // When changing effects be sure to call hideAllMenuELements() first to clear menu. 
  // Note that this is not necessary when opening the menu as the elements are already hidden.
  //
  showSelectedMenuElements = () => {
    switch (this.effectSelector.selected()) {
      case 'wave':
        this.waveMenuElements();
        break;
      case 'tanRot':
        this.tanRotMenuElements();
        break;
      case 'interactiveMouse':
        this.intMouseMenuElements();
        break;
      case 'neonEffect':
        this.neonMenuElements();
        break;
      default: // This covers the blank canvas option
        this.blankMenuElements();
    }
  }

  // Check for selected effect animation and apply it
  //
  effectHandler(effectSelector, p5) {
    p5.cursor(p5.ARROW);

    if (effectSelector.selected() === "tanRot") {
      this.tanRotEffect(p5); // apply the tan rotation effect to the text

    } else if (effectSelector.selected() === "wave") {
      this.waveEffect(p5); // apply the wave effect to the text

    } else if (effectSelector.selected() === "interactiveMouse") {
      this.interactiveMouseEffect(p5); // apply the interactive mouse effect to the text 

    } else if (effectSelector.selected() === "neonEffect") {
      this.neonEffect(p5); // apply the neon effect to the text

    } else if (effectSelector.selected() === "none") {
      // do nothing for now (blank canvas)
      void(0);
    }
    else {
      p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);
    }
  }

  // This function is used to load files before running the setup, sound files in our case. 
  // It doesn't do anything currently but was used earlier in development for experimental use of sound such as playing music.
  //
  preload = (p5) => {
    console.log('preload function started');
    // p5.soundFormats('mp3', 'ogg');
    // this.song = p5.loadSound('media/sound/The_Flashbulb_-_Warm_Hands_In_Cold_Fog');
    // console.log(this.song);
    console.log('preload function ran successfully');
    // sleep for 1 second to allow song to load
    // new Promise(resolve => setTimeout(resolve, 1000));
  }

  // This function runs at start and sets initial values of many variables as well as building the canvas.
  // On the canvas it draws the menu and its elements, as well as the interactive text.
  //
  setup = (p5, canvasParentRef) => {
    const cnv = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    /*
    #############################
    ###  Canvas Configuration ###
    #############################
    */ 
    // Sets framerate to 60 frames per second, this is the rate at which the canvas gets drawn.
    //
    p5.frameRate(60);
    
    // Set text to center-align and angles to be read as degrees. 
    //
    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);

    // Sets CSS-style of canvas.
    //
    cnv.style('display', 'block');

    // Set menu to open on start.
    //
    this.menuOpen = true; 

    // Set default values of variables for use by the neon effect. 
    //
    this.brightness = 0;
    this.bgBrighten = true;

    // Load sound files.
    //
    p5.soundFormats('mp3', 'ogg');
    this.song = p5.loadSound('https://freesound.org/data/previews/612/612610_5674468-lq');
    this.hum = p5.loadSound('media/sound/hum.ogg');

    // Load and set font.
    //
    const cairoPlayFont = p5.loadFont('/fonts/Cairo_Play/CairoPlay-VariableFont_slnt,wght.ttf');
    p5.textFont(cairoPlayFont);

    // builds container for menu elements.
    //
    this.parametersContainer = p5.createDiv().id('parameters-container');
    this.parametersContainer.style('display', 'flex','position','inherit');


    /*
    #############################
    ######  Helper Methods ######
    #############################
    */ 

    // This function builds a slider with the given parameters in rangeDetails (label, min value, max value, defaultValue, and step size.)
    //
    const createRangeSlider = (rangeDetails, posX, posY) => {
      // Create div to later place the slier in and make it a child of parametersContainer.
      //
      const sliderDiv = p5.createDiv();
      sliderDiv.parent(this.parametersContainer);

      // convert label to camel case
      //
      const classLabel = _.camelCase(rangeDetails.label);

      // Set parameters of the slider according to rangeDetails.
      //
      sliderDiv.addClass(`range-slider ${classLabel}-range-slider`);
      sliderDiv.child(p5.createP(rangeDetails.label).style('padding', '1.5rem 0.7rem'));
      sliderDiv.position(posX, posY);
      sliderDiv.style(`--min:${rangeDetails.min}`);
      sliderDiv.style(`--max:${rangeDetails.max}`);
      sliderDiv.style(`--value`, `${rangeDetails.defaultValue} !important`);
      sliderDiv.style(`--text-value`, `"${rangeDetails.defaultValue}" !important`);
      sliderDiv.style(`width`, `13rem`);

      // Build the slider and set it as a child of sliderDiv.
      //
      const slider = p5.createSlider(rangeDetails.min, rangeDetails.max, rangeDetails.defaultValue, rangeDetails.step);
      slider.addClass('range');
      slider.style('width', '13rem');
      slider.attribute('oninput', `this.parentNode.style.setProperty('--value',this.value); this.parentNode.style.setProperty('--text-value', JSON.stringify(this.value))`);
      sliderDiv.child(slider);

      // Adds the output value of the slider as a child of the sliderDiv. 
      //
      const sliderOutput = p5.createElement('output');
      sliderDiv.child(sliderOutput);

      // Adds the progress bar that "fills up" the slider to the currently selected point on the slider and adds it as a child of sliderDiv.
      //
      const progressDiv = p5.createDiv();
      progressDiv.addClass('range-slider__progress');
      progressDiv.style('width', '13rem');
      sliderDiv.child(progressDiv);

      return [sliderDiv, slider];
    };

    /*
    #############################
    ####  Menu Configuration  ###
    #############################
    */ 

    // Create the effect selector.
    //
    this.effectSelector = p5.createSelect();

    // generate new option for each value in effectActions array.
    //
    this.effectActions.forEach(option => {
      this.effectSelector.option(option.label, option.value);
    });
    // Update the menu to display the correct menu elements whenenver a different effect is selected. 
    // Then calls on the effect handler to apply the corresponding effect to the interactive text.
    //
    this.effectSelector.changed(() => {
      this.setState({ effect: this.effectSelector.value() });
      this.hideAllMenuElements();
      this.showSelectedMenuElements();
      this.effectHandler(this.effectSelector, p5);
    });  

    // Create the text box where the user types in their text, initialized with the text "Kinetic Typography". 
    //
    this.input = p5.createInput('Kinetic Typography');

    // Create the color pickers for the background color, font color, and glow color (for the neon effect). 
    // TODO add text to inform the user which one is which.
    //
    this.bgColorPicker = p5.createColorPicker("#FBF0EA");
    this.fontColorPicker = p5.createColorPicker("#000000");
    this.glowColorPicker = p5.createColorPicker("#27BC9A");

    // Create the language selector and generate options for each language defined in the dict variable  constructor.
    //
    this.languageSelector = p5.createSelect();
    this.languages.forEach(languages => {
      this.languageSelector.option(languages.name, languages.key);
    });

    // Update the variable for selected language and update the text displayed in the app. 
    // TODO fix it so it actually updates the text. 
    // It is supposed to update the text but we haven't been able to make it work yet.
    //
    this.languageSelector.changed(() => {
      console.log(this.languageSelector.value());
      this.currentLanguage = this.languageSelector.value();
    });

    // Set parameters for sliders, defined by label, min value, max value, default value, and step size. 
    // TODO: maybe define a structure for this.
    //
    let fontSizeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'font-size'), min: 12, max: 256, defaultValue: 38, step: 1};
    let speedRangeDetails = {label: this.getTranslation(this.currentLanguage, 'speed'), min: 0.1, max: 20, defaultValue: 2, step: 0.1};
    let amplitudeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'amplitude'), min: 1, max: 512, defaultValue: 100, step: 1};
    let waveLengthRangeDetails = {label: this.getTranslation(this.currentLanguage, 'wave-length'), min: 0, max: 128, defaultValue: 16, step: 1};

    // Define Rows and columns as structure for the menu on mobile view.
    // TODO: Refactor this in a cleaner way.
    //
    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    // These values are used for positioning the sliders. This was somewhat of a duct tape solution to make it work in time.
    // TODO: Refactor this in a cleaner way or remove.
    //
    const sliderDivXPos = 5;
    const sliderDivYPos = 115;

    // Set positions of menu elements according to mobile or desktop view.
    // Positions them in the previously defined columns and rows. 
    //
    if (window.innerWidth < window.innerHeight / 1.5) { // Note: we only look at screensize, rather than properly 'detecting' if on a mobile devices
      this.mobileView = 1;
      
      // Set positions of the menu elements in columns and rows.
      // TODO handle this in showSelectedMenuElements() instead.
      //
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);
      this.bgColorPicker.position(columnLeft, rowBottom);
      this.fontColorPicker.position(columnLeft + 70, rowBottom);
      this.glowColorPicker.position(columnLeft + 140, rowBottom);
      this.languageSelector.position(columnRight, rowBottom);

      // Hide the glow color picker as it is not meant to be shown at start (start defaults to the wave effect which doesn't have glow.)
      // TODO this is a "duct tape solution" to the glow color picker incorrectly showing up on startup.
      //
      this.glowColorPicker.hide();
  
      // Create new sliders on the rows and columns of the mobile menu, as repositioning them seems to not be possible in their current implementation.
      // TODO reposition them instead of remaking every time. (sliderdiv can be repositioned)
      //
      // [this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, columnLeft, rowTop);
      [this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, columnRight, rowTop);
      [this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, columnLeft, rowMid);
      [this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, columnRight, rowMid);
  
    } else {
      this.mobileView = 0;

      // Create new sliders as defined in range details, as repositioning them seems to not be possible in their current implementation.
      // TODO reposition them instead of remaking every time. (sliderdiv can be repositioned)
      //
      // [this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
      [this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);
      [this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);
      [this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);

      // Display the other menu elements.
      //
      this.showSelectedMenuElements();
    }
  }

  // This function draws the menu when open in desktop view.
  //
  drawOpenMenu(p5) {
    // draw the gray background of the menu. 
    //
    p5.fill(230, 200);
    p5.rect(0, 0, 255, window.innerHeight); 

    // Define colors of the close button.
    //
    let vivaMagentaColor = p5.color(187,38,73);
    let vivaMagentaColorLight = p5.color('#E26280');

    // Define boundaries of the close button.
    // TODO clean up and replace magic numbers.
    //
    let x1 = 205, x2 = 263, width = x2 - x1 -10; 
    let y1 = 0, y2 = 40, height = y2 - y1 -8; 
    // Color the close-button if hovered, then check if it is clicked, and if so close the menu.
    //
    if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1) && (p5.mouseY < y2)){ 
      p5.fill(vivaMagentaColor);
      if (p5.mouseIsPressed) {
        this.menuOpen = false;
        this.hideAllMenuElements();
      }
    }
    else {
      // Color when not hovered.
      //
      p5.fill(vivaMagentaColorLight); 
    }
    // draw "close" button.
    //
    p5.rect(x1, 0, width, height, 0, 0, 0, 7);
    p5.fill(255);
    p5.textSize(27);
    p5.text('x', 230, 24);
  }

  // This function draws the menu when closed in desktop view. (The button to open the menu.)
  //
  drawClosedMenu(p5) {
    // Define the boundaries of the button to open the menu.
    //
    let x1 = 0, x2 = 55, width = x2 - x1 - 10;
    let y1 = 0, y2 = 35, height = y2 - y1 - 8;

    // Define its color green and a lighter green for when hovered. 
    //
    let greenColor = p5.color('#27BC9A');
    let greenColorLight = p5.color('#0DF1BB');

      // Color the open-button lighter if hovered, then check if it is clicked, and if so open the menu.
      //
      if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1) && (p5.mouseY < y2)){
        
        // Set its color to a lighter one when hovered.
        //
        p5.fill(greenColorLight);
        if (p5.mouseIsPressed) {
          this.menuOpen = true;
          this.showSelectedMenuElements();
        }
      }
      else {
        // Set color when not hovered.
        //
        p5.fill(greenColor); 
      }
      // draw "open" button.
      //
      p5.rect(x1, 0, width, height, 0, 0, 10, 0);
      p5.fill(255);
      p5.textSize(30);
      p5.text('>', 23, 22); // very arbitrary values for centering, todo: fix 
  }

  // This function draws the menu when open in mobile view.
  // TODO: clean up and remove magic numbers, use proper variables for values, etc 
  // TODO: use the same design as the desktop menu.
  //
  drawOpenMenuMobile(p5) { 
    // Draw the gray background of the menu.
    //
    p5.fill(230, 200);
    p5.rect(0, window.innerHeight / 1.8, window.innerWidth, window.innerHeight / 2.2);

    // Define the boundaries of the close button.
    //
    let x1 = window.innerWidth * 0.8, x2 = window.innerWidth, width = x2 - x1;
    let y1 = 0, y2 = window.innerWidth * 0.1, height = y2 - y1;

    // Color the close-button if hovered, then check if it is clicked, and if so close the menu.
    //
    if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1 + window.innerHeight / 1.8) && (p5.mouseY < y2 + window.innerHeight / 1.8)){
      p5.fill(130);
      if (p5.mouseIsPressed) {
        this.menuOpen = false;
        this.hideAllMenuElements();
      }
    }
    else {
      // Color when not hovered.
      //
      p5.fill(180); 
    }

    // draw "close" button.
    //
    p5.rect(x1, window.innerHeight / 1.8, width, height, 0, 0, 0, 10);
    p5.fill(255);
    p5.textSize(32);
    p5.text('x', window.innerWidth * 0.9, window.innerHeight / 1.7);
  }

  // This function draws the menu when closed in mobile view. (The button to open the menu.)
  //
  drawClosedMenuMobile(p5) {
    let x1 = window.innerWidth * 0.8, x2 = window.innerWidth, width = x2 - x1;
    let y1 = 0, y2 = window.innerWidth * 0.2, height = y2 - y1;

    // Color the open-button if hovered, then check if it is clicked, and if so open the menu.
    //
    if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1 + window.innerHeight * 0.95) && (p5.mouseY < window.innerHeight)){
      p5.fill(130);
      if (p5.mouseIsPressed) {
        this.menuOpen = true;
        this.showSelectedMenuElements();
      }
    }
    else {
      // Color when not hovered.
      //
      p5.fill(180); 
    }

    // draw "open" button.
    //
    p5.rect(x1, window.innerHeight * 0.95, width, height, 10, 0, 0, 0);
    p5.fill(255);
    p5.textSize(32);
    p5.text('^', window.innerWidth * 0.9, window.innerHeight);
  }

  // This is the draw function that draws all canvas elements (the text with the effect applied and the menu).
  //
  draw = (p5) => {
    // Set background color according to the value set in the background color picker.
    //
    p5.background(this.bgColorPicker.color());

    // Set to have no "border" around what is being drawn.
    //
    p5.noStroke();

    // select the div with .knob class
    //
    if(!this.knobDiv) {
      this.knobDiv = p5.select('.knob');
      console.log(this.knobDiv);
      console.log('found knob div');
    }

    // Set the interactive text to be the text written in the input text box.
    //
    this.text = this.input.value();
    
    // Set the font size of the text.
    //
    p5.textSize(this.fontSize);

    // Call effectHandler to draw the text. Push and pop context to encapsulate any p5 configuration changes made when drawing the effects. 
    // Note that text is drawn entirely in the effect, as opposed to drawing the text and then applying the effect.
    //
    p5.push();
    this.effectHandler(this.effectSelector, p5);
    p5.pop();

    // Check whether to use mobile or desktop view, and draw the menu and show its elements or just the open-button if the menu is closed.
    // Push and pop context to encapsulate any p5 configuration changes made when drawing the menu.
    //
    p5.push();
    // mobile view
    if (this.mobileView) { 
      if (this.menuOpen) {
        this.drawOpenMenuMobile(p5);
      } else {
        this.drawClosedMenuMobile(p5);
      }
    } else { // desktop view
      if (this.menuOpen) {
        this.drawOpenMenu(p5);
      } else {
        this.drawClosedMenu(p5);
      }
    }
    p5.pop();
  }

  // Defines mouseReleased() to return true when the mouse click is released. 
  //
  mouseReleased() {
    return true;
  }

  // Defines how to handle window resizing. Essentially updates the screen
  // TODO similar to when drawing the menu, this should probably be remade in a cleaner way. 
  // (and probably do everything in a single function that windowResized can simply call on.)
  //
  windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);

    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    // Update whether to use mobile or desktop view and reposition menu elements.
    //
    if (window.innerWidth < window.innerHeight / 2) {
      this.mobileView = 1;

      // Set new positions of menu elements. 
      //
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);
      this.bgColorPicker.position(columnLeft, rowBottom);
      this.fontColorPicker.position(columnLeft + 70, rowBottom);
      this.glowColorPicker.position(columnLeft + 140, rowBottom);
      this.languageSelector.position(columnRight, rowBottom);
      
    } else {
      this.mobileView = 0;

      // Set new positions of menu elements. 
      //
      this.effectSelector.position(5, 30);
      this.input.position(5, 60);
      this.bgColorPicker.position(40, 580);
      this.fontColorPicker.position(80, 580);
      this.glowColorPicker.position(120, 580);
      this.languageSelector.position(30, 700);
      // this.fontSizeSliderDiv.position(5, window.innerHeight * 0.12);
      this.speedSliderDiv.position(5, window.innerHeight * 0.24);
      this.amplitudeSliderDiv.position(5, window.innerHeight * 0.36);
      this.waveLengthSliderDiv.position(5, window.innerHeight * 0.48);  
      
    }
    // Display the appropriate menu elements according to the currently selected effect.
    //
    this.showSelectedMenuElements();
  }

/*
#############################
######  Effect Methods ######
#############################
*/

  // Model of the wave effect.
  //
  waveEffect = (p5) => {
  // Declare variable for the current value on the wave for a particular letter.   
  //
  let wave;

  // Configure p5 to draw at the center of the screen, adjusted for length and size of the text.
  //
  p5.translate(window.innerWidth / 2, window.innerHeight / 2);
  p5.translate(-(this.text.length - 1) * this.fontSize / 2, 0);

  // Draw the word character by character, setting it's position according to a sin wave.
  //
  for (var i = 0; i < this.text.length; i++) {
    // Calculate position of the letter according to framerate, speed, and wavelength, turned into a sin wave multiplied by the current amplitude value.
    //
    wave = p5.sin(p5.frameCount * this.speed.value() + i * this.waveLength.value()) * this.amplitude.value();

    // Set color of the text according to the color set in the font color picker. 
    //
    p5.fill(this.fontColorPicker.color());

    // Move into position and draw the current character.
    // Push and pop context to effectively "reset" the translation between drawing each character. 
    // 
    p5.push();
    p5.translate(i * this.fontSize, 0);
    p5.text(this.text.charAt(i), 0, wave).textStyle(this.selectedWeight);
    p5.pop();
  }
}

  // Model of the tan rotation effect.
  //
  tanRotEffect = (p5) => {
    // This loop will draw multiple copies of the word above and below it.
    //
    for (var i = 0; i < 14; i++) {
      p5.push();

      // Do a rotation to position the words according to the value of a tan function taking into account the framerate, amplitude, and speed.
      //
      p5.rotate(p5.tan(p5.frameCount + i * this.amplitude.value()) * this.speed.value());

      // Set spacing according to font size (larger font size requires more space)
      //
      let spacing = this.fontSize;

      // Set color of the text according to the color set in the font color picker. 
      //
      p5.fill(this.fontColorPicker.color());

      // Draw two copies of the text above and below the center. 
      //
      p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2 - i * spacing);
      p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2 + i * spacing);

      p5.pop();
    }
  }

  // Model of the interactive mouse effect.
  //
  interactiveMouseEffect = (p5) => {
    // Set the background color to be black.
    //
    p5.background(0);

    // This effect uses a predefined string instead of text input, as well as a different font.
    //
    let s = 'A world of dew, \nAnd within every dewdrop \nA world of struggle.';
    const workSansFont = p5.loadFont('/fonts/Work_Sans/WorkSans-VariableFont_wght.ttf')
    p5.textFont(workSansFont);

    // Define a different look for the mouse cursor.
    //
    p5.cursor('https://res.cloudinary.com/dgksx9vlc/image/upload/v1642596128/cursor_isnod6.png', 64,64);

    // Draw multiple copies of the text in alternating black and white color offset by mouse position.
    //
    p5.textSize(p5.width*0.08);
    for(var i=0; i<20; i++) {
      // Draw in alternating black and white color.
      //
      if(i%2==0)
        p5.fill(0);
      else
        p5.fill(255);

      // Offset position according to mouse position.
      //
      let distX = p5.mouseX - (p5.width/2);
      let x = p5.map(distX,0, p5.width/2, 0, 10);
      let distY = p5.mouseY - (p5.height/2);
      let y = p5.map(distY,0, p5.height/2, 0, 10);
      
      // Draw the text wrapped within a text box.
      //
      p5.text(s, 150+i*x, 150+i*y, p5.width-200, p5.height-200); 
    }
  }

  // Model of the neon effect.
  // TODO clean up and improve the structure, especially bgBrighten.
  // 
  neonEffect = (p5) => {
    // Set background color according to background color picker. 
    //
    p5.background(this.bgColorPicker.value());

    // Measure how much mouse position changes and calculate the corresponding brightness adjustment.
    //
    let xDiff = Math.abs(Math.round((p5.pmouseX - p5.mouseX) / 10));
    let yDiff = Math.abs(Math.round((p5.pmouseY - p5.mouseY) / 10));
    this.brightness = this.brightness + xDiff + yDiff;

    // Turn on the humming noise and increase volume as brightness increases.
    //
    if (!this.hum.isPlaying()) { this.hum.loop(); }
    let volume = p5.map(this.brightness, 0, 512, 0, 0.7, true);
    this.hum.setVolume(volume);

    // Draw text.
    //
    p5.push();

    // Get and separate the red, green, and blue values of the current font color defined by the font color picker. 
    // These will serve as the starting value as the brightness increases.
    //
    let rValue = p5.red(this.fontColorPicker.color());
    let gValue = p5.green(this.fontColorPicker.color());
    let bValue = p5.blue(this.fontColorPicker.color());

    // Get and separate the red, green, and blue values of the current glow color defined by the glow color picker. 
    // These will serve as the target values as brightness increases.
    //
    let rGlowValue = p5.red(this.glowColorPicker.color());
    let gGlowValue = p5.green(this.glowColorPicker.color());
    let bGlowValue = p5.blue(this.glowColorPicker.color());

    // Decide whether to increase or decrease font color value (base) to reach glow color (target).
    // if true increase, if false decrease.
    //
    let rGlowIncrease = rValue <= rGlowValue;
    let gGlowIncrease = gValue <= gGlowValue;
    let bGlowIncrease = bValue <= bGlowValue;

    // Define the final color to draw the text as. 
    //
    let rBrightness, gBrightness, bBrightness;

    // Set the final red color value. Add or decrease by brightness depending on if target is below or above the starting value.
    // TODO break these out into a helper function.
    //
    if (rGlowIncrease) { 
      rBrightness = rValue + this.brightness;
      if (rBrightness > rGlowValue) { rBrightness = rGlowValue }
    } else { 
      rBrightness = rValue - this.brightness 
      if (rBrightness < rGlowValue) { rBrightness = rGlowValue }
    }

    // Set the final green color value. Add or decrease by brightness depending on if target is below or above the starting value.
    if (gGlowIncrease) { 
      gBrightness = gValue + this.brightness;
      if (gBrightness > gGlowValue) { gBrightness = gGlowValue }
    } else { 
      gBrightness = gValue - this.brightness 
      if (gBrightness < gGlowValue) { gBrightness = gGlowValue }
    }

    // Set the final blue color value. Add or decrease by brightness depending on if target is below or above the starting value.
    //
    if (bGlowIncrease) { 
      bBrightness = bValue + this.brightness;
      if (bBrightness > bGlowValue) { bBrightness = bGlowValue }
    } else { 
      bBrightness = bValue - this.brightness 
      if (bBrightness < bGlowValue) { bBrightness = bGlowValue }
    }

    // Set how spread out the "glow" is. 
    // TODO add a slider/rotary knob for shadowStrength.
    //
    let shadowStrength = 64; 
    p5.drawingContext.shadowBlur = shadowStrength;
    
    // Set the color of the "glow".
    //
    p5.drawingContext.shadowColor = p5.color(rBrightness, gBrightness, bBrightness, this.brightness);
    
    // Draw the text in the final color.
    //
    p5.fill(rBrightness, gBrightness, bBrightness);
    p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);  

    // Draw the glow, essentially it is an increasingly blurry version of the text drawn on top of it.
    //
    p5.drawingContext.shadowBlur = shadowStrength / 2;
    p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);

    // Draw a second more spread out glow, to give the illusion of the light spreading out onto the background.
    //
    p5.drawingContext.shadowBlur = shadowStrength / 4;
    p5.text(this.text, window.innerWidth / 2 , window.innerHeight / 2);
    p5.pop();

    // Decrease the brightness value slightly every frame.
    //
    let decay = 2;
    if (this.brightness > 0) { this.brightness = this.brightness - decay; }
    
    // Set bounds so the value doesn't go above 255 (fully bright) or 0 (completely dark).
    //
    if (this.brightness < 0) { this.brightness = 0; }
    if (this.brightness > 255) { this.brightness = 255; }
  }

  // Render the page.  
  //
  render() {
    return (
      <>
        <div className="App">
          <div className="knob">
            <Knob min={-1000} max={500} radius={75} callbackFunction={(s)=> this.fontSize=s} id={"knob"} startValue={30}  color="#BB2649"/>
          </div>
          <Sketch setup={this.setup} draw={this.draw} windowResized={this.windowResized}/>
        </div>
      </>
    );
  }
}

export default App;