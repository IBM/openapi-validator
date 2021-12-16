const YAML = require('yaml-js');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const lodashFind = require('lodash/find');
const memoize = require('lodash/memoize');

const cachedCompose = memoize(YAML.compose); // TODO: build a custom cache based on content

const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

const getLineNumberForPath = function(yaml, path) {
  // Type check
  if (typeof yaml !== 'string') {
    throw new TypeError('yaml should be a string');
  }
  if (!isArray(path)) {
    throw new TypeError('path should be an array of strings');
  }

  let i = 0;

  const ast = cachedCompose(yaml);

  // simply walks the tree using current path recursively to the point that
  // path is empty

  return find(ast, path);

  function find(current, path, last) {
    if (!current) {
      // something has gone quite wrong
      // return the last start_mark as a best-effort
      if (last && last.start_mark) return last.start_mark.line;
      return 0;
    }

    if (path.length && current.tag === MAP_TAG) {
      for (i = 0; i < current.value.length; i++) {
        const pair = current.value[i];
        const key = pair[0];
        const value = pair[1];

        if (key.value === path[0]) {
          return find(value, path.slice(1), current);
        }

        if (key.value === path[0].replace(/\[.*/, '')) {
          // access the array at the index in the path (example: grab the 2 in "tags[2]")
          const index = parseInt(path[0].match(/\[(.*)\]/)[1]);
          let nextVal;
          if (value.value.length === 1 && index !== 0 && !!index) {
            nextVal = lodashFind(value.value[0], {
              value: index.toString()
            });
          } else {
            nextVal = value.value[index];
          }
          return find(nextVal, path.slice(1), value.value);
        }
      }
    }

    if (path.length && current.tag === SEQ_TAG) {
      const item = current.value[path[0]];

      if (item && item.tag) {
        return find(item, path.slice(1), current.value);
      }
    }

    if (current.tag === MAP_TAG && !Array.isArray(last)) {
      return current.start_mark.line;
    } else {
      return current.start_mark.line + 1;
    }
  }
};

/**
 * Get a position object with given
 * @param  {string}   yaml
 * YAML or JSON string
 * @param  {array}   path
 * an array of stings that constructs a
 * JSON Path similiar to JSON Pointers(RFC 6901). The difference is, each
 * component of path is an item of the array intead of beinf seperated with
 * slash(/) in a string
 */
const positionRangeForPath = function(yaml, path) {
  // Type check
  if (typeof yaml !== 'string') {
    throw new TypeError('yaml should be a string');
  }
  if (!isArray(path)) {
    throw new TypeError('path should be an array of strings');
  }

  const invalidRange = {
    start: { line: -1, column: -1 },
    end: { line: -1, column: -1 }
  };
  let i = 0;

  const ast = cachedCompose(yaml);

  // simply walks the tree using current path recursively to the point that
  // path is empty.
  return find(ast);

  function find(current) {
    if (current.tag === MAP_TAG) {
      for (i = 0; i < current.value.length; i++) {
        const pair = current.value[i];
        const key = pair[0];
        const value = pair[1];

        if (key.value === path[0]) {
          path.shift();
          return find(value);
        }
      }
    }

    if (current.tag === SEQ_TAG) {
      const item = current.value[path[0]];

      if (item && item.tag) {
        path.shift();
        return find(item);
      }
    }

    // if path is still not empty we were not able to find the node
    if (path.length) {
      return invalidRange;
    }

    return {
      /* jshint camelcase: false */
      start: {
        line: current.start_mark.line,
        column: current.start_mark.column
      },
      end: {
        line: current.end_mark.line,
        column: current.end_mark.column
      }
    };
  }
};

/**
 * Get a JSON Path for position object in the spec
 * @param  {string} yaml
 * YAML or JSON string
 * @param  {object} position
 * position in the YAML or JSON string with `line` and `column` properties.
 * `line` and `column` number are zero indexed
 */
const pathForPosition = function(yaml, position) {
  // Type check
  if (typeof yaml !== 'string') {
    throw new TypeError('yaml should be a string');
  }
  if (
    !isPlainObject(position) ||
    typeof position.line !== 'number' ||
    typeof position.column !== 'number'
  ) {
    throw new TypeError(
      'position should be an object with line and column' + ' properties'
    );
  }

  let ast;
  try {
    ast = cachedCompose(yaml);
  } catch (e) {
    console.error('Error composing AST', e);
    console.error(
      `Problem area:\n`,
      yaml
        .split('\n')
        .slice(position.line - 5, position.line + 5)
        .join('\n')
    );
    return null;
  }

  const path = [];

  return find(ast);

  /**
   * recursive find function that finds the node matching the position
   * @param  {object} current - AST object to serach into
   */
  function find(current) {
    // algorythm:
    // is current a promitive?
    //   // finish recursion without modifying the path
    // is current a hash?
    //   // find a key or value that position is in their range
    //     // if key is in range, terminate recursion with exisiting path
    //     // if a value is in range push the corresponding key to the path
    //     //   andcontinue recursion
    // is current an array
    //   // find the item that position is in it"s range and push the index
    //   //  of the item to the path and continue recursion with that item.

    let i = 0;

    if (!current || [MAP_TAG, SEQ_TAG].indexOf(current.tag) === -1) {
      return path;
    }

    if (current.tag === MAP_TAG) {
      for (i = 0; i < current.value.length; i++) {
        const pair = current.value[i];
        const key = pair[0];
        const value = pair[1];

        if (isInRange(key)) {
          return path;
        } else if (isInRange(value)) {
          path.push(key.value);
          return find(value);
        }
      }
    }

    if (current.tag === SEQ_TAG) {
      for (i = 0; i < current.value.length; i++) {
        const item = current.value[i];

        if (isInRange(item)) {
          path.push(i.toString());
          return find(item);
        }
      }
    }

    return path;

    /**
     * Determines if position is in node"s range
     * @param  {object}  node - AST node
     * @return {Boolean}      true if position is in node"s range
     */
    function isInRange(node) {
      /* jshint camelcase: false */

      // if node is in a single line
      if (node.start_mark.line === node.end_mark.line) {
        return (
          position.line === node.start_mark.line &&
          node.start_mark.column <= position.column &&
          node.end_mark.column >= position.column
        );
      }

      // if position is in the same line as start_mark
      if (position.line === node.start_mark.line) {
        return position.column >= node.start_mark.column;
      }

      // if position is in the same line as end_mark
      if (position.line === node.end_mark.line) {
        return position.column <= node.end_mark.column;
      }

      // if position is between start and end lines return true, otherwise
      // return false.
      return (
        node.start_mark.line < position.line &&
        node.end_mark.line > position.line
      );
    }
  }
};

// utility fns

module.exports.pathForPosition = pathForPosition;
module.exports.positionRangeForPath = positionRangeForPath;
module.exports.getLineNumberForPath = getLineNumberForPath;

module.exports.pathForPositionAsync = promisifySyncFn(pathForPosition);
module.exports.positionRangeForPathAsync = promisifySyncFn(
  positionRangeForPath
);
module.exports.getLineNumberForPathAsync = promisifySyncFn(
  getLineNumberForPath
);

function promisifySyncFn(fn) {
  return function(...args) {
    return new Promise(resolve => resolve(fn(...args)));
  };
}
