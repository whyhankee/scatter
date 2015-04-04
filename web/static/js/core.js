riot.tag('core', '<header> <div class="logo"><a href="#">Scatter</a></div> </header> <main role="main" id="main"> <p class="{ loaded ? \'welcome-message loaded\' : \'welcome-message\' }">{ welcomeMessage }</p> </main>', function(opts) {
        var self = this;

        this.on('mount', function() {
            console.log('[core.js] Mounted');
            retreiveUserData(localStorage.getItem('token'));
        });

        function retreiveUserData (token) {
            rpc(token, 'userGetMe', {}, function (response) {
                console.log('[Core.js] userGetMe ', reponse);
                if (response.err) {

                }

                if (response.result) {
                    self.loaded = true;
                    welcomeMessage = 'Welcome, ' + response.result.username;
                }
            });
        }


    
});
