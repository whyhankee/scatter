<app>
    <div id="app"></div>

    <script>
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

            // Ow boy this is bad, it works for now though...
            function clearLayout () {
                var elem = document.getElementById('app');
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
        };
    </script>
</app>
