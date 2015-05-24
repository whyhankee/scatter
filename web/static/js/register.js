riot.tag('register', '<div id="register-container"> <div class="register-content"> <div class="logo-container"> <div class="logo"></div> </div> <div id="error" class="{ errorState ? \'error-container show\' : \'error-container\' }"><p> { errorMessage }</p></div> <form id="register" onsubmit="{ submit }">  <input name="username" class="input" id="username" type="text" placeholder="Username (full domain)"> <input name="password" class="input" id="password" type="password" placeholder="Password"> <button name="submit" class="submit">Register</button> </form> <div class="unauthenticated-footer-links"> <div class="unauthenticated-footer-links-left"><a href="#">Login</a></div> <div class="unauthenticated-footer-links-right"><a href="#forgot-password">Forgot your password?</a></div> </div> </div> </div>', function(opts) {
        
        document.title = 'Scatter - Register';

        var self = this;

        this.submit = function(e) {
            e.preventDefault();

            var username = self.username.value.trim();
            var password = self.password.value.trim();

            console.log('[Register.js] Registering ');

            var usernameSplit =  username.split("@");
            var serverUrl = usernameSplit[1];

            console.log('***** serverUrl, usernameSplit', serverUrl, usernameSplit);

            client = new XMPP.Client({
                websocket: { url: 'ws://' + serverUrl + ':5280' },
                jid: username,
                password: password,
                register: true
            });

            client.addListener('online',
                function () {
                    console.log('Great Succes, you are now a member!');

                    var userCredentials = { username: username, password: password, serverUrl: serverUrl  };
                    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
                    self.unmount();
                    app.trigger('authenticated');
                }
            )

            client.addListener('error',
                function (e) {
                    self.errorState = true;
                    self.errorMessage = e || 'Unknown';
                    riot.update();
                }
            )

            client.on("stanza", function(stanza) {
                console.log('***** stanza', stanza);
            });

        }.bind(this);
    
});
