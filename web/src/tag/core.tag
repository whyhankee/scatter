<core>
    <header>
        <div class="container">
            <div class="logo">
                <a href="#"><img class="logo-image" src="static/img/logo.png"/></a>
            </div>

            <nav class="navigation">
                <ul>
                    <li><p class='welcome-message loaded'>Welcome back <strong>{ welcomeMessage }</strong></p></li>
                    <li class="last"><a href="#" onclick={ logout }>Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main role="main" id="main">
        <div class="container">
            <aside id="channels">
                <channels></channels>
            </aside>
            <div id="activity">
                <activity></activity>
            </div>
            <aside id="contacts">
                <contacts></contacts>
            </aside>
        </div>
    </main>

    <script>
        /* jshint ignore:start */
        var self = this;

        this.on('mount', function() {
            console.log('[Core.js] Mounted');

            // Set classname
            document.body.className = 'main';
            // Get the user data from the server
            //retreiveUserData();
            var userCredentials = JSON.parse(localStorage.getItem('userCredentials'));
            welcomeMessage = userCredentials.username.toString();
            self.update();
        });

        app.on('close', function () {
            console.log('[Core.tag] Received event - close');
            self.unmount();
        });


        /**
         * @method logout
         * @private
         * @param  {Object} evt
         */
        logout (evt) {
            console.log('[Core.js] Logout ', evt);
            // @todo: Move to user library
            app.trigger('logout');
        }


    </script>
</core>
