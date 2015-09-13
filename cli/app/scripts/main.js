var Comments = require('../components/Comments/comments.js');

React.render(
    <Comments url="scripts/comments.json" pollInterval={200000} />,
    document.getElementById('comments')
);
