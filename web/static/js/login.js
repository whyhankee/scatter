riot.tag('login', '<div class="row"> <h1>{ page.title }</h1> <div id="error" class="{ errorState ? \'show\' : \'hide\' }"><p>Oops, something went wrong</p></div> <form id="login" onsubmit="{ submit }"> <input name="username" id="username" type="text" placeholder="username"> <input name="password" id="password" type="password" placeholder="password"> <button name="submit">Submit</button> </form> </div>', function(opts) {
        var form = this.login,
            button = this.submit

        this.submit = function(e) {

            var username = this.username.value,
                password = this.password.value;

            var uuid = guid();

            console.log('Emit - Authenticate', uuid);
            socket.emit('authenticate', { username: username, password: password, requestId: uuid});

            socket.on('authenticateResponse', function (data) {
                console.log('On - authenticateResponse', data);

                if (data.err) {
                    errorState = true;
                    this.update();
                    return console.log('Error');
                }

                console.log('Success!');
            })
        }.bind(this);
    
});
