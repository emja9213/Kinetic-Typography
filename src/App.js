import './App.css';
import Sketch from 'react-p5'


let checkbox, input, text, speed;

function App() {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    checkbox = p5.createCheckbox('Tan Rotation Effect', false);
    checkbox.position(0, 0);

    input = p5.createInput('Kinetic Typography');
    input.position(5, 30);

    speed = p5.createSlider(0.1, 20, 3, 0.1);
    speed.position(5, 80);
    p5.createP('Speed').position(60, 45);

    p5.textAlign(p5.CENTER);
    p5.angleMode(p5.DEGREES);
  }

  const draw = p5 => {
    p5.background(255);

    p5.textSize(64); // TODO adjust sizes and such according to screen size
    
    text = input.value();

    if (checkbox.checked()) {
      for (var i = 0; i < 15; i++) {
        p5.push();

        p5.rotate(p5.tan(p5.frameCount + i * 5) * speed.value());

        p5.fill(0, 0, 0);

        let spacing = 70;
        p5.text(text, window.innerWidth / 2, window.innerHeight / 2 - i * spacing);
        p5.text(text, window.innerWidth / 2, window.innerHeight / 2 + i * spacing);
        
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
