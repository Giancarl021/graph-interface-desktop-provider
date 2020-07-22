const request = require('request');

module.exports = async function (options) {
    return await new Promise((resolve, reject) => {
        request(options, (err, res) => {
            if (err) return reject(err);
            if (res.statusCode === 204) {
                return {};
            }
            return resolve(JSON.parse(res.body));
        });
    });
}