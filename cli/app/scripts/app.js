var React = require('react');
var CommentBox = require('./components/CommentBox/CommentBox.react.js');

React.render(
    <CommentBox url="scripts/comments.json" pollInterval={200000} />,
    document.getElementById('comments')
);
