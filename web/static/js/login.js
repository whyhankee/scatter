riot.tag('login', '<div id="login-container"> <div class="login-content"> <div class="login-logo-container"> <img class="login-logo" src="static/img/logo.png" /> </div> <div id="error" class="{ errorState ? \'show\' : \'\' }"><p> { errorMessage }</p></div> <form id="login" onsubmit="{ submit }"> <input name="username" id="username" type="text" placeholder="username"> <input name="password" id="password" type="password" placeholder="password"> <button name="submit" class="submit">Submit</button> </form> </div> </div>', function(opts) {
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
                    self.errorMessage = response.err.message || 'Unkown';
                    riot.update();
                    return false;
                }

                console.log('Success!', response.result);

                riot.route('main')
            })
        }.bind(this);
    
});
