var thetime;

function getTimestamp() {
  console.log('thetime', thetime);
  if (!thetime) {
    thetime = new Date().getTime();
  }
  return thetime;
}

module.exports = {
  timestamp: getTimestamp,
  thetime: thetime,
}
