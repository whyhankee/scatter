<contacts>
    <div id="contacts-container">
        <div class="contacts-header">
            <div class="contacts-header-title">
                <h3>Contacts</h3>
            </div>
            <div class="contacts-header-button">
                <!--<a href="" onclick={ addContact }>Add Contact</a>-->
            </div>
        </div>

        <div class="contacts-main">
            <ul>
                <li>
                    <div class="contact-name">Paul</div>
                    <div class="contact-status">Invitation pending</div>
                </li>
            </ul>
        </div>

        <div class="contacts-footer">
            <form id="login" onsubmit={ submit }>
                <input name="username" class="input" id="username" type="text" placeholder="Username">
                <button name="submit" class="submit">add contact</button>
            </form>
        </div>


    </div>

    <script>
        var self = this;

        addContact (evt) {
            console.log('[Contacts.js] Adding contact');
        }

        submit(evt) {
            var userData = { username: self.username.value.trim() };

            var token = localStorage.getItem('token');
            // Tell the server to start a Xmpp Client
            rpc(token, 'userContactRequest', userData, function (response) {
                if (response.err) {
                    // Handle no XMPP error;
                }
            });
        }

    </script>
</contacts>
