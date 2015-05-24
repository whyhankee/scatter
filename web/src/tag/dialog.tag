<dialog>
    <div class="dialog-overlay">
        <div class="dialog-container">
            <div class="dialog-header">
                <div class="dialog-title">
                    <h2>Add user</h2>
                </div>

                <div class="dialog-close">
                    <a href="" onclick={ close }>Close</a>
                </div>
            </div>

            <hr />

            <div class="dialog-content">
                <form onsubmit={ submit }>
                    <input name="username" class="input" id="username" type="text" placeholder="Username (full domain)">
                    <button name="submit" class="submit">add contact</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        /* jshint ignore:start */
        var self = this;

        close (evt) {
            self.unmount();
        }

        submit(e) {
            console.log('[Contacts.js] Adding contact');
            var userData = { username: self.username.value.trim() };
            // Locale update
            //reset state
            self.username.value = '';

            var token = localStorage.getItem('token');
            // // Tell the server to start a Xmpp Client
            rpc(token, 'userContactRequest', userData, function (response) {
                console.log('[Contacts.js] Reponse ', response);
                app.trigger('contacts-add', response);
            });
            self.unmount();
        }

    </script>
</dialog>
