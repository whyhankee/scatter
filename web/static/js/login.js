riot.tag('login', '<div class="row"> <h1>{ page.title }</h1> <div id="error" class="{ errorState ? \'show\' : \'\' }"><p><strong>Oops, something went wrong </strong><br ></br> { errorMessage } <br ></br> { errorStack }</p></div> <form id="login" onsubmit="{ submit }"> <input name="username" id="username" type="text" placeholder="username"> <input name="password" id="password" type="password" placeholder="password"> <button name="submit">Submit</button> </form> </div>', function(opts) {
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
                    self.errorMessage = response.err.message;
                    self.errorStack = response.err.stack;
                    riot.update()
                }

                console.log('Success!', response.result);

                riot.route('main')
            });
        }.bind(this);
});
