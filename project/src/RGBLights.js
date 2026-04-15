// RGBLights.js

import React from 'react';
import './RGBLights.css';

const RGBLights = () => {
    const [color, setColor] = React.useState({ r: 255, g: 255, b: 255 });

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setColor({ ...color, [name]: value });
    };

    const applyColor = () => {
        // Logic to apply the RGB color to the lights
        console.log(`Applying color: rgb(${color.r},${color.g},${color.b})`);
    };

    return (
        <div className="rgb-lights">
            <h2>RGB Lights Controller</h2>
            <div>
                <label>
                    Red: <input type="range" name="r" min="0" max="255" value={color.r} onChange={handleColorChange} />
                </label>
                <label>
                    Green: <input type="range" name="g" min="0" max="255" value={color.g} onChange={handleColorChange} />
                </label>
                <label>
                    Blue: <input type="range" name="b" min="0" max="255" value={color.b} onChange={handleColorChange} />
                </label>
            </div>
            <button onClick={applyColor}>Apply Color</button>
        </div>
    );
};

export default RGBLights;