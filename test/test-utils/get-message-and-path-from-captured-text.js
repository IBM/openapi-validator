module.exports.getMessageAndPathFromCapturedText = getMessageAndPathFromCapturedText;

function getMessageAndPathFromCapturedText(pattern, capturedText) {
  const messages = [];
  for (let i = 0; i < capturedText.length; i++) {
    if (capturedText[i].includes(pattern)) {
      const aMessage = [];

      const messageMap = new Map();
      const messageSplit = capturedText[i].split(':');
      messageMap.set(messageSplit[0].trim(), messageSplit[1].trim());
      aMessage.push(messageMap);

      const pathMap = new Map();
      const pathSplit = capturedText[i + 1].split(':');
      pathMap.set(pathSplit[0].trim(), pathSplit[1].trim());
      aMessage.push(pathMap);

      messages.push(aMessage);
      // we jump the index by one due to that i+1 entry is already processed
      i++;
    }
  }
  return messages;
}
