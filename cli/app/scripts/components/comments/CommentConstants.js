/*
 * Heavily cribbed from the Flux tutorial app:
 * https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/constants/TodoConstants.js
 *
 * CommentConstants
 */

var keyMirror = require('keymirror');

module.exports = keyMirror({
  COMMENT_CREATE: null,
  COMMENT_UPDATE_TEXT: null,
  COMMENT_REFRESH: null,
  COMMENT_DESTROY: null
});
