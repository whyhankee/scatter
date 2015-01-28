riot.tag('layout', '<div id="test"> </div>', function(opts) {
        window.onload = function onLoad() {
            io = io.connect();
            io.emit('ready');

            var authenticated = false;

            if (authenticated) {;
                riot.mount('app');
            } else {
                riot.mountTo(document.getElementById('test'), 'login');
            }


            riot.route(function(collection, id, action) {
                console.log('route is called', collection, id, action);
                riot.unmount('login');
                riot.mountTo(document.getElementById('test'), 'app');
            });
        };
    
});
