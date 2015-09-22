var React = require('react');

var TopicRow = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="topic">
        <h2 className="">
          {this.props.attribution}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

module.exports = TopicRow
