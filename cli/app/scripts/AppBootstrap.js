var React = require('react');
var CommentSection = require('./components/comments/CommentSection.react');
var VoteSection = require('./components/votes/VoteSection.react');
var EvidenceSection = require('./components/evidence/EvidenceSection.react');
var TopicSection = require('./components/topics/TopicSection.react');
var PolicySection = require('./components/policies/PolicySection.react');

React.render(
    <CommentSection
        url="scripts/comments.json"
        pollInterval={200000} />,
    document.getElementById('comments')
);
React.render(
    <VoteSection
        url="scripts/votes.json"
        pollInterval={200000}
        userId={33}
        objectType="evidence"
        objectId={2}
        title="votes" />,
    document.getElementById('votes')
);
React.render(
    <EvidenceSection
        url="scripts/evidence.json"
        pollInterval={200000}
        topicId={2} />,
    document.getElementById('evidence')
);

React.render(
    <TopicSection
        url="scripts/topics.json"
        pollInterval={200000} />,
    document.getElementById('topics')
);

React.render(
    <PolicySection
        url="scripts/policies.json"
        pollInterval={200000}
        topicId={2} />,
    document.getElementById('policies')
);
