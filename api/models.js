/* jshint node: true */
"use strict";


var categories = [
  'public',
  'personal',
  'informative',
  'funny',
];


/**
 * User model
 */
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


/**
 * Contacts
 */
function createContactsModel(obj) {
  obj.Contact = obj.db.createModel('friends', {
    id: String,

    userId: String,

    friendId: String,
    friendName: String,
    following: Boolean,

    accepted: Date,
  });
}


/**
 * TimelineItems
 */
function createTimelineItem(obj) {
  obj.TimelineItem = obj.db.createModel('timelineitem', {
    id: String,

    ownerId: String,
    recipients: Array,

    category: String,
    title: String,
    body: String,
    body_url: String,

    created: String,
  });
}


/**
 * TimelineItems
 */
function createNotifications(obj) {
  obj.Notification = obj.db.createModel('notifications', {
    userId: String,

    type: String,
    title: String,

    created: String,
    read: Date
  });
}


/**
 * Creates all the models
 */
function createModels(obj) {
  createUserModel(obj);

}


/**
 * Exports
 */
exports.createModels = createModels;
