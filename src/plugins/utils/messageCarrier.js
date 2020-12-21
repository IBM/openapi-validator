'use strict';

module.exports = class MessageCarrier {
  constructor() {
    this._messages = {
      error: [],
      warning: [],
      info: [],
      hint: []
    };
  }

  get messages() {
    return this._messages;
  }

  get errors() {
    return this._messages.error;
  }

  get warnings() {
    return this._messages.warning;
  }

  get infos() {
    return this._messages.info;
  }

  get hints() {
    return this._messages.hint;
  }

  // status should be 'off', 'error', 'warning', 'info', or 'hint'
  addMessage(path, message, status) {
    if (this._messages[status]) {
      this._messages[status].push({
        path,
        message
      });
    }
  }

  addMessageWithAuthId(path, message, authId, status) {
    if (this._messages[status]) {
      this._messages[status].push({
        path,
        message,
        authId
      });
    }
  }
};
