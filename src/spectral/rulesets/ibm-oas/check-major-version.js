// Check:
// - Each url in the servers object has a path segment of the form v followed by a number,
//   and the number is the same for all urls, or
// - Each path has a path segment of the form v followed by a number, and the number is
//   the same for all paths

module.exports = targetVal => {
  if (targetVal === null || typeof targetVal !== 'object') {
    return;
  }

  const oas3 = targetVal['openapi'];

  if (oas3) {
    const servers = targetVal['servers'];
    if (servers && Array.isArray(servers)) {
      const urls = servers.map(o => o['url']);
      const versions = urls.map(url => getVersion(url));

      if (versions.length > 1 && !versions.every(v => v === versions[0])) {
        const uniqueVersions = versions.filter(
          (val, i, self) => self.indexOf(val) === i
        );
        return [
          {
            message:
              'Major version segments of urls in servers object do not match. Found ' +
              uniqueVersions.join(', '),
            path: ['servers']
          }
        ];
      }

      if (versions.length >= 1 && versions[0]) {
        // Major version present in server URL and all match -- all good
        return;
      }
    }
  } else {
    // oas2
    const basePath = targetVal['basePath'] || '';
    const version = getVersion(basePath);
    if (version) {
      return;
    }
  }

  // We did not find a major version in server URLs, so now check the paths

  const paths = targetVal['paths'];
  if (paths && typeof paths === 'object') {
    const urls = Object.keys(paths);
    const versions = urls.map(url => getVersion(url));

    if (versions.length > 1 && !versions.every(v => v === versions[0])) {
      const uniqueVersions = versions.filter(
        (val, i, self) => self.indexOf(val) === i
      );
      return [
        {
          message:
            'Major version segments of paths object do not match. Found ' +
            uniqueVersions.join(', '),
          path: ['paths']
        }
      ];
    }

    if (versions.length >= 1 && versions[0]) {
      // Major version present in server URL and all match -- all good
      return;
    }
  }

  if (oas3) {
    return [
      {
        message:
          'Major version segment not present in either server URLs or paths'
      }
    ];
  } else {
    return [
      {
        message: 'Major version segment not present in either basePath or paths'
      }
    ];
  }
};

// Return the first segment of a path that matches the pattern 'v\d+'
function getVersion(path) {
  const url = new URL(path, 'https://foo.bar');
  const segments = url.pathname.split('/');
  return segments.find(segment => segment.match(/v[0-9]+/));
}
