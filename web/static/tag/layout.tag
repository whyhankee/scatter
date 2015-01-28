<layout>

    <login></login>
    <main></main>

    <script>
        window.onload = function onLoad() {
            io = io.connect();
            io.emit('ready');

            var authenticated = false;
            if (authenticated) {
                riot.mount('login');
            } else {
                riot.mount('main');
            }

            riot.route(function(collection, id, action) {
                console.log('route is called', collection, id, action);
                riot.mount('main');
            });
        };
    </script>

</layout>
