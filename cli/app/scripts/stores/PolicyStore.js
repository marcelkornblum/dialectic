/*
 * VoteStore
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var reqwest = require('reqwest');
var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var PolicyConstants = require('../components/policies/PolicyConstants');

var CHANGE_EVENT = 'change';

var _policies = [];


/**
 * Create a Policy.
 * @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
 * @param  {int} topicId
 * @param  {string} name The title of the Policy
 * @param  {string} summary Short text about the Policy
 * @param  {string} description Long text about the Policy
 * @param  {string} state
 * @param  {boolean} selected
 */
function create(baseurl, topicId, name, summary, description, state, selected) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _policies[topicId][id] = {
        id: id,
        name: name,
        summary: summary,
        description: description,
        state: state,
        selected: selected
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
            _policies = data;
            PolicyStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
}

/**
 * Update a Policy.
 * @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
 * @param  {int} topicId
 * @param  {int} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(baseurl, topicId, id, updates) {
    _policies[topicId][id] = assign({}, _policies[id], updates);
    // @TODO PUT update
}

/**
* Delete a Policy.
* @param  {string} baseurl is the URL to POST evidence to, the specific URL is built from this
* @param  {string} id
*/
function destroy(baseurl, id) {
    delete _policies[id];
    // @TODO PUT deletion
}

/**
 * Get the Policy for the specified Topic
 * @param  {int} topicId
 */
function getPolicyForTopic(topicId) {
    console.log('getting', _policies);
    if (!(topicId in _policies)) {
        _policies[topicId] = [];
    }
    console.log('got', _policies);
    return _policies[topicId];
}

/**
* Retrieve all Policies from the server.
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
            PolicyStore.emitChange();
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
    // _policies = []; // should we reset before adding in new values? or allow partial overrides?
    _.each(data, function(topicObject) {
        var topicId = topicObject.topicId;
        _policies[topicId] = [];
        _.each(topicObject.values, function(policyObject) {
            _policies[topicId][policyObject.id] = {
                id: policyObject.id,
                name: policyObject.name,
                summary: policyObject.summary,
                description: policyObject.description,
                state: policyObject.state,
                selected: policyObject.selected
            };
        });
    });
}

var PolicyStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the entire collection of Policies.
    * @return {object}
    */
    getAll: function() {
        return _policies;
    },

    /**
     * Get the collection of Policies relating to the given Topic.
     * @param {int} topicId
     */
    getByTopic: function(topicId) {
        console.log('get for', topicId);
        return getPolicyForTopic(topicId);
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
        case PolicyConstants.POLICY_CREATE:
            create(action.baseurl, action.author, text);
            break;

        case PolicyConstants.POLICY_REFRESH:
            console.log('refresh');
            loadFromServerForTopic(action.baseurl, action.topicId);
            break;

        case PolicyConstants.POLICY_DESTROY:
            destroy(action.baseurl, action.id);
            PolicyStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = PolicyStore;
