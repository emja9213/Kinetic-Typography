import React, { useState } from 'react';
import './App.css';
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound';
import '@yaireo/ui-range';
import _ from 'lodash';

"use strict";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.mobileView;
    this.menuOpen;
    this.input;
    this.text;
    this.speed;
    this.speedSliderDiv;
    this.fontSize;
    this.fontSizeSliderDiv;
    this.amplitude;
    this.amplitudeSliderDiv;
    this.waveLength;
    this.waveLengthSliderDiv;
    this.effectSelector;
    this.selectedWeight;
    this.parametersContainer;
    this.brightness;
    this.bgBrighten;
    this.fontColor;
    this.fontShadowColor;
    this.bgColorPicker;
    this.fontColorPicker;
    this.glowColorPicker;
    this.effectActions = [
      { value: 'wave', label: 'Wave Effect' },
      { value: 'tanRot', label: 'Tan Rotation Effect' },
      { value: 'interactiveMouse', label: 'Interactive Mouse' },
      { value: 'neonEffect', label: 'Neon Effect' },
      { value: 'none', label: 'Blank Canvas' }
    ];
    this.fontWeights = ['p5.NORMAL','p5.ITALIC','p5.BOLD','p5.BOLDITALIC'];
    this.song = null;
    this.hum = null;
    this.currentLanguage = 'en';
    this.languageSelector;
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
  
  getTranslation = (language, key) => {
    return this.dict[language][key];
  }

  // NOTE: ALL THE "MenuElements" FUNCTIONS ARE SPAGHETTI + REPEATED CODE + DEAD CODE, DUCT TAPED TOGETHER FOR FINAL PRESENTATION
  // TODO: CLEAN UP BEFORE HANDING IN
  waveMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    this.fontSizeSliderDiv.show();
    this.speedSliderDiv.show();
    this.amplitudeSliderDiv.show();
    this.waveLengthSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
    this.languageSelector.show();

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

      this.fontSizeSliderDiv.position(columnLeft, rowTop);
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

      this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
      this.speedSliderDiv.position(5, 80 + window.innerHeight * 0.12);
      this.amplitudeSliderDiv.position(5, 120 + window.innerHeight * 0.18);
      this.waveLengthSliderDiv.position(5, 160 + window.innerHeight * 0.24);
    }
  }

  tanRotMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    this.fontSizeSliderDiv.show();
    this.speedSliderDiv.show();
    this.amplitudeSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
    this.languageSelector.show();

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

      this.fontSizeSliderDiv.position(columnLeft, rowTop);
      this.speedSliderDiv.position(columnRight, rowTop);
      this.amplitudeSliderDiv.position(columnLeft, rowMid);
      this.waveLengthSliderDiv.position(columnRight, rowMid);

    } else { // TODO Break up into helper function + avoid repeated code
      this.effectSelector.position(5,  3 + window.innerHeight * 0.02);
      this.input.position(5, 20 + window.innerHeight * 0.04);
  
      this.bgColorPicker.position(20, 160 + window.innerHeight * 0.24);
      this.fontColorPicker.position(20, 180 + window.innerHeight * 0.27);

      this.languageSelector.position(20, 200 + window.innerHeight * 0.30);

      this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
      this.speedSliderDiv.position(5, 80 + window.innerHeight * 0.12);
      this.amplitudeSliderDiv.position(5, 120 + window.innerHeight * 0.18);
    }
  }

  intMouseMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    this.fontSizeSliderDiv.show();
    this.languageSelector.show();

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

      this.fontSizeSliderDiv.position(columnLeft, rowTop);
      this.speedSliderDiv.position(columnRight, rowTop);
      this.amplitudeSliderDiv.position(columnLeft, rowMid);
      this.waveLengthSliderDiv.position(columnRight, rowMid);
    } else {
      this.effectSelector.position(5,  3 + window.innerHeight * 0.02);
      this.input.position(5, 20 + window.innerHeight * 0.04);

      this.languageSelector.position(20, 80 + window.innerHeight * 0.12);
      
      this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
    }
  }
  
  neonMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    this.fontSizeSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
    this.glowColorPicker.show();
    this.languageSelector.show();

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

      this.fontSizeSliderDiv.position(columnLeft, rowTop);
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

      this.fontSizeSliderDiv.position(5, 40 + window.innerHeight * 0.06);
      this.speedSliderDiv.position(5, 80 + window.innerHeight * 0.12);
      this.amplitudeSliderDiv.position(5, 120 + window.innerHeight * 0.18);
      this.waveLengthSliderDiv.position(5, 160 + window.innerHeight * 0.24);
    }
  }

  blankMenuElements = () => {
    this.effectSelector.show();
    this.languageSelector.show();
  }

  hideAllMenuElements = () => {
    this.effectSelector.hide();
    this.input.hide();
    this.fontSizeSliderDiv.hide();
    this.speedSliderDiv.hide();
    this.amplitudeSliderDiv.hide();
    this.waveLengthSliderDiv.hide();
    this.bgColorPicker.hide();
    this.fontColorPicker.hide();
    this.glowColorPicker.hide();
    this.languageSelector.hide();
  }

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
  effectHandler(effectSelector, p5) {

    p5.cursor(p5.ARROW);

    if (effectSelector.selected() === "tanRot") {
      this.tanRotEffect(p5); // apply the tan rotation effect to the text

    } else if (effectSelector.selected() === "wave") {
      this.waveEffect(p5); // apply the wave effect to the text

    } else if (effectSelector.selected() === "interactiveMouse") {
      this.interactiveMouseEffect(p5); // apply the interactive mouse effect to the text 

    } else if (effectSelector.selected() === "neonEffect") {
      this.neonEffect(p5);

    } else if (effectSelector.selected() === "none") {
      // do nothing for now (blank canvas)
      void(0);
    }
    else {
      p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);
    }
  }

  preload = (p5) => {
    console.log('preload function started');
    // p5.soundFormats('mp3', 'ogg');
    // this.song = p5.loadSound('media/sound/The_Flashbulb_-_Warm_Hands_In_Cold_Fog');
    // console.log(this.song);
    console.log('preload function ran successfully');
    // sleep for 1 second to allow song to load
    // new Promise(resolve => setTimeout(resolve, 1000));
  }



  setup = (p5, canvasParentRef) => {
    const cnv = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    /*
    #############################
    ###  Canvas Configuration ###
    #############################
    */ 
    p5.frameRate(60);
    cnv.style('display', 'block');
    this.menuOpen = true; 
    this.brightness = 0;
    this.bgBrighten = true;
    p5.soundFormats('mp3', 'ogg');
    this.song = p5.loadSound('https://freesound.org/data/previews/612/612610_5674468-lq');
    this.hum = p5.loadSound('media/sound/hum.ogg');
    console.log(this.hum);
    console.log(this.song);
    /*cnv.mousePressed(() => {
      if (this.song.isPlaying()) {
        this.song.pause();
      } else {
        this.song.loop();
      }
    });*/
    const cairoPlayFont = p5.loadFont('/fonts/Cairo_Play/CairoPlay-VariableFont_slnt,wght.ttf');
    p5.textFont(cairoPlayFont);
    this.parametersContainer = p5.createDiv().id('parameters-container');
    // this.parametersContainer.id('parameters-container');

    this.parametersContainer.style('display', 'flex','position','inherit');


    /*
    #############################
    ######  Helper Methods ######
    #############################
    */ 
    const createRangeSlider = (rangeDetails, posX, posY) => {
      const sliderDiv = p5.createDiv();
      sliderDiv.parent(this.parametersContainer);
      // convert label to camel case
      const classLabel = _.camelCase(rangeDetails.label);
      sliderDiv.addClass(`range-slider ${classLabel}-range-slider`);
      sliderDiv.child(p5.createP(rangeDetails.label).style('padding', '1.5rem 0.7rem'));
      sliderDiv.position(posX, posY);
      sliderDiv.style(`--min:${rangeDetails.min}`);
      sliderDiv.style(`--max:${rangeDetails.max}`);
      sliderDiv.style(`--value`, `${rangeDetails.defaultValue} !important`);
      sliderDiv.style(`--text-value`, `"${rangeDetails.defaultValue}" !important`);
      sliderDiv.style(`width`, `13rem`);

      const slider = p5.createSlider(rangeDetails.min, rangeDetails.max, rangeDetails.defaultValue, rangeDetails.step);
      slider.addClass('range');
      slider.style('width', '13rem');
      slider.attribute('oninput', `this.parentNode.style.setProperty('--value',this.value); this.parentNode.style.setProperty('--text-value', JSON.stringify(this.value))`);
      sliderDiv.child(slider);

      const sliderOutput = p5.createElement('output');
      sliderDiv.child(sliderOutput);

      const progressDiv = p5.createDiv();
      progressDiv.addClass('range-slider__progress');
      progressDiv.style('width', '13rem');
      sliderDiv.child(progressDiv);
      // console.log(sliderDiv);
      // console.log(rangeDetails.label);

      return [sliderDiv, slider];
    };

    // function to hide all sliders
    const hideSliders = () => {
      this.fontSizeSliderDiv.hide();
      this.speedSliderDiv.hide();
      this.amplitudeSliderDiv.hide();
      this.waveLengthSliderDiv.hide();
    }
    // function to show sliders
    const showSliders = () => {
      this.fontSizeSliderDiv.show();
      this.speedSliderDiv.show();
      this.amplitudeSliderDiv.show();
      this.waveLengthSliderDiv.show();
    }
  
    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
    // parametersContainer.hide();

    /*
    #############################
    ####  Menu Configuration  ###
    #############################
    */ 
    this.effectSelector = p5.createSelect();
    // generate new option for each value in effectActions array
    this.effectActions.forEach(option => {
      this.effectSelector.option(option.label, option.value);
    });
    this.effectSelector.changed(() => {
      this.setState({ effect: this.effectSelector.value() });
      this.hideAllMenuElements();
      this.showSelectedMenuElements();
      this.effectHandler(this.effectSelector, p5);
    });
    // effectSelector.changed();    

    this.input = p5.createInput('Kinetic Typography');

    this.bgColorPicker = p5.createColorPicker("#FBF0EA");
    this.fontColorPicker = p5.createColorPicker("#000000");
    this.glowColorPicker = p5.createColorPicker("#ff0000");

    this.languageSelector = p5.createSelect();
    this.languages.forEach(languages => {
      this.languageSelector.option(languages.name, languages.key);
    });
    this.languageSelector.changed(() => {
      console.log(this.languageSelector.value());
      this.currentLanguage = this.languageSelector.value();
    });

    //  Generate range sliders for each effect parameter
    let fontSizeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'font-size'), min: 12, max: 256, defaultValue: 38, step: 1};
    let speedRangeDetails = {label: this.getTranslation(this.currentLanguage, 'speed'), min: 0.1, max: 20, defaultValue: 2, step: 0.1};
    let amplitudeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'amplitude'), min: 1, max: 512, defaultValue: 100, step: 1};
    let waveLengthRangeDetails = {label: this.getTranslation(this.currentLanguage, 'wave-length'), min: 0, max: 128, defaultValue: 16, step: 1};

    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    const sliderDivXPos = 5;
    const sliderDivYPos = 115;

    // Set positions of menu elements according to mobile or desktop view
    if (window.innerWidth < window.innerHeight / 1.5) { // Note: we only look at screensize, rather than 'detect' mobile devices
      this.mobileView = 1;
  
      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);

      this.bgColorPicker.position(columnLeft, rowBottom);
  
      this.fontColorPicker.position(columnLeft + 70, rowBottom);

      this.glowColorPicker.position(columnLeft + 140, rowBottom);
      this.glowColorPicker.hide(); // TODO clean up, this is a "duct tape solution" to the glow color picker showing up on start
  
      this.languageSelector.position(columnRight, rowBottom);

      [this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, columnLeft, rowTop);
      [this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, columnRight, rowTop);
      [this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, columnLeft, rowMid);
      [this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, columnRight, rowMid);
  
    } else {
      this.mobileView = 0; // TODO RELATIVE VALUES

      [this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
      [this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);
      [this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);
      [this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);

      this.showSelectedMenuElements();
    }
  }

  drawOpenMenu(p5) {
    p5.fill(230, 200);
    p5.rect(0, 0, 255, window.innerHeight); 
    let x1 = 200, x2 = 255, width = x2 - x1; 
    let y1 = 0, y2 = 35, height = y2 - y1; 
    // Color the close-button if hovered, then check if it is clicked.
    if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1) && (p5.mouseY < y2)){ 
      p5.fill(130);
      if (p5.mouseIsPressed) {
        this.menuOpen = false;
        this.hideAllMenuElements();
      }
    }
    else {
      p5.fill(180); // Color when not hovered.
    }
    // draw "close" button.
    p5.rect(x1, 0, width, height, 0, 0, 0, 10);
    p5.fill(255);
    p5.textSize(32);
    p5.text('x', 228, 25);
  }

  drawClosedMenu(p5) {
    let x1 = 0, x2 = 55, width = x2 - x1;
      let y1 = 0, y2 = 35, height = y2 - y1;
      // Color the open-button if hovered, then check if it is clicked.
      if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1) && (p5.mouseY < y2)){
        p5.fill(130);
        if (p5.mouseIsPressed) {
          this.menuOpen = true;
          // TODO helper function for this and everything else here tbh 
          this.showSelectedMenuElements();
        }
      }
      else {
        p5.fill(180); // Color when not hovered.
      }
      // draw "open" button.
      p5.rect(x1, 0, width, height, 0, 0, 10, 0);
      p5.fill(255);
      p5.textSize(32);
      p5.text('>', 27, 25); // very arbitrary values for centering, todo: fix 
  }

  drawOpenMenuMobile(p5) { // TODO: clean up! remove magic numbers, make proper variables for values, etc 
    p5.fill(230, 200);
    p5.rect(0, window.innerHeight / 1.8, window.innerWidth, window.innerHeight / 2.2);

    let x1 = window.innerWidth * 0.8, x2 = window.innerWidth, width = x2 - x1;
    let y1 = 0, y2 = window.innerWidth * 0.1, height = y2 - y1;
    // Color the close-button if hovered, then check if it is clicked.
    if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1 + window.innerHeight / 1.8) && (p5.mouseY < y2 + window.innerHeight / 1.8)){  // holy magic numbers
      p5.fill(130);
      if (p5.mouseIsPressed) {
        this.menuOpen = false;
        this.hideAllMenuElements();
      }
    }
    else {
      p5.fill(180); // Color when not hovered.
    }
    // draw "close" button.
    p5.rect(x1, window.innerHeight / 1.8, width, height, 0, 0, 0, 10);
    p5.fill(255);
    p5.textSize(32);
    p5.text('x', window.innerWidth * 0.9, window.innerHeight / 1.7);
  }

  drawClosedMenuMobile(p5) {
    let x1 = window.innerWidth * 0.8, x2 = window.innerWidth, width = x2 - x1;
    let y1 = 0, y2 = window.innerWidth * 0.2, height = y2 - y1;
    // Color the open-button if hovered, then check if it is clicked.
    if ((p5.mouseX > x1) && (p5.mouseX < x2) && (p5.mouseY > y1 + window.innerHeight * 0.95) && (p5.mouseY < window.innerHeight)){
      p5.fill(130);
      if (p5.mouseIsPressed) {
        this.menuOpen = true;
        this.showSelectedMenuElements();
      }
    }
    else {
      p5.fill(180); // Color when not hovered.
    }
    // draw "open" button.
    p5.rect(x1, window.innerHeight * 0.95, width, height, 10, 0, 0, 0);
    p5.fill(255);
    p5.textSize(32);
    p5.text('^', window.innerWidth * 0.9, window.innerHeight);
  }

  draw = (p5) => {
    p5.background(this.bgColorPicker.color());
    p5.noStroke();    

    this.text = this.input.value();
    p5.textSize(this.fontSize.value());
    // call effectHandler to draw the text
    p5.push();
    this.effectHandler(this.effectSelector, p5);
    p5.pop();

    // draw the menu and show its elements, or just the open-button if its closed.
    p5.push();
    if (this.mobileView) { // mobile view
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

  mouseReleased() {
    return true;
  }

  windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);

    // Update whether to use mobile or desktop view and redraw menu elements.
    const columnRight = window.innerWidth * 0.6;
    const columnLeft = window.innerWidth * 0.05;
    const rowHeader = window.innerHeight * 0.61;
    const rowTop = window.innerHeight * 0.7;
    const rowMid = window.innerHeight * 0.8;
    const rowBottom = window.innerHeight * 0.9;

    //let fontSizeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'font-size'), min: 12, max: 256, defaultValue: 52, step: 1};
    //let speedRangeDetails = {label: this.getTranslation(this.currentLanguage, 'speed'), min: 0.1, max: 20, defaultValue: 3, step: 0.1};
    //let amplitudeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'amplitude'), min: 1, max: 512, defaultValue: 16, step: 1};
    //let waveLengthRangeDetails = {label: this.getTranslation(this.currentLanguage, 'wave-length'), min: 0, max: 128, defaultValue: 16, step: 1};

    if (window.innerWidth < window.innerHeight / 2) {
      this.mobileView = 1;

      this.effectSelector.position(columnLeft, rowHeader);
      this.input.position(columnRight, rowHeader);

      this.bgColorPicker.position(columnLeft, rowBottom);
  
      this.fontColorPicker.position(columnLeft + 70, rowBottom);

      this.glowColorPicker.position(columnLeft + 140, rowBottom);
  
      this.languageSelector.position(columnRight, rowBottom);

      //[this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, columnLeft, rowTop);
      //[this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, columnRight, rowTop);
      //[this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, columnLeft, rowMid);
      //[this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, columnRight, rowMid);
      
    } else {
      this.mobileView = 0;

      this.effectSelector.position(5, 30);
      this.input.position(5, 60);

      this.bgColorPicker.position(40, 580);
      this.fontColorPicker.position(80, 580);
      this.glowColorPicker.position(120, 580);

      this.languageSelector.position(30, 700);

      this.fontSizeSliderDiv.position(5, window.innerHeight * 0.12);
      this.speedSliderDiv.position(5, window.innerHeight * 0.24);
      this.amplitudeSliderDiv.position(5, window.innerHeight * 0.36);
      this.waveLengthSliderDiv.position(5, window.innerHeight * 0.48);
      //const sliderDivXPos = 5;
      //const sliderDivYPos = 115;
      //[this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
      //[this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);
      //[this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);
      //[this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);  
      
    }
    this.showSelectedMenuElements();
    this.fontSizeSliderDiv.r;
  }

