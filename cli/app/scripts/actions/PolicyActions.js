/*
* Heavily cribbed from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/actions/TodoActions.js
*
* PolicyActions
*/
var AppDispatcher = require('../AppDispatcher');
var PolicyConstants = require('../components/policies/PolicyConstants');

var PolicyActions = {

    /**
     * @param  {string} baseurl
     * @param  {string} author
     * @param  {string} text
     */
    create: function(baseurl, author, text) {
        AppDispatcher.dispatch({
            actionType: PolicyConstants.POLICY_CREATE,
            baseurl: baseurl,
            author: author,
            text: text
        });
    },

    /**
     * @param  {string} baseurl
     */
    refresh: function(baseurl, topicId) {
        console.log('action: refresh', topicId)
        AppDispatcher.dispatch({
            actionType: PolicyConstants.POLICY_REFRESH,
            baseurl: baseurl,
            topicId: topicId
        });
    },

    /**
     * @param  {string} baseurl
     * @param  {string} id
     */
    destroy: function(baseurl, id) {
        AppDispatcher.dispatch({
            actionType: PolicyConstants.POLICY_DESTROY,
            baseurl: baseurl,
            id: id
        });
    }

};

module.exports = PolicyActions;
