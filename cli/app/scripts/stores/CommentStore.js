/*
 * Heavily cribbed from the Flux tutorial app:
 * https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/stores/TodoStore.js
 *
 * CommentStore
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../AppDispatcher');
var CommentConstants = require('../components/comments/CommentConstants');

var CHANGE_EVENT = 'change';

var _comments = {};

/**
* Create a Comment.
* @param  {string} baseurl is the URL to POST comments to, the specific URL is built from this
* @param  {string} author The author of the Comment
* @param  {string} text The content of the Comment
*/
function create(baseurl, author, text) {
    // Hand waving here -- not showing how this interacts with XHR or persistent
    // server-side storage.
    // Using the current timestamp + random number in place of a real id.
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _comments[id] = {
        id: id,
        author: author,
        text: text
    };

    // this is from the original react tutorial
    $.ajax({
        url: baseurl,
        dataType: 'json',
        type: 'POST',
        data: {
            author: author,
            text: text
        },
        success: function(data) {
            _comments = data;
            CommentStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
}

/**
* Update a Comment.
* @param  {string} baseurl is the URL to POST comments to, the specific URL is built from this
* @param  {string} id
* @param {object} updates An object literal containing only the data to be
*     updated.
*/
function update(baseurl, id, updates) {
    _comments[id] = assign({}, _comments[id], updates);
    // @TODO PUT update
}

/**
* Update all of the Comments with the same object.
* @param  {string} baseurl is the URL to POST comments to, the specific URL is built from this
* @param  {object} updates An object literal containing only the data to be
*     updated.
*/
function updateAll(baseurl, updates) {
    for (var id in _comments) {
        update(id, updates);
    }
}

/**
* Retrieve all Comments from the server.
* @param  {string} baseurl is the url to GET a list of data from
*/
function loadFromServer(baseurl) {
    $.ajax({
        url: baseurl,
        dataType: 'json',
        cache: false,
        success: function(data) {
            _comments = data;
            CommentStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
};

/**
* Delete a Comment.
* @param  {string} baseurl is the URL to POST comments to, the specific URL is built from this
* @param  {string} id
*/
function destroy(baseurl, id) {
    delete _comments[id];
    // @TODO PUT deletion
}

var CommentStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the entire collection of Comments.
    * @return {object}
    */
    getAll: function() {
        return _comments;
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
        case CommentConstants.COMMENT_CREATE:
            text = action.text.trim();
            if (text !== '') {
                create(action.baseurl, action.author, text);
                CommentStore.emitChange();
            }
            break;

        case CommentConstants.COMMENT_UPDATE_TEXT:
            text = action.text.trim();
            if (text !== '') {
                update(action.baseurl, action.id, {text: text});
                CommentStore.emitChange();
            }
            break;

        case CommentConstants.COMMENT_REFRESH:
            loadFromServer(action.baseurl);
            break;

        case CommentConstants.COMMENT_DESTROY:
            destroy(action.baseurl, action.id);
            CommentStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = CommentStore;
