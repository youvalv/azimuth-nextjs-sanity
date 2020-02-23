const _ = require('lodash');


export default function(url) {
    const basePath = '';
    return basePath + '/' + _.trimStart(url, '/');
}
