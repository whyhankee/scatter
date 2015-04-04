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
                    <p>You don't have any contacts :/</p>
                </li>
                <li each={ contacts }>
                    <div class="contact-name">{ name}</div>
                    <div class="contact-status">{ status }</div>
                </li>
            </ul>
        </div>
    </div>

    <script>
        var self = this;

        self.contacts = [];

        this.on('mount', function() {
            console.log('[Contacts.js] Mounted ');
        });

        app.on('contacts-add', function (contact) {
            if (!contact) {
                return;
            }

            self.contacts.push({name: contact.username, status: 'waiting..'});
            self.update();
        });

        addContact (evt) {
            app.trigger('dialog');
        }
    </script>
</contacts>
