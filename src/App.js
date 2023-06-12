import React, { useState } from 'react';
import './App.css';
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound';
import '@yaireo/ui-range';
import _ from 'lodash';
import Knob from './Knob';

"use strict";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.menuOpen;
    this.input;
    this.text;
    this.speed;
    this.speedSliderDiv;
    
    this.fontSize = 30;
    //this.fontSizeSliderDiv;
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

  waveMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    //this.fontSizeSliderDiv.show();
    this.speedSliderDiv.show();
    this.amplitudeSliderDiv.show();
    this.waveLengthSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
  }

  tanRotMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    //this.fontSizeSliderDiv.show();
    this.speedSliderDiv.show();
    this.amplitudeSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
  }

  intMouseMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    //this.fontSizeSliderDiv.show();
  }
  
  neonMenuElements = () => {
    this.effectSelector.show();
    this.input.show();
    //this.fontSizeSliderDiv.show();
    this.bgColorPicker.show();
    this.fontColorPicker.show();
  }

  blankMenuElements = () => {
    this.effectSelector.show();
  }

  hideAllMenuElements = () => {
    this.effectSelector.hide();
    this.input.hide();
    //this.fontSizeSliderDiv.hide();
    this.speedSliderDiv.hide();
    this.amplitudeSliderDiv.hide();
    this.waveLengthSliderDiv.hide();
    this.bgColorPicker.hide();
    this.fontColorPicker.hide();
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

    this.bgColorPicker = p5.createColorPicker("#ffffff");
    this.bgColorPicker.position(40, 580);
    this.bgColorPicker.size(25, 25);

    this.fontColorPicker = p5.createColorPicker("#000000");
    this.fontColorPicker.position(80, 580);
    this.fontColorPicker.size(25, 25);

    this.languageSelector = p5.createSelect();
    this.languageSelector.position(30, 700);

    this.languages.forEach(languages => {
      this.languageSelector.option(languages.name, languages.key);
    });
    this.languageSelector.changed(() => {
      console.log(this.languageSelector.value());
      // this.currentLanguage = this.languageSelector.value();
    });

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

    this.effectSelector = p5.createSelect();
    this.effectSelector.position(5, 30);
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
    this.input.position(5, 60);
    
    const sliderDivXPos = 5;
    const sliderDivYPos = 115;
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
      sliderDiv.addClass(`range-slider ${classLabel}-range-slider'`);
      sliderDiv.child(p5.createP(rangeDetails.label).style('padding', '1.5rem 0.7rem'));
      sliderDiv.position(posX, posY);
      sliderDiv.style(`--min`, `${rangeDetails.min}`, `--max`, `${rangeDetails.max}`, `--value`, `${rangeDetails.defaultValue}`, `--text-value`, `${rangeDetails.defaultValue}`, `width`, `13rem`);

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
      //this.fontSizeSliderDiv.hide();
      this.speedSliderDiv.hide();
      this.amplitudeSliderDiv.hide();
      this.waveLengthSliderDiv.hide();
    }
    // function to show sliders
    const showSliders = () => {
      // this.fontSizeSliderDiv.show();
      this.speedSliderDiv.show();
      this.amplitudeSliderDiv.show();
      this.waveLengthSliderDiv.show();
    }

    //  Generate range sliders for each effect parameter

    //let fontSizeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'font-size'), min: 32, max: 256, defaultValue: 64, step: 2};
    //[this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
    // console.log(this.fontSizeSliderDiv);

    let speedRangeDetails = {label: this.getTranslation(this.currentLanguage, 'speed'), min: 0.1, max: 20, defaultValue: 3, step: 0.1};
    [this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);

    let amplitudeRangeDetails = {label: this.getTranslation(this.currentLanguage, 'amplitude'), min: 1, max: 512, defaultValue: 16, step: 1};
    [this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);

    let waveLengthRangeDetails = {label: this.getTranslation(this.currentLanguage, 'wave-length'), min: 0, max: 128, defaultValue: 16, step: 1};
    [this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);

    // hideSliders();
  
    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
    
    // parametersContainer.hide();
  }
  draw = (p5) => {
    p5.background(this.bgColorPicker.color());
    p5.noStroke();    

    this.text = this.input.value();
    p5.textSize(this.fontSize);
    // call effectHandler to draw the text
    p5.push();
    this.effectHandler(this.effectSelector, p5);
    p5.pop();

    // draw the menu and show its elements, or just the open-button if its closed.
    if (this.menuOpen) {
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
    } else {
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
    
  }

  mouseReleased() {
    return true;
  }

  windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  }

/*
#############################
######  Effect Methods ######
#############################
*/

  waveEffect = (p5) => {
  let wave;
  p5.translate(window.innerWidth / 2, window.innerHeight / 2);

  p5.translate(-(this.text.length - 1) * this.fontSize / 2, 0);

  for (var i = 0; i < this.text.length; i++) {
    wave = p5.sin(p5.frameCount * this.speed.value() + i * this.waveLength.value()) * this.amplitude.value();
    p5.fill(this.fontColorPicker.color());
    p5.push();
    p5.translate(i * this.fontSize, 0);
    p5.text(this.text.charAt(i), 0, wave).textStyle(this.selectedWeight);
    p5.pop();
  }
}

tanRotEffect = (p5) => {
  for (var i = 0; i < 14; i++) {
    p5.push();

    p5.rotate(p5.tan(p5.frameCount + i * this.amplitude.value()) * this.speed.value());

    let spacing = this.fontSize;
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

neonEffect = (p5) => {
  let bgColor = 40; 
  p5.background(bgColor);

  p5.fill(0);
  // Measure how much mouse position changes and calculate brightness.
  let xDiff = Math.abs(Math.round((p5.pmouseX - p5.mouseX) / 10));
  let yDiff = Math.abs(Math.round((p5.pmouseY - p5.mouseY) / 10));
  this.brightness = this.brightness + xDiff + yDiff;

  // Turn on the humming noise and increase volume as brightness increases.
  if (!this.hum.isPlaying()) { this.hum.loop(); }
  let volume = p5.map(this.brightness, 0, 512, 0, 0.7, true);
  this.hum.setVolume(volume);
  
  if (this.bgBrighten) { p5.background(bgColor + this.brightness / 20); } // TODO add a checkbox to turn on/off.

  // Draw text.
  p5.push();
  let shadowStrength = 64; // TODO add a slider for shadowStrength.
  p5.drawingContext.shadowBlur = shadowStrength;
  p5.drawingContext.shadowColor = p5.color(this.brightness, 0, 0, this.brightness);

  p5.fill(this.brightness, 0, 0);
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
      <>
      <div>
        <Knob radius={100} callbackFunction={(s)=> this.setState({fontSize:s})} id={"knob"} startValue={30}/>
      </div>
        <div className="App">
        <div style = {{position: "absolute", left:"4%", top:"80%"}}>
          <Knob min={-1000} max={500} radius={75} callbackFunction={(s)=> this.setState({fontSize:s})} id={"knob"} startValue={30}/>
        </div>
        <Sketch setup={this.setup} draw={this.draw} windowResized={this.windowResized}/>
        
      </div>
      </>

    );
  }
}

export default App;