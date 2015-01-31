
// depends on node-uuid (zie index.jade)
//
function rpc(method, token, data, callback) {
  if (typeof callback !== 'function') {
    throw new Error('invalidArguments');
  }

  var uid = uuid.v4();
  data._meta = {
    requestId: uid,
    authToken: token
  };
  io.once(uid, callback);
  io.emit(method, data);
}
