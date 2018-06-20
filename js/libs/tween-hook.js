import * as TWEEN from './Tween';

var oldFunc = TWEEN.Tween.prototype.to;
TWEEN.Tween.prototype.to = function (coords, duration) {
  duration /= 1000;
  return oldFunc.call(this, coords, duration);
};