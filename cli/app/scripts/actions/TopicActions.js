/*
* Heavily cribbed from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/actions/TodoActions.js
*
* TopicActions
*/
var AppDispatcher = require('../AppDispatcher');
var TopicConstants = require('../components/topics/TopicConstants');

var TopicActions = {

    /**
     * @param  {string} baseurl
     * @param  {string} author
     * @param  {string} text
     */
    create: function(baseurl, author, text) {
        AppDispatcher.dispatch({
            actionType: TopicConstants.TOPIC_CREATE,
            baseurl: baseurl,
            author: author,
            text: text
        });
    },

    /**
     * @param  {string} baseurl
     */
    refresh: function(baseurl) {
        console.log('action: refresh')
        AppDispatcher.dispatch({
            actionType: TopicConstants.TOPIC_REFRESH,
            baseurl: baseurl
        });
    },

    /**
     * @param  {string} baseurl
     * @param  {string} id
     */
    destroy: function(baseurl, id) {
        AppDispatcher.dispatch({
            actionType: TopicConstants.TOPIC_DESTROY,
            baseurl: baseurl,
            id: id
        });
    }

};

module.exports = TopicActions;
