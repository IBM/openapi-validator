const updateNotifier = require('update-notifier');
const pkg = require('../../../package.json');

// 1000 * 60 * 60 * 24 is one day
const twoDays = 1000 * 60 * 60 * 24 * 2;

const notifier = updateNotifier({
  pkg,
  shouldNotifyInNpmScript: true,
  updateCheckInterval: twoDays
});

notifier.notify();
