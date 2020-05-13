const expect = require('expect');
const MessageCarrier = require('../../../src/plugins/utils/messageCarrier');

describe('MessageCarrier tests', function() {
  it('get errors returns all errors added', function() {
    const messages = new MessageCarrier();

    messages.addMessage(['paths', '/example', 'get'], 'message1', 'error');
    messages.addMessage(['paths', '/example', 'post'], 'message2', 'error');

    expect(messages.errors.length).toEqual(2);
    expect(messages.errors[0]).toEqual({
      path: ['paths', '/example', 'get'],
      message: 'message1'
    });
    expect(messages.errors[1]).toEqual({
      path: ['paths', '/example', 'post'],
      message: 'message2'
    });
  });

  it('get warnings returns all warnings added', function() {
    const messages = new MessageCarrier();

    messages.addMessage('paths./example.get', 'message1', 'warning');
    messages.addMessage('paths./example.post', 'message2', 'warning');

    expect(messages.warnings.length).toEqual(2);
    expect(messages.warnings[0]).toEqual({
      path: 'paths./example.get',
      message: 'message1'
    });
    expect(messages.warnings[1]).toEqual({
      path: 'paths./example.post',
      message: 'message2'
    });
  });

  it('get messages returns a dictionary with the list of errors and warnings', function() {
    const messages = new MessageCarrier();

    messages.addMessage(['paths', '/example', 'get'], 'message1', 'error');
    messages.addMessage(['paths', '/example', 'post'], 'message2', 'error');
    messages.addMessage(
      'paths./example.get.requestBody',
      'message3',
      'warning'
    );

    const messageDict = messages.messages;
    expect(messageDict.error.length).toEqual(2);
    expect(messageDict.error[0]).toEqual({
      path: ['paths', '/example', 'get'],
      message: 'message1'
    });
    expect(messageDict.warning.length).toEqual(1);
    expect(messageDict.warning[0]).toEqual({
      path: 'paths./example.get.requestBody',
      message: 'message3'
    });
  });

  it('addMessage does not add errors and warnings when status is off', function() {
    const messages = new MessageCarrier();

    messages.addMessage(['paths', '/example', 'get'], 'message1', 'off');
    messages.addMessage(['paths', '/example', 'post'], 'message2', 'off');
    messages.addMessage('paths./example.get.requestBody', 'message3', 'off');

    expect(messages.errors.length).toEqual(0);
    expect(messages.warnings.length).toEqual(0);
  });

  it('addMessageWithAuthId does not add errors and warnings when status is off', function() {
    const messages = new MessageCarrier();

    messages.addMessageWithAuthId(
      ['paths', '/example', 'get'],
      'message1',
      'off'
    );
    messages.addMessageWithAuthId(
      ['paths', '/example', 'post'],
      'message2',
      'off'
    );
    messages.addMessageWithAuthId(
      'paths./example.get.requestBody',
      'message3',
      'off'
    );

    expect(messages.errors.length).toEqual(0);
    expect(messages.warnings.length).toEqual(0);
  });

  it('addMessageWithAuthId adds errors and includes the authId in the error', function() {
    const messages = new MessageCarrier();

    messages.addMessageWithAuthId(
      ['paths', '/example', 'get'],
      'message1',
      'authId1',
      'error'
    );
    messages.addMessageWithAuthId(
      ['paths', '/example', 'post'],
      'message2',
      'authId2',
      'error'
    );

    expect(messages.errors.length).toEqual(2);
    expect(messages.errors[0]).toEqual({
      path: ['paths', '/example', 'get'],
      message: 'message1',
      authId: 'authId1'
    });
    expect(messages.errors[1]).toEqual({
      path: ['paths', '/example', 'post'],
      message: 'message2',
      authId: 'authId2'
    });
  });

  it('addMessageWithAuthId adds warnings and includes the authId in the warning', function() {
    const messages = new MessageCarrier();

    messages.addMessageWithAuthId(
      ['paths', '/example', 'get'],
      'message1',
      'authId1',
      'warning'
    );
    messages.addMessageWithAuthId(
      ['paths', '/example', 'post'],
      'message2',
      'authId2',
      'warning'
    );

    expect(messages.warnings.length).toEqual(2);
    expect(messages.warnings[0]).toEqual({
      path: ['paths', '/example', 'get'],
      message: 'message1',
      authId: 'authId1'
    });
    expect(messages.warnings[1]).toEqual({
      path: ['paths', '/example', 'post'],
      message: 'message2',
      authId: 'authId2'
    });
  });
});
