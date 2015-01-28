<layout>

    <login></login>
    <main></main>

    <script>
        window.onload = function onLoad() {
            io = io.connect();
            io.emit('ready');

            var guid = (function() {
              function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                           .toString(16)
                           .substring(1);
              }
              return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                       s4() + '-' + s4() + s4() + s4();
              };
            })();

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
