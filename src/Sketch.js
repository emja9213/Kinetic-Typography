// Rewrting the code from App.js so that all setup and draw functions are in one file and all the classes are in separate files
// App.js is the main file to run the application, Sketch.js is the file where all the setup and draw functions are written

import React, { useState } from 'react';
import './App.css';
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound';
import '@yaireo/ui-range';
import _ from 'lodash';

class Sketch2 extends React.Component {

    constructor(props) {
        // Defining all the variables that will be used in the sketch and the state
        super(props);
        this.mobileView;
        this.menuOpen;
        this.input;
        this.speed;
        this.speedSliderDiv;
        this.fontSize;
        this.fontSizeSliderDiv;
        this.amplitude;
        this.amplitudeSliderDiv;
        this.wavelength;
        this.wavelengthSliderDiv;
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
            { name: 'wave', label: 'Wave Effect' },
            { name: 'tanRot', label: 'Tan Rotation Effect' },
            { name: 'interactiveMouse', label: 'Interactive Mouse' },
            { name: 'neonEffect', label: 'Neon Effect' },
            { name: 'none', label: 'Blank Canvas' }
        ];
        this.song = null;
        this.hum = null;
        this.currentLangualge = 'en';
        this.languages = [
            { key: 'en', name: 'English' },
            { key: 'sv', name: 'Svenska' }
        ];
        this.dict =  {
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
          };
        }


    }