riot.tag('contacts', '<div id="contacts-container"> <div class="contacts-header"> <div class="contacts-header-title"> <h3>Contacts</h3> </div> <div class="contacts-header-button"> <a href="" onclick="{ addContact }">Add Contact</a> </div> </div> <div class="contacts-main"> <ul> <li if="{ contacts.length === 0 }" class="contacts-none"> <p>You don\'t have any contacts :/</p> </li> <li each="{ contacts }"> <div class="contact-name">{ username }</div> <div class="contact-status">{ status }</div> </li> </ul> </div> </div>', function(opts) {
        var self = this;

        self.contacts = [];

        this.on('mount', function() {
            console.log('[Contacts.js] Mounted ');
        });

        app.on('contacts-add', function (contacts) {
            if (!contacts) {
                return;
            }

            for (c in contacts) {
                contacts[c].status = contacts[c].accepted ? 'Accepted' : 'waiting..';
            }
            self.contacts = contacts;
            self.update();
        });

        this.addContact = function(evt) {
            app.trigger('dialog');
        }.bind(this);
    
});
