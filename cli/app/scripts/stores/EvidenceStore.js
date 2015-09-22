/*
 * VoteStore
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var reqwest = require('reqwest');
var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var EvidenceConstants = require('../components/evidence/EvidenceConstants');

var CHANGE_EVENT = 'change';

var _evidence = [];


/**
 * Create a piece of Evidence.
 * @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
 * @param  {int} topicId
 * @param  {string} name The title of the Evidence
 * @param  {string} url The link to the piece of Evidence
 * @param  {string} summary Short text about the Evidence
 * @param  {string} description Long text about the Evidence
 * @param  {string} attribution
 */
function create(baseurl, topicId, name, url, summary, description, attribution) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _evidence[topicId][id] = {
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
            _evidence = data;
            EvidenceStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
}

/**
 * Update a piece of Evidence.
 * @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
 * @param  {int} topicId
 * @param  {int} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(baseurl, topicId, id, updates) {
    _evidence[topicId][id] = assign({}, _evidence[id], updates);
    // @TODO PUT update
}

/**
* Delete a piece of Evidence.
* @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
* @param  {string} id
*/
function destroy(baseurl, id) {
    delete _evidence[id];
    // @TODO PUT deletion
}

/**
 * Get the Evidence for the specified object
 * @param  {int} topicId
 */
function getEvidenceForTopic(topicId) {
    console.log('getting', _evidence);
    if (!(topicId in _evidence)) {
        _evidence[topicId] = [];
    }
    console.log('got', _evidence);
    return _evidence[topicId];
}

/**
* Retrieve all Evidence from the server.
* @param  {string} baseurl is the url to GET a list of data from
*/
function loadFromServerForTopic(baseurl, topicId) {
    reqwest({
        url: baseurl,
        type: 'json',
        method: 'GET',
        cache: false,
        success: function(data) {
            populateLocalData(data);
            EvidenceStore.emitChange();
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
    _evidence = []; // should we reset before adding in new values? or allow partial overrides?
    _.each(data, function(topicObject) {
        var topicId = topicObject.topicId;
        _evidence[topicId] = [];
        _.each(topicObject.values, function(evidenceObject) {
            _evidence[topicId][evidenceObject.userId] = evidenceObject;
        });
    });
}

var EvidenceStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the entire collection of Evidence.
    * @return {object}
    */
    getAll: function() {
        return _evidence;
    },

    /**
     * Get the collection of Evidence relating to the given object.
     * @param {int} topicId
     */
    getByTopic: function(topicId) {
        console.log('get for', topicId);
        return getEvidenceForTopic(topicId);
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
        case EvidenceConstants.EVIDENCE_CREATE:
            create(action.baseurl, action.author, text);
            break;

        case EvidenceConstants.EVIDENCE_REFRESH:
            console.log('refresh');
            loadFromServerForTopic(action.baseurl, action.topicId);
            break;

        case EvidenceConstants.EVIDENCE_DESTROY:
            destroy(action.baseurl, action.id);
            EvidenceStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = EvidenceStore;
