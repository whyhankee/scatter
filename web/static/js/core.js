riot.tag('core', '<header> <div class="container"> <div class="logo"> <a href="#"><img class="logo-image" src="static/img/logo.png"/></a> </div> <nav class="navigation"> <ul> <li><p class=\'welcome-message loaded\'>Welcome back <strong>{ welcomeMessage }</strong></p></li> <li class="last"><a href="#" onclick="{ logout }">Logout</a></li> </ul> </nav> </div> </header> <main role="main" id="main"> <div class="container"> <aside id="channels"> <channels></channels> </aside> <div id="activity"> <activity></activity> </div> <aside id="contacts"> <contacts></contacts> </aside> </div> </main>', function(opts) {
        
        var self = this;

        this.on('mount', function() {
            console.log('[Core.js] Mounted');

            document.body.className = 'main';


            var userCredentials = JSON.parse(localStorage.getItem('userCredentials'));
            welcomeMessage = userCredentials.username.toString();
            self.update();
        });

        app.on('close', function () {
            console.log('[Core.tag] Received event - close');
            self.unmount();
        });


        
        this.logout = function(evt) {
            console.log('[Core.js] Logout ', evt);

            app.trigger('logout');
        }.bind(this);


    
});
