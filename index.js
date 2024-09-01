const colorElement = document.getElementById("color");
const submitButton = document.getElementById("submit");
const resetButton = document.getElementById("reset");
const colorFormatOptions = document.getElementsByName('colorFormat');

const rgbInputs = document.querySelector('.color_input_rgb');
const rgbRedInput = document.getElementById("rgbRed");
const rgbGreenInput = document.getElementById("rgbGreen");
const rgbBlueInput = document.getElementById("rgbBlue");

const hexInput = document.querySelector('.color_input_hex');
const hexValueInput = document.getElementById("hexValue");

const hslInputs = document.querySelector('.color_input_hsl');
const hslHueInput = document.getElementById("hslHue");
const hslSaturationInput = document.getElementById("hslSaturation");
const hslLightnessInput = document.getElementById("hslLightness");

const titleElement = document.getElementById("title");
const subtitleElement = document.getElementById("subtitle");

const modal = document.getElementById("resultModal");
const percentage_element = document.getElementById("percentage");

const correctColorDiv = document.getElementById('correct_color');
const guessedColorDiv = document.getElementById('guessed_color');
const color_palattes = document.getElementById("color_palattes");

let [r, g, b] = [0, 0, 0];

function generateRandomValue() {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
}

function updateRgbValues() {
    generateRandomValue();
    colorElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function checkColorGuess() {
    const selectedFormat = document.querySelector('input[name="colorFormat"]:checked').value;

    if (selectedFormat === "rgb") {
        const userR = rgbRedInput.value ? parseInt(rgbRedInput.value, 10) : NaN;
        const userG = rgbGreenInput.value ? parseInt(rgbGreenInput.value, 10) : NaN;
        const userB = rgbBlueInput.value ? parseInt(rgbBlueInput.value, 10) : NaN;

        if (isNaN(userR) || isNaN(userG) || isNaN(userB)) {
            alert(`fill all the values`);
        }else{
            if (userR === r && userG === g && userB === b) {
                showResult("Congratulations !!!", "Well done! You guessed it right !!");
            } else {
                showResult("Incorrect Guess!", `The color was rgb(${r}, ${g}, ${b})\nyour guess was rgb(${userR}, ${userG}, ${userB})`,[userR,userG,userB]);
            }
        }
    } else if (selectedFormat === "hex") {
        const userHex = hexValueInput.value;
        
        if(userHex===NaN){
            alert(`fill all the values`);
        }else{
            const correctHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
            const rgbarray = hexToRgb(userHex);
            if (userHex.toUpperCase() === correctHex) {
                showResult("Congratulations !!!", "Well done! You guessed it right !!");
            } else {
                showResult("Incorrect Guess!", `The color was ${correctHex}\nyour guess was (#${userHex})`,rgbarray);
            }
        }
    } else if (selectedFormat === "hsl") {
        const userH = parseInt(hslHueInput.value, 10);
        const userS = parseInt(hslSaturationInput.value, 10);
        const userL = parseInt(hslLightnessInput.value, 10);
        if(userH===NaN || userL===NaN || userS===NaN){
            alert(`fill all the values`);
        }else{
            const [h, s, l] = rgbToHsl(r, g, b);
            const rgbarray = hslToRgb(userH,userS,userL);
            if (Math.abs(userH - h) < 5 && Math.abs(userS - s) < 5 && Math.abs(userL - l) < 5) {
                showResult("Congratulations !!!", "Well done! You guessed it right !!");
            } else {
                showResult("Incorrect Guess!", `The color was hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)\nyour guess was hsl(${userH},${userS},${userL})`,rgbarray);
            }
        }
        
    }
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    return [parseInt(hex.substring(0, 2), 16),parseInt(hex.substring(2, 4), 16),parseInt(hex.substring(4, 6), 16)];
  }

function setColor(correctColor, guessedColor) {
  const colorPalattes = document.querySelector('.color_palattes');
  const correctColorDiv = document.getElementById('correct_color');
  const guessedColorDiv = document.getElementById('guessed_color');
  
  if (colorPalattes) {
    colorPalattes.style.display = "flex"; 
    colorPalattes.style.flexDirection = "row"; 
    colorPalattes.style.padding = "10px";
  }

  if (correctColorDiv) {
    correctColorDiv.style.backgroundColor = correctColor;
  }
  if (guessedColorDiv) {
    guessedColorDiv.style.backgroundColor = guessedColor;
  }
}

function showResult(title, subtitle, user_color) {
    const colorPalattes = document.querySelector('.color_palattes');
    titleElement.innerText = title;
    subtitleElement.innerText = subtitle;
    modal.style.display = "block";
    color_palattes.style.display = "none";
    if(user_color!=null){
        setColor(`rgb(${r},${g},${b})`,`rgb(${user_color[0]},${user_color[1]},${user_color[2]})`);
    }
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
  
    const c = (1 - Math.abs(2 * l - 1)) * s; 
    const x = c * (1 - Math.abs((h / 60) % 2 - 1)); 
    const m = l - c / 2;
  
    let r = 0, g = 0, b = 0;
  
    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }
  
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
  
    return [r, g, b];
  }

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function Close_Modal() {
    modal.style.display = "none";
}

function handleColorFormatChange() {
    const selectedFormat = document.querySelector('input[name="colorFormat"]:checked').value;

    rgbInputs.style.display = selectedFormat === "rgb" ? "flex" : "none";
    hexInput.style.display = selectedFormat === "hex" ? "flex" : "none";
    hslInputs.style.display = selectedFormat === "hsl" ? "flex" : "none";
}

document.addEventListener('DOMContentLoaded', () => {
    updateRgbValues();
    document.querySelectorAll('input[name="colorFormat"]').forEach(radio => radio.addEventListener('change', handleColorFormatChange));
    handleColorFormatChange(); 
});