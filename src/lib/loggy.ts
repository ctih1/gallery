function getLevelStyling(level: string): string {
    let css = "font-weight: bold;";
    switch (level) {
        case "verbose":
            css += "color: #2a78f5;";
            break;
        case "fetch":
            css += "color: gray;";
            break;
        case "info":
            css += "color: #15e002;";
            break;
        case "warn":
            css += "color: orange;";
            break;
        case "error":
            css += "color: red;";
            break;
    }

    return css;
}

export function logg(level: string, message: any, styling: string[] = []) {
    console.log(`%c[${level.toUpperCase()}]%c: ${message}`, getLevelStyling(level), "", ...styling);
}
