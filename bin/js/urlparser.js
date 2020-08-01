const url = require('url');

function parseURL(uri) {
    return new URL(uri);
}
module.exports = parseURL;
