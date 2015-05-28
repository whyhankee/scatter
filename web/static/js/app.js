riot.tag('app', '<div id="app"></div>', function(opts) {
        

        window.onload = function onLoad() {


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
                if (localStorage.getItem('userCredentials')) {
                    transitionView('core');
                }
            })

            app.on('logout', function () {
                localStorage.removeItem('userCredentials');
                transitionView('login');
            });

            app.on('dialog', function () {

                dialogDiv = document.createElement('div');
                dialogDiv.id = 'dialog';
                document.body.appendChild(dialogDiv)

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

                if (localStorage.getItem('userCredentials')) {
                    router.core();
                } else {
                    router.login();
                }
            });

            if (localStorage.getItem('userCredentials')) {

                var userCredentials =  JSON.parse(localStorage.getItem('userCredentials'));
                client = new XMPP.Client({
                    websocket: { url: 'ws://' + userCredentials.serverUrl + ':5280' },
                    jid: userCredentials.username,
                    password: userCredentials.password
                });

                client.on("stanza", function(stanza) {
                    console.log('***** client stanza', stanza);
                });

                client.on("online", function () {
                    var stanza = new XMPP.Element('presence', {});
                    client.send(stanza)
                });

                riot.mount(document.getElementById('app'), 'core');

                return;
            }

            if (!localStorage.getItem('userCredentials') && !currentPage) {
                riot.mount(document.getElementById('app'), 'login');
            }
        };
    
});
