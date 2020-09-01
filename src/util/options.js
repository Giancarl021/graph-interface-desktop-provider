const options = {
    refreshTokenPath: '.',
    personal: false,
    port: 9090
};

function fillOptions(options, filler) {
    const f = typeof filler === 'object' ? filler : defaultOptions[filler];
    for (const key in f) {
        if (!options.hasOwnProperty(key)) {
            options[key] = f[key];
        } else if (typeof f[key] === 'object') {
            const obj = options[key];
            fillOptions(obj, f[key]);
            options[key] = obj;
        }
    }
}

module.exports = {
    options,
    fillOptions
};