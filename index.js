$ = jQuery = require('jquery');
React = require('react');
require('velocity');

var dom = React.DOM;

var WordCounter = React.createClass({
  render: function() {
    return dom.div({id: "count"}, this.props.count);
  }
});

var TextInput = React.createClass({
  getInitialState: function() {
    return {wordCount: 0};
  },
  calculateWordCount: function() {
    var node = this.refs.textarea.getDOMNode();
    var count = (' ' + node.value + ' ').split(/\s+/g).length - 2;
    return count;
  },
  updateWordCount: function() {
    this.setState({wordCount: this.calculateWordCount()});
  },
  render: function() {
    return dom.div(
      {className: 'card'},
      WordCounter({count: this.state.wordCount}),
      dom.textarea({
        onChange: this.updateWordCount,
        defaultValue: 'hi. text is not saved',
        ref: 'textarea'
      })
    );
  }
});

React.renderComponent(TextInput(), document.body);