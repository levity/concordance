$ = jQuery    = require('jquery');
caretPosition = require('textarea-caret-position/index');
React         = require('react');

require('velocity');

var dom = React.DOM,
  lineHeight = 33;

var WordCounter = React.createClass({
  render: function() {
    return dom.div({id: "count"}, this.props.count);
  }
});

var TextInput = React.createClass({
  getInitialState: function() {
    return {wordCount: 0};
  },
  calculateWordCount: function(textarea) {
    var count = (' ' + textarea.value + ' ').split(/\s+/g).length - 2;
    return count;
  },
  onTextChange: function() {
    var textarea = this.refs.textarea.getDOMNode();
    this.scrollToCaret(textarea);
    this.setState({wordCount: this.calculateWordCount(textarea)});
  },
  scrollToCaret: function(textarea) {
    var coords = caretPosition(textarea, textarea.selectionEnd),
      $textarea = $(textarea),
      newtop = coords.top - document.documentElement.clientHeight / 2,
      diff = Math.abs($textarea.scrollTop() - newtop);
    if (diff <= lineHeight) {
      $textarea.scrollTop(newtop);
    } else {
      $(textarea).animate({scrollTop: newtop}, 200);
    }
  },
  render: function() {
    return dom.div(
      {className: 'card'},
      WordCounter({count: this.state.wordCount}),
      dom.textarea({
        onChange: this.onTextChange,
        defaultValue: 'hi. text is not saved',
        ref: 'textarea'
      })
    );
  }
});

React.renderComponent(TextInput(), document.body);
