/*
 * VoteStore
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var reqwest = require('reqwest');
var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var TopicConstants = require('../components/topics/TopicConstants');

var CHANGE_EVENT = 'change';

var _topics = [];


/**
 * Create a Topic.
 * @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
 * @param  {string} name The title of the Topic
 * @param  {string} url The link to the Topic
 * @param  {string} summary Short text about the Topic
 * @param  {string} description Long text about the Topic
 * @param  {string} attribution
 */
function create(baseurl, name, url, summary, description, attribution) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _topics[id] = {
        id: id,
        name: name,
        url: url,
        summary: summary,
        description: description,
        attribution: attribution
    };

    // this is from the original react tutorial
    reqwest({
        url: baseurl,
        type: 'json',
        method: 'POST',
        data: {
            author: author,
            text: text
        },
        success: function(data) {
            _topics = data;
            TopicStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
}

/**
 * Update a Topic.
 * @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
 * @param  {int} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(baseurl, id, updates) {
    _topics[id] = assign({}, _topics[id], updates);
    // @TODO PUT update
}

/**
* Delete a Topic.
* @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
* @param  {string} id
*/
function destroy(baseurl, id) {
    delete _topics[id];
    // @TODO PUT deletion
}

/**
* Retrieve all Topics from the server.
* @param  {string} baseurl is the url to GET a list of data from
*/
function loadFromServer(baseurl) {
    reqwest({
        url: baseurl,
        type: 'json',
        method: 'GET',
        cache: false,
        success: function(data) {
            populateLocalData(data);
            TopicStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
}

/**
 * Populate local array with server data
 * @param  {array} data
 */
function populateLocalData(data) {
    _topics = []; // should we reset before adding in new values? or allow partial overrides?
    _.each(data, function(topicObject) {
        _topics[topicObject.userId] = topicObject;
    });
}

var TopicStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the entire collection of Topics.
    * @return {object}
    */
    getAll: function() {
        return _topics;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    var text;

    switch(action.actionType) {
        case TopicConstants.TOPIC_CREATE:
            create(action.baseurl, action.author, text);
            break;

        case TopicConstants.TOPIC_REFRESH:
            console.log('refresh');
            loadFromServer(action.baseurl);
            break;

        case TopicConstants.TOPIC_DESTROY:
            destroy(action.baseurl, action.id);
            TopicStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = TopicStore;
