<register>
    <div id="register-container">
        <div class="register-content">
            <div class="logo-container">
                <div class="logo" />
            </div>
            <div id="error" class={ errorState ? 'error-container show' : 'error-container' }><p> { errorMessage }</p></div>
            <form id="register" onsubmit={ submit }>
                <input name="email" class="input" id="email" type="text" placeholder="Email">
                <input name="username" class="input" id="username" type="text" placeholder="Name">
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
        document.title = 'Scatter - Register';

        var self = this;

        submit(e) {
            var data = {
                email: self.email.value.trim(),
                username: self.username.value.trim(),
                password: self.password.value.trim()
            }
            console.log('[Register.js] Registering ', data);

            io.emit('userSignup', data);

            io.on('userSignupResponse', function (response) {
                console.log('[Register.js] Server response', response);
                if (response.err) {
                    self.errorState = true;
                    self.errorMessage = response.err.message || 'Unknown';
                    riot.update();
                    return false;
                }
                console.log('Greate Succes, you are now a member!', response.result);
                iot.route('login');
            })

        }
    </script>
</register>
