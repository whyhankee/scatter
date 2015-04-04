<core>
    <header>
        <div class="container">
            <div class="logo">
                <a href="#"><img class="logo-image" src="static/img/logo.png"/></a>
            </div>

            <nav class="navigation">
                <ul>
                    <li><p class={ loaded ? 'welcome-message loaded' : 'welcome-message' }>Welcome back <strong>{ welcomeMessage }</strong></p></li>
                    <li class="last"><a href="#" onclick={ logout }>Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main role="main" id="main">
        <div class="container">
            <aside id="channels">
                <h3>Channels</h3>
            </aside>
            <div id="timeline"></div>
                <h3>Timeline</h3>
            <aside id="contacts">
                <h3>Contacts</h3>
            </aside>
        </div>
    </main>

    <script>
        var self = this;

        this.on('mount', function() {
            console.log('[Core.js] Mounted');
            var token = localStorage.getItem('token');
            // Get the user data from the server
            retreiveUserData(token);
            // Tell the server to start a Xmpp Client
            rpc(token, 'startXmppClient', {}, function (response) {
                if (response.err) {
                    // Handle no XMPP error;
                }
            });
        });

        app.on('close', function () {
            console.log('[Core.tag] Received event - close');
            self.unmount();
        });

        function retreiveUserData (token) {
            rpc(token, 'userGetMe', {}, function (response) {
                console.log('[Core.js] userGetMe ', response);
                if (response.err) {
                    // Check error might want to unload and go to login
                }

                if (response.result) {
                    self.loaded = true;
                    welcomeMessage = response.result.username;
                    riot.update();
                }
            });
        }



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
