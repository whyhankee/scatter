// depends on node-uuid (zie index)
function rpc(token, method, data, callback) {
  if (typeof callback !== 'function') {
    throw new Error('invalidArguments');
  }

  var uid = uuid.v4();
  data._meta = {
    requestId: uid,
    authToken: token
  };
  // register callback
  io.once(uid, callback);
  // Send to API
  io.emit(method, data);
}
