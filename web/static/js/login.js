riot.tag('login', '<div id="login-container"> <div class="login-content"> <div class="logo-container"> <div class="logo"></div> </div> <div id="error" class="{ errorState ? \'error-container show\' : \'error-container\' }"><p> { errorMessage }</p></div> <form id="login" onsubmit="{ submit }"> <input name="username" class="input" id="username" type="text" placeholder="Name"> <input name="password" class="input" id="password" type="password" placeholder="Password"> <button name="submit" class="submit">Sign in</button> </form> <div class="unauthenticated-footer-links"> <div class="unauthenticated-footer-links-left"><a href="#register">Register</a></div> <div class="unauthenticated-footer-links-right"><a href="#forgot-password">Forgot your password?</a></div> </div> </div> </div>', function(opts) {
        document.title = 'Scatter - Login';

        var form = this.login,
            button = this.submit;

        var self = this;

        this.submit = function(e) {
            var username = this.username.value.trim(),
                password = this.password.value.trim();

            console.log('Emit - Authenticate');

            io.emit('userGetAuthToken', { username: username, password: password});

            io.on('userGetAuthTokenResponse', function (response) {
                console.log('On - authenticateResponse', response);

                if (response.err) {
                    self.errorState = true;
                    self.errorMessage = response.err.message || 'Unknown';
                    riot.update();
                    return false;
                }

                console.log('Success!', response.result);

                riot.route('main')
            })
        }.bind(this);


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

    
});
