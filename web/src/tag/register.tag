<register>
    <div id="register-container">
        <div class="register-content">
            <div class="logo-container">
                <div class="logo" />
            </div>
            <div id="error" class={ errorState ? 'error-container show' : 'error-container' }><p> { errorMessage }</p></div>
            <form id="register" onsubmit={ submit }>
                <!-- <input name="email" class="input" id="email" type="text" placeholder="Email"> -->
                <input name="username" class="input" id="username" type="text" placeholder="Username (full domain)">
                <input name="password" class="input" id="password" type="password" placeholder="Password">
                <button name="submit" class="submit">Register</button>
            </form>
            <div class="unauthenticated-footer-links">
                <div class="unauthenticated-footer-links-left"><a href="#">Login</a></div>
                <div class="unauthenticated-footer-links-right"><a href="#forgot-password">Forgot your password?</a></div>
            </div>
        </div>
    </div>

    <script>
        /* jshint ignore:start */
        document.title = 'Scatter - Register';

        var self = this;

        submit(e) {
            e.preventDefault();

            // var email: self.email.value.trim(),
            var username = self.username.value.trim();
            var password = self.password.value.trim();

            console.log('[Register.js] Registering ');

            client = new XMPP.Client({
                websocket: { url: 'ws://dev.local:5280' },
                jid: username,
                password: password,
                register: true
            });

            client.addListener('online',
                function () {
                    console.log('Great Succes, you are now a member!');
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

        }
    </script>
</register>
