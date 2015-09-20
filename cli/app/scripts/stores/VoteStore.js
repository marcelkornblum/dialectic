/*
 * VoteStore
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var reqwest = require('reqwest');
var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var VoteConstants = require('../components/votes/VoteConstants');

var CHANGE_EVENT = 'change';

var _votes = {};
var _totals = {};

/**
 * Register an upvote
 * @param  {string} baseurl is the URL to POST votes to, the specific URL is built from this
 * @param  {string} objectType from AppConstants
 * @param  {int} objectId
 * @param  {int} userId
 */
function voteup(baseUrl, objectType, objectId, userId) {
    return vote(baseUrl, objectType, objectId, userId, true);
}

/**
 * Register a downvote
 * @param  {string} baseurl is the URL to POST votes to, the specific URL is built from this
 * @param  {string} objectType from AppConstants
 * @param  {int} objectId
 * @param  {int} userId
 */
function votedown(baseUrl, objectType, objectId, userId) {
    return vote(baseUrl, objectType, objectId, userId, false);
}

/**
 * Register a Vote, specifying up- or down-voting
 * @param  {string} baseurl is the URL to POST votes to, the specific URL is built from this
 * @param  {string} objectType from AppConstants
 * @param  {int} objectId
 * @param  {int} userId
 * @param  {bool} isUpvote
 */
function vote(baseurl, objectType, objectId, userId, isUpvote) {
    var objectVotes = getVotesForObject(objectType, objectId);
    if (userId in objectVotes) {
        if (objectVotes[userId].isUpvote === !isUpvote) {
            // we're cancelling a previous opposite-value vote
            delete _votes[objectType][objectId][userId];
            if (isUpvote === true) {
                _totals[objectType][objectId] += 1;
            }
            else {
                _totals[objectType][objectId] -= 1;
            }
        }
        // if we've already got a vote of this value for this object, disregard this action
    }
    else {
        // register a new vote
        _votes[objectType][objectId][userId] = { isUpvote: isUpvote };
        if (isUpvote === true) {
            _totals[objectType][objectId] += 1;
        }
        else {
            _totals[objectType][objectId] -= 1;
        }
    }
    // @TODO:
    // POST vote
    // register change

    // this is from the original react tutorial
    // reqwest({
    //     url: baseurl,
    //     type: 'json',
    //     method: 'POST',
    //     data: {
    //         author: author,
    //         text: text
    //     },
    //     error: function(xhr, status, err) {
    //         console.error(baseurl, status, err.toString());
    //     }.bind(this),
    //     success: function(data) {
    //         _votes = data;
    //         VoteStore.emitChange();
    //     }.bind(this)
    // });
    VoteStore.emitChange();
}

/**
 * Get total Votes on the given object; which is upvotes - downvotes
 * @param  {string} objectType from AppConstants
 * @param  {int} objectId
 */
function getTotalVotesForObject(objectType, objectId) {
    if (!(objectType in _totals)) {
        _totals[objectType] = [];
    }
    if (!(objectId in _totals[objectType])) {
        // we need to calculate it
        _totals[objectType][objectId] = 0;
        var objectVotes = getVotesForObject(objectType, objectId);
        _.each(objectVotes, function(value) {
            if (value !== undefined) {
                if (value.isUpvote === true) {
                    _totals[objectType][objectId] += 1;
                }
                else {
                    _totals[objectType][objectId] -= 1;
                }
            }
        });
    }
    return _totals[objectType][objectId];
}

/**
 * Get the Votes for the specified object
 * @param  {string} objectType from AppConstants
 * @param  {int} objectId
 */
function getVotesForObject(objectType, objectId) {
    if (!(objectType in _votes)) {
        _votes[objectType] = [];
    }
    if (!(objectId in _votes[objectType])) {
        _votes[objectType][objectId] = [];
    }
    return _votes[objectType][objectId];
}

/**
 * Retrieve all Votes from the server.
 * @param  {string} baseurl is the url to GET a list of data from
 */
function loadFromServerForObject(baseurl, objectType, objectId) {
    reqwest({
        url: getBaseURLForObject(baseurl, objectType, objectId),
        type: 'json',
        method: 'GET',
        cache: false,
        success: function(data) {
            populateLocalData(data);
            VoteStore.emitChange();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(baseurl, status, err.toString());
        }.bind(this)
    });
};

/**
 * Populate local array with server data
 * @param  {array} data
 */
function populateLocalData(data) {
    _votes = []; // should we reset before adding in new values? or allow partial overrides?
    _totals = [];
    _.each(data, function(objectTypeObject) {
        var objectType = objectTypeObject.objectType;
        _votes[objectType] = [];
        _.each(objectTypeObject.values, function(objectIdObject) {
            var objectId = objectIdObject.objectId;
            _votes[objectType][objectId] = [];
            _.each(objectIdObject.values, function(voteObject) {
                _votes[objectType][objectId][voteObject.userId] = { isUpvote: voteObject.isUpvote };
            });
        });
    });
};

/**
 * Build object-related vote URL on the server as specific base for GET, POST etc
 * @param {string} baseurl
 * @param {string} objectType from AppConstants
 * @param {int} objectId
 */
function getBaseURLForObject(baseurl, objectType, objectId) {
    // @TODO do a better job of working out the URL from the objectType
    return baseurl;// + '/' + objectType + '/' + objectId;
}

var VoteStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the collection of Votes relating to the given object.
     * @param {string} objectType from AppConstants
     * @param {int} objectId
     */
    getByObject: function(objectType, objectId) {
        return getVotesForObject(objectType, objectId);
    },

    /**
     * Get any Vote on the given object by the given User.
     * @param {string} objectType from AppConstants
     * @param {int} objectId
     * @param {int} userId
     */
    getByObjectAndUser: function(objectType, objectId, userId) {
        var objectVotes = getVotesForObject(objectType, objectId);
        if (userId in objectVotes) {
            return objectVotes[userId];
        }
        else {
            return null;
        }
    },

    /**
     * Get total Votes on the given object; which is upvotes - downvotes
     * @param {string} objectType from AppConstants
     * @param {int} objectId
     */
    getTotalByObject: function(objectType, objectId) {
        return getTotalVotesForObject(objectType, objectId);
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
    switch(action.actionType) {
        case VoteConstants.VOTE_UP:
            voteup(action.baseurl, action.objectType, action.objectId, action.userId);
            break;

        case VoteConstants.VOTE_DOWN:
            votedown(action.baseurl, action.objectType, action.objectId, action.userId);
            break;

        case VoteConstants.VOTE_REFRESH:
            loadFromServerForObject(action.baseurl, action.objectType, action.objectId);
            break;

        default:
            // no op
    }
});

module.exports = VoteStore;
