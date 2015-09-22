/*
 * EvidenceSection
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the EvidenceStore and passes the new data to its children.
 */
var React = require('react');
var cx = require('classnames');
var EvidenceForm = require('./EvidenceForm.react');
var EvidenceList = require('./EvidenceList.react');
var EvidenceStore = require('../../stores/EvidenceStore');
var EvidenceActions = require('../../actions/EvidenceActions');

/**
* Retrieve the current Evidence data from the EvidenceStore
*/
function getEvidenceState(topicId) {
    return {
        allEvidence: EvidenceStore.getByTopic(topicId)
    };
}

var EvidenceSection = React.createClass({

    handleEvidenceSubmit: function() {
        EvidenceActions.create(this.props.url, this.props.topicId, this.props.userId);
    },

    getInitialState: function() {
        return getEvidenceState(this.props.topicId);
    },

    componentDidMount: function() {
        EvidenceStore.addChangeListener(this._onChange);
        console.log('did mount', this.props.topicId);
        EvidenceActions.refresh(this.props.url, this.props.topicId);
    },

    componentWillUnmount: function() {
        EvidenceStore.removeChangeListener(this._onChange);
    },

    /**
    * @return {object}
    */
    render: function() {
        return (
            <div className="evidence-section">
                <h1>Evidence for topic {this.props.topicId}</h1>
                <EvidenceList
                    allEvidence={this.state.allEvidence} />
            </div>
            );
    },

    /**
    * Event handler for 'change' events coming from the EvidenceStore
    */
    _onChange: function() {
        this.setState(getEvidenceState(this.props.topicId));
    }
});

module.exports = EvidenceSection;

