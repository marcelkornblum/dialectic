var React = require('react');
var CommentSection = require('./components/comments/CommentSection.react.js');
var VoteSection = require('./components/votes/VoteSection.react.js');

React.render(
    <CommentSection url="scripts/comments.json" pollInterval={200000} />,
    document.getElementById('comments')
);
React.render(
    <VoteSection url="scripts/votes.json" pollInterval={200000} userId="33" objectType="evidence" objectId="2" />,
    document.getElementById('votes')
);
