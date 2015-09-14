var React = require('react');
var CommentSection = require('./components/comments/CommentSection.react.js');

React.render(
    <CommentSection url="scripts/comments.json" pollInterval={200000} />,
    document.getElementById('comments')
);
