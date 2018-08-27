const get = require('lodash/get');

module.exports.transformPathToArray = function(property, jsSpec) {
  const str =
    property.slice(0, 9) === 'instance.' ? property.slice(9) : property;

  const pathArr = [];

  str
    .split('.')
    .map(item => {
      // 'key[0]' becomes ['key', '0']
      if (item.includes('[')) {
        const index = parseInt(item.match(/\[(.*)\]/)[1]);
        const keyName = item.slice(0, item.indexOf('['));
        return [keyName, index.toString()];
      } else {
        return item;
      }
    })
    .reduce(function(a, b) {
      // flatten!
      return a.concat(b);
    }, [])
    .concat(['']) // add an empty item into the array, so we don't get stuck with something in our buffer below
    .reduce((buffer, curr) => {
      const obj = pathArr.length ? get(jsSpec, pathArr) : jsSpec;

      if (get(obj, makeAccessArray(buffer, curr))) {
        if (buffer.length) {
          pathArr.push(buffer);
        }
        if (curr.length) {
          pathArr.push(curr);
        }
        return '';
      } else {
        // attach key to buffer
        return `${buffer}${buffer.length ? '.' : ''}${curr}`;
      }
    }, '');

  if (typeof get(jsSpec, pathArr) !== 'undefined') {
    return pathArr;
  } else {
    // if our path is not correct (there is no value at the path),
    // return null
    return null;
  }
};

function makeAccessArray(buffer, curr) {
  const arr = [];

  if (buffer.length) {
    arr.push(buffer);
  }

  if (curr.length) {
    arr.push(curr);
  }

  return arr;
}
