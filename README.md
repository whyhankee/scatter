
![](https://github.com/whyhankee/mist/blob/master/assets/scatter_logo.png)

# Scatter

Scatter - An experiment in Distributed Social Networking with new technologies. Nothing special for now.

# Goals

* Data and inner working must be fully distributed (like Email)
* Functionality should be a combination of:
	* *Email* (person-to-person messaging)
	* *Chat*: Whatsapp / Facebook messenger
	* *Timeline*: Like Facebook


# Installation

## Requirements

* NodeJS (a decent 0.10 version). We are now at 0.10.35
* RethinkDB (current version 1.16)

## Get it running

* clone repository
* run `npm install` to install the dependencies
* run `npm run reload` to run the server


# Development

## Test Driven Development

* run `npm test` to run the tests
* run `npm run tdd` to run the tests and wait for changes

## Debug

We use the debug module for debugging, we currently support te following DEBUG options:

* `DEBUG=scatter:web` - for route debugging (http and socket)
* `DEBUG=scatter:xmppClient` - xmppClient related events
* `DEBUG=scatter:xmppServer` - xmppServer related events

Note: you can see them all by using `DEBUG=scatter:*`


# Todo

The project's current Todo list. Please Add / Remove issues

* Generate API documentation (using jsdoc?)
* implement events (requires an event service)
