import './App.css';
import Sketch from 'react-p5'
import '@yaireo/ui-range';
import _ from 'lodash';


let input, text, speed, speedSliderDiv, fontSize, fontSizeSliderDiv, amplitude, amplitudeSliderDiv, waveLength,waveLengthSliderDiv, effectSelector, selectedWeight;
const effectActions = [
  { value: 'wave', label: 'Wave Effect' },
  { value: 'tanRot', label: 'Tan Rotation Effect' },
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

    const createRangeSlider = (rangeDetails,posX,posY) => {
      const sliderDiv = p5.createDiv();
      // convert label to camel case
      const classLabel = _.camelCase(rangeDetails.label);
      sliderDiv.addClass(`range-slider ${classLabel}-range-slider'`);
      sliderDiv.child(p5.createP(rangeDetails.label).style('padding','1.5rem 0.7rem'));
      sliderDiv.position(posX, posY);
      sliderDiv.style(`--min`,`${rangeDetails.min}`,`--max`,`${rangeDetails.max}`,`--value`,`${rangeDetails.defaultValue}`,`--text-value`,`${rangeDetails.defaultValue}`,`width`,`13rem`);
      
      const slider = p5.createSlider(rangeDetails.min, rangeDetails.max, rangeDetails.defaultValue, rangeDetails.step);
      slider.addClass('range');
      slider.attribute('oninput',`this.parentNode.style.setProperty('--value',this.value); this.parentNode.style.setProperty('--text-value', JSON.stringify(this.value))`);
      sliderDiv.child(slider);
  
      const sliderOutput = p5.createElement('output');
      sliderDiv.child(sliderOutput);
  
      const progressDiv = p5.createDiv();
      progressDiv.addClass('range-slider__progress');
      sliderDiv.child(progressDiv);
      console.log(sliderDiv);
      console.log(rangeDetails.label);
      
      return [sliderDiv,slider];
    }

    const sliderDivXPos = 5;
    const sliderDivYPos = 115;
    let fontSizeRangeDetails = {label: 'Font Size', min: 32, max: 256, defaultValue: 64, step: 2};
    [fontSizeSliderDiv, fontSize] = createRangeSlider(fontSizeRangeDetails, sliderDivXPos, sliderDivYPos);
    console.log(fontSizeSliderDiv);

    // add div to contain sliders 
    // const sliderDiv = p5.createDiv();
    // sliderDiv.addClass('range-slider');
    // sliderDiv.child(p5.createP('Font Size').style('padding','1.5rem 0.7rem'));
    // sliderDiv.position(5, 115);
    
    // // create sliders for each effect parameter
    
    // fontSize = p5.createSlider(32, 256, 64, 2);
    // // fontSize.position(5, 125);
    // fontSize.addClass('range');    
    // fontSize.attribute('oninput',`this.parentNode.style.setProperty('--value',this.value); this.parentNode.style.setProperty('--text-value', JSON.stringify(this.value))`);
    // sliderDiv.style('--min','32','--max','256','--value','64','--text-value','64','width','400px');
    // sliderDiv.child(fontSize);

    // // create output element using p5 dom library
    // const fontSliderOutput = p5.createElement('output');
    // sliderDiv.child(fontSliderOutput);

    // const progressDiv = p5.createDiv();
    // progressDiv.addClass('range-slider__progress');
    // sliderDiv.child(progressDiv);

    // create slider base on font weights array
    // const fontWeightSelector = p5.createSelect();
    // fontWeightSelector.position(5, 370);
    // fontWeights.forEach(option => {
    //   fontWeightSelector.option(option, option);
    // });
    // fontWeightSelector.changed(() => {
    //   p5.textStyle(fontWeightSelector.value());
    //   selectedWeight = fontWeightSelector.value();
    // });

    // speed = p5.createSlider(0.1, 20, 3, 0.1);
    // speed.position(5, 250);
    // p5.createP('Speed').position(60, 215);
    let speedRangeDetails = {label: 'Speed', min: 0.1, max: 20, defaultValue: 3, step: 0.1};
    [speedSliderDiv, speed] = createRangeSlider(speedRangeDetails, 5, sliderDivYPos + 125);

    // amplitude = p5.createSlider(1, 512, 16, 1);
    // amplitude.position(5, 195);
    // p5.createP('Amplitude').position(50, 260);
    let amplitudeRangeDetails = {label: 'Amplitude', min: 1, max: 512, defaultValue: 16, step: 1};
    [amplitudeSliderDiv, amplitude] = createRangeSlider(amplitudeRangeDetails, 5, sliderDivYPos + 250);

    // waveLength = p5.createSlider(0, 128, 16, 1);
    // waveLength.position(5, 340);
    // p5.createP('Wave Length').position(40, 305);
    let waveLengthRangeDetails = {label: 'Wave Length', min: 0, max: 128, defaultValue: 16, step: 1};
    [waveLengthSliderDiv, waveLength] = createRangeSlider(waveLengthRangeDetails, 5, sliderDivYPos + 375);

    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
  }



  // Check for selected effect animation and apply it
  function effectHandler(effectSelector, p5) {
    
    if (effectSelector.selected() === "tanRot") {
      for (var i = 0; i < 14; i++) {
        p5.push();

        p5.rotate(p5.tan(p5.frameCount + i * amplitude.value()) * speed.value());

        p5.fill(0, 0, 0);

        let spacing = fontSize.value();
        p5.text(text, window.innerWidth / 2, window.innerHeight / 2 - i * spacing);
        p5.text(text, window.innerWidth / 2, window.innerHeight / 2 + i * spacing);

        p5.pop();
      }
    } else if (effectSelector.selected() === "wave") {
      let wave;
      p5.translate(window.innerWidth / 2, window.innerHeight / 2);

      p5.translate(-(text.length - 1) * fontSize.value() / 2, 0);

      for (i = 0; i < text.length; i++) {
        wave = p5.sin(p5.frameCount * speed.value() + i * waveLength.value()) * amplitude.value();
        p5.fill(0);

        p5.push();
        p5.translate(i * fontSize.value(), 0);
        p5.text(text.charAt(i), 0, wave).textStyle(selectedWeight);
        p5.pop();
      }
    } else {
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
