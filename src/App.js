import React from 'react';
import './App.css';
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound';
import '@yaireo/ui-range';
import _ from 'lodash';

"use strict";


class App extends React.Component {

  constructor(props) {
    super(props);

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
    this.fontWeight;
    this.fontWeightSliderDiv;
    this.textDiv;
    this.effectActions = [
      { value: 'wave', label: 'Wave Effect' },
      { value: 'tanRot', label: 'Tan Rotation Effect' },
      { value: 'interactiveMouse', label: 'Interactive Mouse' },
      { value: 'normalText', label: 'Normal Text' },
      { value: 'none', label: 'Blank Canvas' }
    ];
    this.fontWeights = ['p5.NORMAL','p5.ITALIC','p5.BOLD','p5.BOLDITALIC'];
    this.song = null;
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
    } else if (effectSelector.selected() === "normalText") {
      this.normalTextEffect(p5); // apply the normal text effect to the text
    }
    else if (effectSelector.selected() === "none") {
      // do nothing for now (blank canvas)
      void(0);
    }
    else {
      p5.text(this.text, window.innerWidth / 2, window.innerHeight / 2);
    }
  }


  preload = (p5) => {

    // preload sound file so it can be played later
    // p5.soundFormats('mp3', 'ogg');
    // // this.song = p5.loadSound('media/sound/The_Flashbulb_-_Warm_Hands_In_Cold_Fog');
    // this.song = p5.loadSound('https://freesound.org/data/previews/612/612610_5674468-lq');
  }



  setup = (p5, canvasParentRef) => {
    const cnv = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    p5.soundFormats('mp3', 'ogg');
    
    // play song on click of canvas element
    // cnv.mousePressed(() => {
    //   if (this.song.isPlaying()) {
    //     this.song.pause();
    //   } else {
    //     this.song.loop();
    //   }
    // });

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


    //  Generate range sliders for each effect parameter

    let fontSizeRangeDetails = {label: 'Font Size', min: 32, max: 256, defaultValue: 64, step: 2};
    [this.fontSizeSliderDiv, this.fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
    // console.log(this.fontSizeSliderDiv);

    let speedRangeDetails = {label: 'Speed', min: 0.1, max: 20, defaultValue: 3, step: 0.1};
    [this.speedSliderDiv, this.speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);

    let amplitudeRangeDetails = {label: 'Amplitude', min: 1, max: 512, defaultValue: 16, step: 1};
    [this.amplitudeSliderDiv, this.amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);

    let waveLengthRangeDetails = {label: 'Wave Length', min: 0, max: 128, defaultValue: 16, step: 1};
    [this.waveLengthSliderDiv, this.waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);

    let fontWeightRangeDetails = {label: 'Font Weight', min: 200, max: 1000, defaultValue: 200, step: 10};
    [this.fontWeightSliderDiv, this.fontWeight] = createRangeSlider(fontWeightRangeDetails, 5, sliderDivYPos + 500);

    // hideSliders();
    
  
    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
    
    
    // parametersContainer.hide();
    
  }


  draw = (p5) => {
    p5.background(255);

    this.text = this.input.value();
    p5.textSize(this.fontSize.value());
    // call effectHandler to draw the text
    this.effectHandler(this.effectSelector, p5);
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

  p5.translate(-(this.text.length - 1) * this.fontSize.value() / 2, 0);

  for (var i = 0; i < this.text.length; i++) {
    wave = p5.sin(p5.frameCount * this.speed.value() + i * this.waveLength.value()) * this.amplitude.value();
    p5.fill(0);
    // change stroke weight based on slider value
    p5.strokeWeight(p5.map(p5.mouseX, 0, p5.width, 0, 8));
    p5.stroke(0);
    p5.push();
    p5.translate(i * this.fontSize.value(), 0);
    p5.text(this.text.charAt(i), 0, wave).textStyle(p5.BOLD);
    p5.pop();
  }
}

tanRotEffect = (p5) => {
  for (var i = 0; i < 14; i++) {
    p5.push();

    p5.rotate(p5.tan(p5.frameCount + i * this.amplitude.value()) * this.speed.value());

    p5.fill(0, 0, 0);

    let spacing = this.fontSize.value();
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

normalTextEffect = (p5) => {
  p5.push();
  this.textDiv = p5.createDiv(this.text);
  this.textDiv.style('font-size', this.fontSize.value() + 'px');
  this.textDiv.style('font-weight', this.fontWeight.value());
  // this.textDiv.style('color', '#000');

  this.textDiv.position(window.innerWidth / 2 - this.textDiv.size().width / 2, window.innerHeight / 2 - this.textDiv.size().height / 2);
  p5.pop();
  p5.redraw();

}

  render() {
    return (
      <div className="App">
        <Sketch preload={this.preload} setup={this.setup} draw={this.draw} windowResized={this.windowResized}/>
      </div>
    );
  }
}

export default App;