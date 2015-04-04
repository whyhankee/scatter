riot.tag('app', '<div id="app"></div>', function(opts) {
        window.onload = function onLoad() {
            io = io.connect(':2460');
            io.emit('ready');

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
                }
            }

            app.on('authenticated', function () {
                if (localStorage.getItem('token')) {
                    transitionView('core');
                }
            })

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

                if (!authenticated) {
                    return router.login();
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
    
});
