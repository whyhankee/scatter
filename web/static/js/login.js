riot.tag('login', '<div id="login-container"> <div class="login-content"> <div class="login-logo-container"> <div class="login-logo"></div> </div> <div id="error" class="{ errorState ? \'show\' : \'\' }"><p> { errorMessage }</p></div> <form id="login" onsubmit="{ submit }"> <input name="username" class="input" id="username" type="text" placeholder="Name"> <input name="password" class="input" id="password" type="password" placeholder="Password"> <button name="submit" class="submit">Sign in</button> </form> <div class="login-links"> <div class="login-links-register"><a href="#">Register</a></div> <div class="login-links-forgotpassword"><a href="#">Forgot your password?</a></div> </div> </div> </div>', function(opts) {
        document.title = 'Scatter - Login';

        var form = this.login,
            button = this.submit;

        var self = this;

        this.submit = function(e) {

            var username = this.username.value,
                password = this.password.value;

            console.log('Emit - Authenticate');

            io.emit('authenticate', { username: username, password: password});

            io.on('authenticateResponse', function (response) {
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
    
});
