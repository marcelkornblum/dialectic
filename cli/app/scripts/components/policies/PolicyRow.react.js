var React = require('react');

var PolicyRow = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="policy">
        <h2 className="">
          {this.props.summary}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

module.exports = PolicyRow
