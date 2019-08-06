module.exports = (path, isOAS3) => {
  const pathsForParameters = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
    'components'
  ];

  const inParametersSection = path[path.length - 2] === 'parameters';

  // the above check is a necessary but not sufficient check for a parameter object
  // use the following checks to verify the object is where a parameter is supposed to be.
  // without these, a schema property named "parameters" would get validated as a parameter
  const isParameterByPath = pathsForParameters.includes(path[path.length - 3]);
  const isPathItemParameter =
    path[path.length - 4] === 'paths' && path.length === 4;
  const isTopLevelParameter =
    !isOAS3 && path[0] === 'parameters' && path.length === 2;

  return (
    inParametersSection &&
    (isParameterByPath || isPathItemParameter || isTopLevelParameter)
  );
};
