import React from 'react';
import './App.css';
import Sketch from 'react-p5'
import '@yaireo/ui-range';
import _ from 'lodash';


let input, text, speed, speedSliderDiv, fontSize, fontSizeSliderDiv, amplitude, amplitudeSliderDiv, waveLength,waveLengthSliderDiv, effectSelector, selectedWeight;
const effectActions = [
  { value: 'wave', label: 'Wave Effect' },
  { value: 'tanRot', label: 'Tan Rotation Effect' },
  { value: 'interactiveMouse', label: 'Interactive Mouse' }
];
const fontWeights = ['p5.NORMAL','p5.ITALIC','p5.BOLD','p5.BOLDITALIC'];

function App() {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    const cairoPlayFont = p5.loadFont('/fonts/Cairo_Play/CairoPlay-VariableFont_slnt,wght.ttf');
    p5.textFont(cairoPlayFont);
    
    effectSelector = p5.createSelect();
    effectSelector.position(5, 30);
    // generate new option for each value in effectActions array
    effectActions.forEach(option => {
      effectSelector.option(option.label, option.value);
    });
    effectSelector.changed(effectHandler.bind(null, effectSelector, p5));

    input = p5.createInput('Kinetic Typography');
    input.position(5, 60);
    
    const sliderDivXPos = 5;
    const sliderDivYPos = 115;

    //  Generate range sliders for each effect parameter

    let fontSizeRangeDetails = {label: 'Font Size', min: 32, max: 256, defaultValue: 64, step: 2};
    [fontSizeSliderDiv, fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
    console.log(fontSizeSliderDiv);

    let speedRangeDetails = {label: 'Speed', min: 0.1, max: 20, defaultValue: 3, step: 0.1};
    [speedSliderDiv, speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);

    let amplitudeRangeDetails = {label: 'Amplitude', min: 1, max: 512, defaultValue: 16, step: 1};
    [amplitudeSliderDiv, amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);

    let waveLengthRangeDetails = {label: 'Wave Length', min: 0, max: 128, defaultValue: 16, step: 1};
    [waveLengthSliderDiv, waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);

    hideSliders();
    
  
    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
    
    /*
    #############################
    ######  Helper Methods ######
    #############################
    */
    function createRangeSlider(rangeDetails, posX, posY) {
      const sliderDiv = p5.createDiv();
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
      console.log(sliderDiv);
      console.log(rangeDetails.label);

      return [sliderDiv, slider];
    }

    // function to hide all sliders
    function hideSliders() {
      fontSizeSliderDiv.hide();
      speedSliderDiv.hide();
      amplitudeSliderDiv.hide();
      waveLengthSliderDiv.hide();
    }
    // function to show sliders
    function showSliders() {
      fontSizeSliderDiv.show();
      speedSliderDiv.show();
      amplitudeSliderDiv.show();
      waveLengthSliderDiv.show();
    }
    
  }



  // Check for selected effect animation and apply it
  function effectHandler(effectSelector, p5) {
    
    if (effectSelector.selected() === "tanRot") {
      tanRotEffect(p5); // apply the tan rotation effect to the text
    } else if (effectSelector.selected() === "wave") {
      waveEffect(p5); // apply the wave effect to the text
    } else if (effectSelector.selected() === "interactiveMouse") {
      interactiveMouseEffect(p5); // apply the interactive mouse effect to the text 
    }
    else {
      p5.text(text, window.innerWidth / 2, window.innerHeight / 2);
    }
  }

  const draw = p5 => {
    p5.background(255);

    text = input.value();
    p5.textSize(fontSize.value());

    // call effectHandler to draw the text
    effectHandler(effectSelector, p5);
}
    

  const windowResized = p5 => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  }

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} windowResized={windowResized}/>
    </div>
  );
}

export default App;

/*
#############################
######  Effect Methods ######
#############################
*/

function waveEffect(p5) {
  let wave;
  p5.translate(window.innerWidth / 2, window.innerHeight / 2);

  p5.translate(-(text.length - 1) * fontSize.value() / 2, 0);

  for (var i = 0; i < text.length; i++) {
    wave = p5.sin(p5.frameCount * speed.value() + i * waveLength.value()) * amplitude.value();
    p5.fill(0);
    p5.push();
    p5.translate(i * fontSize.value(), 0);
    p5.text(text.charAt(i), 0, wave).textStyle(selectedWeight);
    p5.pop();
  }
}

function tanRotEffect(p5) {
  for (var i = 0; i < 14; i++) {
    p5.push();

    p5.rotate(p5.tan(p5.frameCount + i * amplitude.value()) * speed.value());

    p5.fill(0, 0, 0);

    let spacing = fontSize.value();
    p5.text(text, window.innerWidth / 2, window.innerHeight / 2 - i * spacing);
    p5.text(text, window.innerWidth / 2, window.innerHeight / 2 + i * spacing);

    p5.pop();
  }
}

function interactiveMouseEffect(p5) {
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

