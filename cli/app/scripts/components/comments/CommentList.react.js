/*
* Heavily cribbed from the React tutorial at:
* https://facebook.github.io/react/docs/tutorial.html
* ... and from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/MainSection.react.js
*
* CommentList
*/
var React = require('react');

var Comment = require('./Comment.react');
var CommentActions = require('../../actions/CommentActions');

var CommentList = React.createClass({
    render: function() {
        if (Object.keys(this.props.allComments).length < 1) {
            return null;
        }

        var allComments = this.props.allComments;
        var comments = [];

        for (var key in allComments) {
            comments.push(<Comment key={key} author={allComments[key].author}>
                {allComments[key].text}
                </Comment>);
        }

        return (
            <div className="commentList">
            {comments}
            </div>
        );
    }
});

module.exports = CommentList
