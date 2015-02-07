riot.tag('app', '<div id="app"></div>', function(opts) {
        window.onload = function onLoad() {
            io = io.connect(':2460');
            io.emit('ready');

            var authenticated = false;

            if (authenticated) {
            } else {
                riot.mountTo(document.getElementById('app'), 'login', {  title: 'Login' });
            }


            riot.route(function(collection, id, action) {
                console.log('route is called', collection, id, action);
                clearLayout();
                riot.mountTo(document.getElementById('app'), 'core');
            });

            function clearLayout () {
                var elem = document.getElementById('app');
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
        };
    
});
