const Web3EthAbi = require('web3-eth-abi');

function decodeRawLog(contractArtifact, eventName, transaction) {
  const eventJsonInterface = contractArtifact.abi.find(o => o.name === eventName && o.type === "event");
  const log = transaction.receipt.rawLogs.find(log => log.topics.includes(eventJsonInterface.signature));

  const { inputs } = eventJsonInterface;
  const { data, topics } = log;
  // an array with the index parameter topics of the log, without the topic[0] if its a non-anonymous event, otherwise with topic[0].
  const [, ...logTopics] = topics;

  const decodedLogs = Web3EthAbi.decodeLog(inputs, data, logTopics);
  return decodedLogs;
}

module.exports = {
  decodeRawLog
};
