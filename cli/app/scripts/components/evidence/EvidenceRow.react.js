var React = require('react');

var EvidenceRow = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="evidence">
        <h2 className="evidenceAttribution">
          {this.props.attribution}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

module.exports = EvidenceRow
