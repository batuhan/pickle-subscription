export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
}
export function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? `0${  hex}` : hex;
}

export function rgbToHex(r, g, b) {
    return `#${  componentToHex(r)  }${componentToHex(g)  }${componentToHex(b)}`;
}

export function getDarkenedRGB(rgb){

    const validation = (val) => {
        return val + 20 > 255 ? 255 : val + 20;
    };

    const r = validation(rgb.r);
    const b = validation(rgb.b);
    const g = validation(rgb.g);

    return { "r": r, "g": g, "b": b};
}

export function getThemeHeaderRGB(rgb){

    const validation = (val) => {
        return val - 40 < 0 ? 0 : val - 40;
    };
    const validation2 = (val) => {
        return val + 20 > 255 ? 255 : val + 20;
    };

    const r = validation2(rgb.r);
    const g = validation(rgb.g);
    const {b} = rgb;

    return { "r": r, "g": g, "b": b};
}

export function getThemeContentRGB(rgb){

    const validation = (val) => {
        return val - 70 < 0 ? 0 : val - 70;
    };
    const validation2 = (val) => {
        return val - 20 < 0 ? 0 : val - 20;
    };
    const validation3 = (val) => {
        return val - 40 < 0 ? 0 : val - 40;
    };

    const r = validation2(rgb.r);
    const g = validation(rgb.g);
    const b = validation3(rgb.b);

    return { "r": r, "g": g, "b": b};
}