/**
 * Created by metoikos on 2019-02-01.
 * Project: hapi-moon
 */
// ref: How to change node.js's console font color?
// https://stackoverflow.com/a/41407246/12078
const Colors = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',
    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m'
};

const ColorOutput = (color, text) => {
    if (!Colors[color]) {
        throw new Error('Invalid color schema');
    }
    return `${Colors[color]}${text}${Colors.Reset}`
};

const ErrorOutput = (text) => {
    return `${Colors.BgRed}${Colors.FgWhite}${text}${Colors.Reset}`
};

const LogOutput = (text) => {
    return `${Colors.Dim}
---------------------------------------------------------
${text}
---------------------------------------------------------${Colors.Reset}`
};

module.exports = {
    ColorOutput,
    ErrorOutput,
    LogOutput,
};
