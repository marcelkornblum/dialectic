/*
 * VoteActions
 */
var AppDispatcher = require('../AppDispatcher');
var VoteConstants = require('../components/votes/VoteConstants');

var VoteActions = {

    /**
     * @param {string} baseurl
     * @param {string} objectType from AppConstants
     * @param {int} objectId
     * @param {int} userId
     */
    voteUp: function(baseurl, objectType, objectId, userId) {
        AppDispatcher.dispatch({
            actionType: VoteConstants.VOTE_UP,
            baseurl: baseurl,
            objectType: objectType,
            objectId: objectId,
            userId: userId
        });
    },

    /**
     * @param {string} baseurl
     * @param {string} objectType from AppConstants
     * @param {int} objectId
     * @param {int} userId
     */
    voteDown: function(baseurl, objectType, objectId, userId) {
        AppDispatcher.dispatch({
            actionType: VoteConstants.VOTE_DOWN,
            baseurl: baseurl,
            objectType: objectType,
            objectId: objectId,
            userId: userId
        });
    },

    /**
     * Refresh the votes for the given object
     * @param {string} baseurl
     * @param {string} objectType from AppConstants
     * @param {int} objectId
     */
    refresh: function(baseurl, objectType, objectId) {
        AppDispatcher.dispatch({
            actionType: VoteConstants.VOTE_REFRESH,
            baseurl: baseurl,
            objectType: objectType,
            objectId: objectId
        });
    }

};

module.exports = VoteActions;
