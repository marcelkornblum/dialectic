/*
 * VoteSection
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the VoteStore and passes the new data to its children.
 */
var React = require('react');
var cx = require('classnames');
var VoteStore = require('../../stores/VoteStore');
var VoteActions = require('../../actions/VoteActions');

/**
* Retrieve the current Vote data from the VoteStore
*/
function getVoteState(objectType, objectId, userId) {
    var userVote = VoteStore.getByObjectAndUser(objectType, objectId, userId);
    return {
        allVotes: VoteStore.getByObject(objectType, objectId),
        userUpVote: userVote !== null && userVote.isUpvote === true,
        userDownVote: userVote !== null && userVote.isUpvote === false,
        userNoVote: userVote === null,
        total: VoteStore.getTotalByObject(objectType, objectId)
    };
}

var VoteSection = React.createClass({

    handleVoteUpSubmit: function() {
        VoteActions.voteUp(this.props.url, this.props.objectType, this.props.objectId, this.props.userId);
    },

    handleVoteDownSubmit: function() {
        VoteActions.voteDown(this.props.url, this.props.objectType, this.props.objectId, this.props.userId);
    },

    getInitialState: function() {
        return getVoteState(this.props.objectType, this.props.objectId, this.props.userId);
    },

    componentDidMount: function() {
        VoteStore.addChangeListener(this._onChange);
        VoteActions.refresh(this.props.url, this.props.objectType, this.props.objectId);
    },

    componentWillUnmount: function() {
        VoteStore.removeChangeListener(this._onChange);
    },

    /**
    * @return {object}
    */
    render: function() {
        var sectionClasses = cx({
            'vote-section': true,
            'has-voted': !this.state.userNoVote,
            'has-voted--Up': this.state.userUpVote,
            'has-voted--Down': this.state.userDownVote
        });
        var upButtonClasses = cx({
            'up-vote-Action': true,
            'selected': this.state.userUpVote
        });
        var downButtonClasses = cx({
            'down-vote-Action': true,
            'selected': this.state.userDownVote
        });
        return (
            <div className={sectionClasses}>
                <button onClick={this.handleVoteUpSubmit}
                    className={upButtonClasses}
                    disabled={this.state.userUpVote ? "disabled": ""}>&Delta;</button><br />
                <abbr title={this.state.total + " " + this.props.title}>{this.state.total}</abbr><br />
                <button onClick={this.handleVoteDownSubmit}
                    className={downButtonClasses}
                    disabled={this.state.userDownVote ? "disabled": ""}>&nabla;</button>
            </div>
            );
    },

    /**
    * Event handler for 'change' events coming from the VoteStore
    */
    _onChange: function() {
        this.setState(getVoteState(this.props.objectType, this.props.objectId, this.props.userId));
    }
});

module.exports = VoteSection;
