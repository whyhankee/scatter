riot.tag('layout', '<div id="content"> </div>', function(opts) {
        window.onload = function onLoad() {
            io = io.connect();
            io.emit('ready');

            var authenticated = false;

            if (authenticated) {;
                riot.mount('app');
            } else {
                riot.mountTo(document.getElementById('content'), 'login');
            }


            riot.route(function(collection, id, action) {
                console.log('route is called', collection, id, action);
                clearLayout();
                riot.mountTo(document.getElementById('content'), 'app');
            });

            function clearLayout () {
                var elem = document.getElementById('content');
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
        };
    
});
