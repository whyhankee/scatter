<login>
    <div class="row">

        <h1>{ page.title }</h1>

        <div id="error" class={ errorState ? 'show' : 'hide' }><p>Oops, something went wrong</p></div>

        <form id="login" onsubmit={ submit }>
            <input name="username" id="username" type="text" placeholder="username">
            <input name="password" id="password" type="password" placeholder="password">
            <button name="submit">Submit</button>
        </form>

    </div>

    <script>
        // grab above HTML elements
        var form = this.login,
            button = this.submit;

        var self = this;

        submit(e) {

            var username = this.username.value,
                password = this.password.value;

            console.log('Emit - Authenticate');

            io.emit('authenticate', { username: username, password: password});

            io.on('authenticateResponse', function (response) {
                console.log('On - authenticateResponse', response);

                if (response.err) {
                    errorState = true;
                    self.update();
                    console.log('Error');
                }

                console.log('Success!', response.result);

                riot.route('main')
            })
        }
    </script>

</login>
