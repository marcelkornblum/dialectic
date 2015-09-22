/*
 * PolicySection
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the PolicyStore and passes the new data to its children.
 */
var React = require('react');
var cx = require('classnames');
var PolicyForm = require('./PolicyForm.react');
var PolicyList = require('./PolicyList.react');
var PolicyStore = require('../../stores/PolicyStore');
var PolicyActions = require('../../actions/PolicyActions');

/**
* Retrieve the current Policy data from the PolicyStore
*/
function getPolicyState(topicId) {
    return {
        allPolicies: PolicyStore.getByTopic(topicId)
    };
}

var PolicySection = React.createClass({

    handlePolicySubmit: function() {
        PolicyActions.create(this.props.url, this.props.topicId, this.props.userId);
    },

    getInitialState: function() {
        return getPolicyState(this.props.topicId);
    },

    componentDidMount: function() {
        PolicyStore.addChangeListener(this._onChange);
        console.log('did mount', this.props.topicId);
        PolicyActions.refresh(this.props.url, this.props.topicId);
    },

    componentWillUnmount: function() {
        PolicyStore.removeChangeListener(this._onChange);
    },

    /**
    * @return {object}
    */
    render: function() {
        return (
            <div className="policy-section">
                <h1>Policies for topic {this.props.topicId}</h1>
                <PolicyList
                    allPolicies={this.state.allPolicies} />
            </div>
            );
    },

    /**
    * Event handler for 'change' events coming from the PolicyStore
    */
    _onChange: function() {
        this.setState(getPolicyState(this.props.topicId));
    }
});

module.exports = PolicySection;

