/*
 * Heavily cribbed from the Flux tutorial app:
 * https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/actions/TodoActions.js
 *
 * CommentActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var CommentConstants = require('../constants/CommentConstants');

var CommentActions = {

  /**
   * @param  {string} baseurl
   * @param  {string} text
   */
  create: function(baseurl, author, text) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_CREATE,
      baseurl: baseurl,
      author: author,
      text: text
    });
  },

  /**
   * @param  {string} baseurl
   * @param  {string} id The ID of the Comment
   * @param  {string} text
   */
  updateText: function(baseurl, id, text) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_UPDATE_TEXT,
      baseurl: baseurl,
      id: id,
      text: text
    });
  },

  /**
   * @param  {string} baseurl
   */
  refresh: function(baseurl) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_REFRESH,
      baseurl: baseurl
    });
  },

  /**
   * @param  {string} baseurl
   * @param  {string} id
   */
  destroy: function(baseurl, id) {
    AppDispatcher.dispatch({
      actionType: CommentConstants.COMMENT_DESTROY,
      baseurl: baseurl,
      id: id
    });
  }

};

module.exports = CommentActions;
