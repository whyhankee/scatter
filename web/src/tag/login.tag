<login>
    <div id="login-container">
        <div class="login-content">
            <div class="logo-container">
                <div class="logo" />
            </div>
            <div id="error" class={ errorState ? 'error-container show' : 'error-container' }><p> { errorMessage }</p></div>
            <form id="login" onsubmit={ submit }>
                <input name="username" class="input" id="username" type="text" placeholder="Name">
                <input name="password" class="input" id="password" type="password" placeholder="Password">
                <button name="submit" class="submit">Sign in</button>
            </form>
            <div class="unauthenticated-footer-links">
                <div class="unauthenticated-footer-links-left"><a href="#register">Register</a></div>
                <div class="unauthenticated-footer-links-right"><a href="#forgot-password">Forgot your password?</a></div>
            </div>
        </div>
    </div>

    <script>
        /* jshint ignore:start */
        'use strict';

        // Move to a util library
        document.title = 'Scatter - Login';
        // grab above HTML elements
        var form = this.login,
            button = this.submit;

        var self = this;

        submit(e) {
            e.preventDefault();

            var username = this.username.value.trim(),
                password = this.password.value.trim();

            console.log('Emit - Authenticate');

            var usernameSplit =  username.split("@");
            var serverUrl = usernameSplit[1];

            console.log('***** serverUrl, usernameSplit', serverUrl, usernameSplit);

            client = new XMPP.Client({
                websocket: { url: 'ws://' + serverUrl + ':5280' },
                jid: username,
                password: password
            });

            client.addListener(
                'online',
                function() {
                    self.unmount();
                    app.trigger('authenticated');
                }
            )

            client.addListener(
                'error',
                function(e) {
                    self.errorState = true;
                    self.errorMessage = response.err.message || 'Unknown';
                    riot.update();
                }
            )

            // io.emit('userGetAuthToken', { username: username, password: password});

            // io.on('userGetAuthTokenResponse', function (response) {
            //     console.log('[Login.js] Authenticate response', response);

            //     if (response.err || !response.result) {
            //         self.errorState = true;
            //         self.errorMessage = response.err.message || 'Unknown';
            //         riot.update();
            //         return false;
            //     }

            //     if (response.result && response.result.token) {
            //         localStorage.setItem('token', response.result.token);
            //         self.unmount();
            //         app.trigger('authenticated');
            //     }
            // })
        }


        this.on('mount', function () {
            console.log('[login.tag] Mount');
        });

        this.on('unmount', function () {
            console.log('[login.tag] Unmount');
        });

        app.on('close', function () {
            console.log('[login.tag] Received event - close');
            self.unmount();
        });

    </script>

</login>
