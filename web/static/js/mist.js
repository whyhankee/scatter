/* socket server */

window.onload = function onLoad() {
  io = io.connect();
  io.emit('ready');
};
