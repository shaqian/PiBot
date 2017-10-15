if (process.platform === 'linux') {
  var rpio = require('rpio');
}

var init = function () {
  if (process.platform === 'linux') {
    rpio.open(29, rpio.OUTPUT, rpio.LOW);
    rpio.open(31, rpio.OUTPUT, rpio.LOW);
    rpio.open(38, rpio.OUTPUT, rpio.LOW);
    rpio.open(40, rpio.OUTPUT, rpio.LOW);
  }
}

var forward = function () {
  if (process.platform === 'linux') {
    rpio.write(29, rpio.LOW);
    rpio.write(31, rpio.HIGH);
    rpio.write(38, rpio.LOW);
    rpio.write(40, rpio.HIGH);
  }
}

var backward = function () {
  if (process.platform === 'linux') {
    rpio.write(29, rpio.HIGH);
    rpio.write(31, rpio.LOW);
    rpio.write(38, rpio.HIGH);
    rpio.write(40, rpio.LOW);
  }
}

var left = function () {
  if (process.platform === 'linux') {
    rpio.write(29, rpio.LOW);
    rpio.write(31, rpio.LOW);
    rpio.write(38, rpio.LOW);
    rpio.write(40, rpio.HIGH);
  }
}

var right = function () {
  if (process.platform === 'linux') {
    rpio.write(29, rpio.LOW);
    rpio.write(31, rpio.HIGH);
    rpio.write(38, rpio.LOW);
    rpio.write(40, rpio.LOW);
  }
}

var stop = function () {
  if (process.platform === 'linux') {
    rpio.write(29, rpio.LOW);
    rpio.write(31, rpio.LOW);
    rpio.write(38, rpio.LOW);
    rpio.write(40, rpio.LOW);
  }
}

module.exports = {
  init,
  forward,
  backward,
  left,
  right,
  stop
}
