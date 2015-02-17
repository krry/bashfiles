var thetime;

function getTimestamp() {
  if (!thetime) {
    thetime = new Date().getTime();
  }
  return thetime;
}

module.exports = {
  timestamp: getTimestamp,
  thetime: thetime,
}
