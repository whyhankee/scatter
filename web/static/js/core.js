riot.tag('core', '<header> <div class="container"> <div class="logo"> <a href="#"><img class="logo-image" src="static/img/logo.png"></a> </div> <nav class="navigation"> <ul> <li><p class="{ loaded ? \'welcome-message loaded\' : \'welcome-message\' }">Welcome back <strong>{ welcomeMessage }</strong></p></li> <li class="last"><a href="#" onclick="{ logout }">Logout</a></li> </ul> </nav> </div> </header> <main role="main" id="main"> <div class="container"> <aside id="channels"> <channels></channels> </aside> <div id="activity"> <activity></activity> </div> <aside id="contacts"> <contacts></contacts> </aside> </div> </main>', function(opts) {
        
        var self = this;

        this.on('mount', function() {
            console.log('[Core.js] Mounted');

            document.body.className = 'main';


        });

        app.on('close', function () {
            console.log('[Core.tag] Received event - close');
            self.unmount();
        });

        function retreiveUserData (token) {

            client.send


            rpc(token, 'userGetMe', {}, function (response) {
                console.log('[Core.js] userGetMe ', response);
                if (response.err) {

                }

                if (response.result) {
                    self.loaded = true;
                    welcomeMessage = response.result.username;
                    riot.update();
                }
            });
        }



        
        this.logout = function(evt) {
            console.log('[Core.js] Logout ', evt);

            app.trigger('logout');
        }.bind(this);


    
});
