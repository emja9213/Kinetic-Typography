import './App.css';
import Sketch from 'react-p5'


let tanRotCheckbox, waveCheckbox, input, text, speed, fontSize, amplitude, waveLength;

function App() {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    
    tanRotCheckbox = p5.createCheckbox('Tan Rotation Effect', false);
    tanRotCheckbox.position(0, 0);

    waveCheckbox = p5.createCheckbox('Wave Effect', true);
    waveCheckbox.position(0, 30);

    input = p5.createInput('Kinetic Typography');
    input.position(5, 60);

    fontSize = p5.createSlider(8, 128, 64, 2);
    fontSize.position(5, 105);
    p5.createP('Font Size').position(50, 70);

    speed = p5.createSlider(0.1, 20, 3, 0.1);
    speed.position(5, 150);
    p5.createP('Speed').position(60, 115);

    amplitude = p5.createSlider(1, 512, 16, 1);
    amplitude.position(5, 195);
    p5.createP('Amplitude').position(50, 160);

    waveLength = p5.createSlider(0, 128, 16, 1);
    waveLength.position(5, 240);
    p5.createP('Wave Length').position(40, 205);

    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
  }

  const draw = p5 => {
    p5.background(255);

    text = input.value();
    p5.textSize(fontSize.value());
    
    if (tanRotCheckbox.checked()) {
      for (var i = 0; i < 14; i++) {
        p5.push();

        p5.rotate(p5.tan(p5.frameCount + i * amplitude.value()) * speed.value());

        p5.fill(0, 0, 0);

        let spacing = fontSize.value();
        p5.text(text, window.innerWidth / 2, window.innerHeight / 2 - i * spacing);
        p5.text(text, window.innerWidth / 2, window.innerHeight / 2 + i * spacing);
        
        p5.pop();
      }
    } else if (waveCheckbox.checked()) {
      let wave;
      p5.translate(window.innerWidth / 2, window.innerHeight / 2);

      p5.translate(-(text.length - 1) * fontSize.value() / 2,0);

      for(var i = 0; i < text.length; i++){
        wave = p5.sin(p5.frameCount * speed.value() + i * waveLength.value()) * amplitude.value();
        p5.fill(0);
        
        p5.push();
        p5.translate(i * fontSize.value(), 0);
        p5.text(text.charAt(i), 0, wave);
        p5.pop();
      }
    } else {
      p5.text(text, window.innerWidth / 2, window.innerHeight / 2);
    }
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
