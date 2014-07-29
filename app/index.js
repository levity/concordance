$ = jQuery    = require('jquery');
caretPosition = require('textarea-caret-position/index');
React         = require('react');

require('velocity');

var dom = React.DOM;

var util = {
  wordCount: function(textarea) {
    return (' ' + textarea.value + ' ').split(/\s+/g).length - 2;
  },
  scrollToCaret: function(textarea, lineHeight) {
    var coords = caretPosition(textarea, textarea.selectionEnd),
      $textarea = $(textarea),
      newtop = coords.top - document.documentElement.clientHeight / 2,
      diff = newtop - $textarea.scrollTop();

    if (Math.abs(diff) <= lineHeight) {
      $textarea.scrollTop(newtop);
    } else {
      // FIXME any scrolling in progress should be canceled
      $textarea.velocity("stop").velocity('scroll', {
        container: $textarea,
        offset: diff,
        duration: 200
      });
    }
  }
};

var WordCounter = React.createClass({
  render: function() {
    return dom.div({id: "count"}, this.props.count);
  }
});

var TextInput = React.createClass({
  getInitialState: function() {
    return {wordCount: 0};
  },
  onTextChange: function() {
    var textarea = this.refs.textarea.getDOMNode();
    util.scrollToCaret(textarea, 33); // FIXME parameterize line height
    this.setState({wordCount: util.wordCount(textarea)});
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
