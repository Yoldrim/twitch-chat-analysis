// Inspired by the android.util.Log Java package
class Log {
  static verbose = false;

  static v(...args) {
    if (this.verbose) {
      console.log('Log.v/', ...args);
    }
  }

  static i(...args) {
    console.log('Log.i/', ...args);
  }

  // This should look more scary :ghost:
  static e(...args) {
    console.log('Log.e/', ...args);
  }
}

module.exports = Log;
