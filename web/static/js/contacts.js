riot.tag('contacts', '<div id="contacts-container"> <div class="contacts-header"> <div class="contacts-header-title"> <h3>Contacts</h3> </div> <div class="contacts-header-button"> <a href="" onclick="{ addContact }">Add Contact</a> </div> </div> <div class="contacts-main"> <ul> <li if="{ contacts.length === 0 }" class="contacts-none"> <p>Loading...</p> </li> <li each="{ contacts }"> <div class="contact-name">{ username }</div> <div class="contact-status"> <a href="" onclick="{ deleteContact }">Delete</a> <em>{ status }</em> </div> </li> </ul> </div> </div>', function(opts) {
        
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

        this.addContact = function(evt) {
            app.trigger('dialog');
        }.bind(this);

        this.deleteContact = function(evt) {
            console.log('[Contacts.js] Revoking invite ');
        }.bind(this);
    
});
