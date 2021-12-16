// Finds octet sequences (type: string, format: binary) in schemas including
// nested arrays, objects, nested arrays of type object, objects with properties
// that are nested arrays, and objects with properties that are objects This
// function takes a resolved schema object (no refs) and returns a list of
// paths to octet sequences (empty list if none found). The function accepts
// the path both as an array and a string and returns the path in the same
// format received:
// typeof(path) === 'array' => [[path1, get], [path2, get], ...]
// typeof(path) === 'string' => ['path1.get', 'path2.get', ...]

const findOctetSequencePaths = (resolvedSchema, path) => {
  if (!resolvedSchema) {
    // schema is empty, no octet sequence
    return [];
  }

  const pathsToOctetSequence = [];

  if (resolvedSchema.type === 'string' && resolvedSchema.format === 'binary') {
    pathsToOctetSequence.push(path);
  } else if (resolvedSchema.type === 'array') {
    pathsToOctetSequence.push(...arrayOctetSequences(resolvedSchema, path));
  } else if (resolvedSchema.type === 'object') {
    pathsToOctetSequence.push(...objectOctetSequences(resolvedSchema, path));
  }

  return pathsToOctetSequence;
};

function arrayOctetSequences(resolvedSchema, path) {
  const arrayPathsToOctetSequence = [];
  const arrayItems = resolvedSchema.items;
  if (arrayItems !== undefined) {
    // supports both array and string (delimited by .) paths
    const pathToSchema = Array.isArray(path)
      ? path.concat('items')
      : `${path}.items`;
    try {
      if (arrayItems.type === 'string' && arrayItems.format === 'binary') {
        arrayPathsToOctetSequence.push(pathToSchema);
      } else if (arrayItems.type === 'object' || arrayItems.type === 'array') {
        arrayPathsToOctetSequence.push(
          ...findOctetSequencePaths(arrayItems, pathToSchema)
        );
      }
    } catch (err) {
      if (err instanceof TypeError) {
        const escapedPaths = [];
        const strEscaper = function(strToEscape) {
          let newStr = '';
          for (let i = 0; i < strToEscape.length; i++) {
            if (strToEscape.charAt(i) == '/') {
              newStr = newStr + '\\/';
            } else {
              newStr = newStr + strToEscape.charAt(i);
            }
          }
          escapedPaths.push(newStr);
        };
        path.forEach(strEscaper);
        const e = new TypeError(
          'items.type and items.format must resolve for the path "' +
            escapedPaths.join('/') +
            '"'
        );
        e.stack = err.stack;
        e.original = err;
        throw e;
      } else {
        throw err;
      }
    }
  }
  return arrayPathsToOctetSequence;
}

function objectOctetSequences(resolvedSchema, path) {
  const objectPathsToOctetSequence = [];
  const objectProperties = resolvedSchema.properties;
  if (objectProperties) {
    Object.keys(objectProperties).forEach(function(prop) {
      const propPath = Array.isArray(path)
        ? path.concat(['properties', prop])
        : `${path}.properties.${prop}`;
      if (
        objectProperties[prop].type === 'string' &&
        objectProperties[prop].format === 'binary'
      ) {
        objectPathsToOctetSequence.push(propPath);
      } else if (
        objectProperties[prop].type === 'object' ||
        objectProperties[prop].type === 'array'
      ) {
        objectPathsToOctetSequence.push(
          ...findOctetSequencePaths(objectProperties[prop], propPath)
        );
      }
    });
  }
  return objectPathsToOctetSequence;
}

module.exports.findOctetSequencePaths = findOctetSequencePaths;