/*
#############################
######  Effect Methods ######
#############################
*/

  waveEffect = (p5) => {
  let wave;

  p5.translate(window.innerWidth / 2, window.innerHeight / 2);

  p5.translate(-(this.text.length - 1) * this.fontSize.value() / 2, 0);

  for (var i = 0; i < this.text.length; i++) {
    wave = p5.sin(p5.frameCount * this.speed.value() + i * this.waveLength.value()) * this.amplitude.value();
    p5.fill(this.fontColorPicker.color());
    p5.push();
    p5.translate(i * this.fontSize.value(), 0);
    p5.text(this.text.charAt(i), 0, wave).textStyle(this.selectedWeight);
    p5.pop();
  }
}

tanRotEffect = (p5) => {
  for (var i = 0; i < 14; i++) {
    p5.push();

    p5.rotate(p5.tan(p5.frameCount + i * this.amplitude.value()) * this.speed.value());

    let spacing = this.fontSize.value();
    p5.fill(this.fontColorPicker.color());
    p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2 - i * spacing);
    p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2 + i * spacing);

    p5.pop();
  }
}

interactiveMouseEffect = (p5) => {
  p5.background(0);
  let s = 'A world of dew, \nAnd within every dewdrop \nA world of struggle.';
  const workSansFont = p5.loadFont('/fonts/Work_Sans/WorkSans-VariableFont_wght.ttf')
  p5.textFont(workSansFont);
  p5.cursor('https://res.cloudinary.com/dgksx9vlc/image/upload/v1642596128/cursor_isnod6.png', 64,64);
  p5.textSize(p5.width*0.08);
  for(var i=0; i<20; i++) {
    if(i%2==0)
      p5.fill(0);
    else
      p5.fill(255);

    // fill(i*20,0,0);
    
    let distX = p5.mouseX - (p5.width/2);
    let x = p5.map(distX,0, p5.width/2, 0, 10);
    let distY = p5.mouseY - (p5.height/2);
    let y = p5.map(distY,0, p5.height/2, 0, 10);
    
    p5.text(s, 150+i*x, 150+i*y, p5.width-200, p5.height-200); // Text wraps within text box 
  }
}

