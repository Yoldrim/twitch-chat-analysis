class Toolkit {
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Functions waits until variableArr's index 0 !== undefined
  static waitFor = async (variableArr, timeout = 2000) => {
    const ttl = Date.now() + timeout;
    while (Date.now() < ttl) {
      if (variableArr[0] !== undefined) { break; }
      await Toolkit.sleep(10);
    }
  }
}

module.exports = Toolkit;
