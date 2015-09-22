/*
* Heavily cribbed from the React tutorial at:
* https://facebook.github.io/react/docs/tutorial.html
* ... and from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/MainSection.react.js
*
* EvidenceList
*/
var React = require('react');

var EvidenceRow = require('./EvidenceRow.react');
var EvidenceActions = require('../../actions/EvidenceActions');

var EvidenceList = React.createClass({
    render: function() {
        if (Object.keys(this.props.allEvidence).length < 1) {
            return null;
        }

        var allEvidence = this.props.allEvidence;
        var EvidenceItems = [];

        for (var key in allEvidence) {
            EvidenceItems.push(<EvidenceRow
                    key={key}
                    name={allEvidence[key].name}
                    url={allEvidence[key].url}
                    summary={allEvidence[key].summary}
                    attribution={allEvidence[key].attribution}>
                {allEvidence[key].description}
                </EvidenceRow>);
        }

        return (
            <div className="EvidenceList">
            {EvidenceItems}
            </div>
        );
    }
});

module.exports = EvidenceList