// TODO better structure & bgBrighten.
neonEffect = (p5) => {
  //let bgColor = 40; 
  p5.background(this.bgColorPicker.value());

  p5.fill(0);
  // Measure how much mouse position changes and calculate brightness.
  let xDiff = Math.abs(Math.round((p5.pmouseX - p5.mouseX) / 10));
  let yDiff = Math.abs(Math.round((p5.pmouseY - p5.mouseY) / 10));
  this.brightness = this.brightness + xDiff + yDiff;

  // Turn on the humming noise and increase volume as brightness increases.
  if (!this.hum.isPlaying()) { this.hum.loop(); }
  let volume = p5.map(this.brightness, 0, 512, 0, 0.7, true);
  this.hum.setVolume(volume);
  
  //if (this.bgBrighten) { p5.background(bgColor + this.brightness / 20); } // TODO add a checkbox to turn on/off.

  // Draw text.
  p5.push();
  let shadowStrength = 64; // TODO add a slider for shadowStrength.
  let rValue = p5.red(this.fontColorPicker.color());
  let gValue = p5.green(this.fontColorPicker.color());
  let bValue = p5.blue(this.fontColorPicker.color());

  let rGlowValue = p5.red(this.glowColorPicker.color());
  let gGlowValue = p5.green(this.glowColorPicker.color());
  let bGlowValue = p5.blue(this.glowColorPicker.color());

  // Decide whether to increase or decrease font color value (base) to reach glow color (target).
  // true = increase, false = decrease
  // TODO break out into a helper function.
  let rGlowIncrease = rValue <= rGlowValue;
  let gGlowIncrease = gValue <= gGlowValue;
  let bGlowIncrease = bValue <= bGlowValue;

  let rBrightness, gBrightness, bBrightness;
  if (rGlowIncrease) { 
    rBrightness = rValue + this.brightness;
    if (rBrightness > rGlowValue) { rBrightness = rGlowValue }
  } else { 
    rBrightness = rValue - this.brightness 
    if (rBrightness < rGlowValue) { rBrightness = rGlowValue }
  }

  if (gGlowIncrease) { 
    gBrightness = gValue + this.brightness;
    if (gBrightness > gGlowValue) { gBrightness = gGlowValue }
  } else { 
    gBrightness = gValue - this.brightness 
    if (gBrightness < gGlowValue) { gBrightness = gGlowValue }
  }

  if (bGlowIncrease) { 
    bBrightness = bValue + this.brightness;
    if (bBrightness > bGlowValue) { bBrightness = bGlowValue }
  } else { 
    bBrightness = bValue - this.brightness 
    if (bBrightness < bGlowValue) { bBrightness = bGlowValue }
  }

  p5.drawingContext.shadowBlur = shadowStrength;
  p5.drawingContext.shadowColor = p5.color(rBrightness, gBrightness, bBrightness, this.brightness);
  
  p5.fill(rBrightness, gBrightness, bBrightness);
  p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);  

  // Draw glow
  p5.drawingContext.shadowBlur = shadowStrength / 2;
  p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);

  p5.drawingContext.shadowBlur = shadowStrength / 4;
  p5.text(this.text, window.innerWidth / 2 , window.innerHeight / 2);
  p5.pop();

  // Decay.
  let decay = 2;
  if (this.brightness > 0) { this.brightness = this.brightness - decay; }
  // Bounds.
  if (this.brightness < 0) { this.brightness = 0; }
  if (this.brightness > 255) { this.brightness = 255; }
}

  render() {
    return (
      <div className="App">
        <Sketch setup={this.setup} draw={this.draw} windowResized={this.windowResized}/>
      </div>
    );
  }
}

export default App;