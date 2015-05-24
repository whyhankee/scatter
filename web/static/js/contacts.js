riot.tag('contacts', '<div id="contacts-container"> <div class="contacts-header"> <div class="contacts-header-title"> <h3>Contacts</h3> </div> <div class="contacts-header-button"> <a href="" onclick="{ addContact }">Add Contact</a> </div> </div> <div class="contacts-main"> <ul> <li if="{ contacts.length === 0 }" class="contacts-none"> <p>Loading...</p> </li> <li each="{ contacts }"> <div class="contact-name">{ username }</div> <div class="contact-status"> <a href="" onclick="{ parent.deleteContact }">Delete</a> <a href="" onclick="{ parent.retryInvite }">Retry</a> <em>{ status }</em> </div> </li> </ul> </div> </div>', function(opts) {
        

        
        var self = this;
        var token = localStorage.getItem('token');

        self.contacts = [];

        function contactsUpdate (response) {
            console.log('[Contacts.js] contactsUpdate ', response);
            if (response.err || !response.result) {
                return;
            }
            var resultContacts = response.result;

            if (self.contacts.length <= resultContacts.length) {
                var diff = _.difference(_.pluck(resultContacts, "id"), _.pluck(self.contacts, "id"));
                var contactsResult = _.filter(resultContacts, function(obj) { return diff.indexOf(obj.id) >= 0; });

                _.each(contactsResult, function (contact) {
                    console.log('[Contacts.js] Adding contact ', contact);
                    self.contacts.push(contact);
                });
            }

            if (self.contacts.length > resultContacts.length) {
                var deletedDiff = _.difference(_.pluck(self.contacts, "id"), _.pluck(resultContacts, "id"));
                var deletedContactsResult = _.filter(self.contacts, function(obj) { return deletedDiff.indexOf(obj.id) >= 0; });
                _.each(deletedContactsResult, function (contact) {
                    console.log('[Contacts.js] Removing contact ', contact);
                    self.contacts.splice(_.indexOf(_.pluck(self.contacts, 'id'), contact.id), 1);
                });
            }

            self.update();
        }

        function contactAdd (contact) {
            resultContacts[c].status = resultContacts[c].accepted ? 'Accepted' : 'waiting...';
        }

        function contactDelete (contact) {

        }


        this.on('mount', function() {
            console.log('[Contacts.js] Mounted ');

        });

        app.on('contacts-add', contactsUpdate);


        this.addContact = function(e) {
            app.trigger('dialog');
        }.bind(this);

        this.deleteContact = function(e) {
            console.log('[Contacts.js] Deleting contact ', e.item.username);
            var contactData = { contactId: e.item.id, username: e.item.username };

        }.bind(this);

        this.retryInvite = function(e) {
            console.log('[Contacts.js] Re-sending an invite to ', e.item.username);
            var contactData = { id: e.item.id, username: e.item.username };





        }.bind(this);
    
});
