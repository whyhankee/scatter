<app>
    <div id="app"></div>
    <div id="dialog"></div>

    <script>
        window.onload = function onLoad() {
            io = io.connect(':2460');

            var client;

            var authenticated = false,
                currentPage;

            function transitionView (view) {
                currentPage = view;
                app.trigger('close');
                riot.mount(document.getElementById('app'), view);
            }

            var router = {
                register: function () {
                    transitionView('register');
                },
                login: function () {
                    transitionView('login');
                },
                core: function () {
                    transitionView('core');
                }
            }

            app.on('authenticated', function () {
                if (localStorage.getItem('token')) {
                    transitionView('core');
                }
            })

            app.on('logout', function () {
                localStorage.removeItem('token');
                transitionView('login');
            });

            app.on('dialog', function () {
                console.log('test');
                riot.mount(document.getElementById('dialog'), 'dialog');
            });

            riot.route.exec(function(page, id, action) {
                console.log('[App.js] Analysing the url (page, id, action)', page, id, action);
                if (page) {
                    router[page]();
                    currentPage = page;
                }
            });

            riot.route(function (page, id, action) {
                console.log('[App.js] Route is triggered (page, id, action)', page, id, action);
                if (page === 'register') {
                    return router.register();
                }

                if (localStorage.getItem('token')) {
                    router.core();
                } else {
                    router.login();
                }
            });

            if (localStorage.getItem('token')) {
                riot.mount(document.getElementById('app'), 'core');
                return;
            }

            if (!localStorage.getItem('token') && !currentPage) {
                riot.mount(document.getElementById('app'), 'login');
            }
        };
    </script>
</app>
