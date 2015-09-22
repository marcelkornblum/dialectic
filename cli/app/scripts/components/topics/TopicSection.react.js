/*
 * TopicSection
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TopicStore and passes the new data to its children.
 */
var React = require('react');
var cx = require('classnames');
var TopicForm = require('./TopicForm.react');
var TopicList = require('./TopicList.react');
var TopicStore = require('../../stores/TopicStore');
var TopicActions = require('../../actions/TopicActions');

/**
* Retrieve the current Topic data from the TopicStore
*/
function getTopicState() {
    return {
        allTopics: TopicStore.getAll()
    };
}

var TopicSection = React.createClass({

    handleTopicSubmit: function() {
        TopicActions.create(this.props.url, this.props.userId);
    },

    getInitialState: function() {
        return getTopicState();
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this._onChange);
        console.log('did mount');
        TopicActions.refresh(this.props.url);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this._onChange);
    },

    /**
    * @return {object}
    */
    render: function() {
        return (
            <div className="topic-section">
                <h1>Topics</h1>
                <TopicList
                    allTopics={this.state.allTopics} />
            </div>
            );
    },

    /**
    * Event handler for 'change' events coming from the TopicStore
    */
    _onChange: function() {
        this.setState(getTopicState());
    }
});

module.exports = TopicSection;

