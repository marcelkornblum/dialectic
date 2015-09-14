/*
* Heavily cribbed from the React tutorial at:
* https://facebook.github.io/react/docs/tutorial.html
* ... and from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/TodoApp.react.js
*
* CommentSection
*/

/**
* This component operates as a "Controller-View".  It listens for changes in
* the CommentStore and passes the new data to its children.
*/
var React = require('react');

var CommentForm = require('./CommentForm.react');
var CommentList = require('./CommentList.react');
var CommentStore = require('../../stores/CommentStore');
var CommentActions = require('../../actions/CommentActions');

/**
* Retrieve the current Comment data from the CommentStore
*/
function getCommentState() {
    return {
        allComments: CommentStore.getAll()
    };
}

var CommentSection = React.createClass({

    handleCommentSubmit: function(comment) {
        CommentActions.create(this.props.url, comment.author, comment.text);
    },

    getInitialState: function() {
        return getCommentState();
    },

    componentDidMount: function() {
        CommentStore.addChangeListener(this._onChange);
        CommentActions.refresh(this.props.url);
    },

    componentWillUnmount: function() {
        CommentStore.removeChangeListener(this._onChange);
    },

    /**
    * @return {object}
    */
    render: function() {
        return (
            <div className="comments">
            <h1>Comments</h1>
            <CommentList allComments={this.state.allComments} />
            <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
            );
    },

    /**
    * Event handler for 'change' events coming from the CommentStore
    */
    _onChange: function() {
        this.setState(getCommentState());
    }

});

module.exports = CommentSection;















// var CommentSection = React.createClass({
//   getInitialState: function() {
//     return {data: []};
//   },
//   loadCommentsFromServer: function() {
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       cache: false,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   handleCommentSubmit: function(comment) {
//     var comments = this.state.data;
//     var newComments = comments.concat([comment]);
//     this.setState({data: newComments});
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       type: 'POST',
//       data: comment,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   componentDidMount: function() {
//     this.loadCommentsFromServer();
//     setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//   },
//   render: function() {
//     return (
//       <div className="comments">
//         <h1>Comments</h1>
//         <CommentList data={this.state.data} />
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//       </div>
//     );
//   }
// });

