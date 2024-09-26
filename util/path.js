const path = require('path');

const getPath = (subPath) => {
    console.log('__dirname', __dirname);
    return subPath ? path.join(process.cwd(), ...subPath.split('/')) : process.cwd();
}

module.exports = getPath;