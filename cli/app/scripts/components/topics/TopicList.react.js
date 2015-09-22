/*
* Heavily cribbed from the React tutorial at:
* https://facebook.github.io/react/docs/tutorial.html
* ... and from the Flux tutorial app:
* https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/MainSection.react.js
*
* TopicList
*/
var React = require('react');

var TopicRow = require('./TopicRow.react');
var TopicActions = require('../../actions/TopicActions');

var TopicList = React.createClass({
    render: function() {
        if (Object.keys(this.props.allTopics).length < 1) {
            return null;
        }

        var allTopics = this.props.allTopics;
        var Topics = [];

        for (var key in allTopics) {
            Topics.push(<TopicRow
                    key={key}
                    name={allTopics[key].name}
                    url={allTopics[key].url}
                    summary={allTopics[key].summary}
                    attribution={allTopics[key].attribution}>
                {allTopics[key].description}
                </TopicRow>);
        }

        return (
            <div className="TopicList">
            {Topics}
            </div>
        );
    }
});

module.exports = TopicList
