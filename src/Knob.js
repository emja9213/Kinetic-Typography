//This component returns a knob that the user can turn to set an input value.
//props:
//gain: the change in the input value for 1 degree turn on the knob.
//startValue: the start value of the indicator.
//max, min: the maximum and minimum value the knob can be set to.
//radius: the radius of the knob.
//callbackFunction: function that will be called when the component is being rendered.
//colar: the color of the knob.


import './App.css';
import React from 'react';

  function caluculateAngle(x,y){
    var angle
    const r = Math.sqrt(x**2+y**2);
    
    if ( x >= 0){
      angle = Math.asin(y/r); //radians
    }
    else{
      angle = Math.PI - Math.asin(y/r); //radians
    }
    return angle/Math.PI*180; 
  }
  function handelClick(ref, setAngleState,angleRef,max,min){
    const handelMousMove = (event) => {
      const origoX = (ref.current.getBoundingClientRect().left + ref.current.getBoundingClientRect().right) / 2;
      const origoY = (ref.current.getBoundingClientRect().top + ref.current.getBoundingClientRect().bottom) / 2;
      const x2 = event.clientX - origoX;
      const y2 = event.clientY - origoY;
      const x1 = x2 - event.movementX;
      const y1 = y2 - event.movementY;
      const  angle1 = caluculateAngle(x1,y1); //degrees
      const angle2 = caluculateAngle(x2,y2); //degrees

      //we need to normalize the angles otherwise it will look good but the values will be wrong when we try to read them
      var angleRotated;
      if(angle2-angle1>180){
        angleRotated=angle2-angle1-360;
      }
      else if(angle2-angle1<-180){
        angleRotated=angle2-angle1+360;
      }
      else{
        angleRotated=angle2-angle1
      }
      //we can't set the state directly due to how React updates state so we use a ref as a go between
      angleRef.current = angleRef.current+angleRotated; //degrees 
      if(max !== null && angleRef.current>max) {
        console.log("max")
        angleRef.current = max;
      }
      else if (min !== null && angleRef.current<min){
        console.log("min")
        angleRef.current = min;
      }
      //now we set the state.
      setAngleState(angleRef.current);  

    };
    const handelMousUpp = () => {
      window.removeEventListener('mousemove',handelMousMove);
      window.removeEventListener('mouseup',handelMousUpp);
    }
     window.addEventListener('mousemove', handelMousMove);
     
     window.addEventListener('mouseup', handelMousUpp);
  }

  function Knob({gain=1, startValue, max, min, radius=40, callbackFunction=(e)=>{}, color="#9f9f9f", id=''} ) {
    const [angleState, setAngleState] = React.useState(startValue/gain);
    const imageRef = React.useRef(null);
    const angleRef = React.useRef(0);
    const rotationStr = `rotate( ${angleState } 25 25)`;
    const sizeStr = `${radius}px`
    //We wrap the callback function in useEfect to remove warnings
    
      callbackFunction(angleState*gain);
    

    return (
      <div>
    <svg ref={imageRef}
      id={id}
      onMouseDown={()=>{handelClick(imageRef, setAngleState,angleRef, max/gain,min/gain)}}
      width={sizeStr}
      height={sizeStr}
      viewBox="0 0 50 50"
      version="1.1">

      <g>
        <circle
          fill = "#ffffff"  stroke = "#000000" strokeWidth = "1.61134" strokeMiterlimit = "4" 
          strokeDasharray = "none" fillOpacity = "1"
          
          id="path846"
          cx="25"
          cy="25.000002"
          r="24.19433" />
        <path
          id="path846-3"
          fill = {color} fillOpacity = "1" stroke = "#000000" strokeWidth = "0" strokeMiterlimit = "4" 
          strokeDasharray = "none"
          transform={rotationStr}
          d="M 25.000024,1.6000904 A 24.19433,23.483143 0 0 0 15.707568,3.4152871 V 46.750792 
            a 24.19433,23.483143 0 0 0 9.292456,1.815697 24.19433,23.483143 0 0 0 9.292457,-1.815697 
              V 3.4027478 A 24.19433,23.483143 0 0 0 25.000024,1.6000904 Z" />
        <path
          fill = "none" stroke = "#000000" strokeWidth = "2.75593" strokeLinecap = "butt" strokeLinejoin = "round" 
          strokeMiterlimit = "4" strokeDasharray = "none" strokeOpacity = "1"
          transform={rotationStr}
          d="M 25,0.014 V 17.601,5.014"
          id="path2893" />
      </g>
    </svg>
    </div>
    );
  }

export default Knob;
