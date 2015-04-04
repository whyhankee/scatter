/* jshint node: true */
"use strict";


var categories = [
  'public',
  'personal',
  'informative',
  'funny',
];


 // User model
 //
function createUserModel(obj)  {
  obj.User = obj.db.createModel('user', {
    id: String,

    username: String,
    password: String,
    email: String,

    created: Date,
    confirmed: Date,
    deleted: Date,
    blocked: Date,

    authToken: String
  });

  obj.User.ensureIndex('username');
  obj.User.ensureIndex('email');
  obj.User.ensureIndex('authToken');

}


// Contacts
//
function createContactModel(obj) {
  obj.Contact = obj.db.createModel('contact', {
    id: String,

    userId: String,
    username: String,
    following: Boolean,

    created: Date,
    accepted: Date,
  });

}



// TimelineItems
//
// function createTimelineItem(obj) {
//   obj.TimelineItem = obj.db.createModel('timelineitem', {
//     id: String,

//     ownerId: String,
//     recipients: Array,

//     category: String,
//     title: String,
//     body: String,
//     body_url: String,

//     created: String,
//   });
// }


// Notifications
//
// function createNotifications(obj) {
//   obj.Notification = obj.db.createModel('notifications', {
//     userId: String,

//     type: String,
//     title: String,

//     created: String,
//     read: Date
//   });
// }


// Create all models
//
function createModels(obj) {
  createUserModel(obj);
  createContactModel(obj);

  obj.User.hasMany(obj.Contact, 'contacts', 'id', 'userId');
  obj.Contact.belongsTo(obj.User, 'user', 'userId', 'id');
}


// Exports
//
exports.createModels = createModels;
