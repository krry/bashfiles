var thetime;

function getTimestamp() {
  if (!thetime) {
    thetime = new Date().getTime();
  }
  console.log('the timestamp is now:', thetime);
  return thetime;
}

module.exports = {
  timestamp: getTimestamp,
  thetime: thetime,
}
