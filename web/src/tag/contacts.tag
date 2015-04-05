<contacts>
    <div id="contacts-container">
        <div class="contacts-header">
            <div class="contacts-header-title">
                <h3>Contacts</h3>
            </div>
            <div class="contacts-header-button">
                <a href="" onclick={ addContact }>Add Contact</a>
            </div>
        </div>

        <div class="contacts-main">
            <ul>
                <li if={ contacts.length === 0 } class="contacts-none">
                    <p>Loading...</p>
                </li>
                <li each={ contacts }>
                    <div class="contact-name">{ username }</div>
                    <div class="contact-status">
                        <a href="" onclick={ parent.deleteContact }>Delete</a>
                        <a href="" onclick={ parent.retryInvite }>Retry</a>
                        <em>{ status }</em>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <script>
        /* jshint ignore:start */
        var self = this;

        self.contacts = [];

        function updateContacts (response) {
            console.log('[Contacts.js] updateContacts ', response);
            if (response.err || !response.result) {
                return;
            }

            var resultContacts = response.result;

            for (var c in resultContacts) {
                resultContacts[c].status = resultContacts[c].accepted ? 'Accepted' : 'waiting...';
            }

            self.contacts = resultContacts;
            self.update();
        }

        this.on('mount', function() {
            console.log('[Contacts.js] Mounted ');
            var token = localStorage.getItem('token');

            rpc(token, 'userContactList', {}, updateContacts);
        });

        app.on('contacts-add', updateContacts);

        addContact (e) {
            app.trigger('dialog');
        }

        deleteContact (e) {
            console.log('[Contacts.js] Revoking invite ');
        }

        retryInvite(e) {
            var token = localStorage.getItem('token');
            var contactData = { id: e.item.id, username: e.item.username };
            // // Tell the server to start a Xmpp Client
            rpc(token, 'userContactRequestRetry', contactData, function (response) {
                console.log('[Contacts.js] Reponse ', response);
            });

        }
    </script>
</contacts>
