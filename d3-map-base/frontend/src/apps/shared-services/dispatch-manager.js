/* HOW TO USE
this.testToken = dispatchManager.addListener('testEvent', tt);
function tt(r) {
  console.log('XXX', r);
}

setTimeout(() => {
  dispatchManager.removeListener(this.testToken);
}, 9000);

setTimeout(() => {
  dispatchManager.dispatch('testEvent', [10, 33, 'xxx']);
}, 3000);
*/

var {EventEmitter} = require('fbemitter');
const dispatchManager = {
  listeners: {},
  eventEmitter: new EventEmitter,
  addListener(eventName, listener) {
    return this.eventEmitter.addListener(eventName, (p) => {
      listener(p);
    });
  },
  removeListener(eventToken) {
    eventToken.remove();
  },
  dispatch(eventName, params) {
    this.eventEmitter.emit(eventName, params);
  }
};

export default dispatchManager;
