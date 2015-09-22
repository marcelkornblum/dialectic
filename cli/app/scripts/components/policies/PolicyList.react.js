/*
* Heavily cribbed from the React tutorial at:
* https://facebook.github.io/react/docs/tutorial.html
* ... and from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/MainSection.react.js
*
* PolicyList
*/
var React = require('react');

var PolicyRow = require('./PolicyRow.react');
var PolicyActions = require('../../actions/PolicyActions');

var PolicyList = React.createClass({
    render: function() {
        if (Object.keys(this.props.allPolicies).length < 1) {
            return null;
        }

        var allPolicies = this.props.allPolicies;
        var Policies = [];

        for (var key in allPolicies) {
            Policies.push(<PolicyRow
                    key={key}
                    name={allPolicies[key].name}
                    summary={allPolicies[key].summary}
                    description={allPolicies[key].description}
                    state={allPolicies[key].state}
                    selected={allPolicies[key].selected}>
                {allPolicies[key].description}
                </PolicyRow>);
        }

        return (
            <div className="PolicyList">
            {Policies}
            </div>
        );
    }
});

module.exports = PolicyList
