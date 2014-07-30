$ = jQuery    = require('jquery');
_             = require('lodash');
caretPosition = require('textarea-caret-position/index');
React         = require('react');

require('velocity');

var util = {
  store: function (namespace, data) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }
    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || {};
  },
  stripTags: function(html) {
    return html.replace(/<\/?\w+?>/g, ' ');
  },
  wordCount: function(html) {
    return (' ' + util.stripTags(html) + ' ').split(/\s+/g).length - 2;
  },
  scrollToCaret: function(textarea, lineHeight) {
    var coords = caretPosition(textarea, textarea.selectionEnd),
      $textarea = $(textarea),
      newtop = coords.top - document.documentElement.clientHeight / 2,
      diff = newtop - $textarea.scrollTop();

    if (Math.abs(diff) <= lineHeight) {
      $textarea.scrollTop(newtop);
    } else {
      $textarea.velocity("stop").velocity('scroll', {
        container: $textarea,
        offset: diff,
        duration: 200
      });
    }
  }
};


///////////////////
// model

var TextNode = function(props) {
  this.id = props.id;
  this.html = props.html;
  this.links = props.links; // TODO
}

TextNode.prototype.wordCount = function() {
  return util.wordCount(this.html);
}

var TextNodeCollection = function() {
  this.nodes = _.map(util.store('nodes'), function(props) {
    return new TextNode(props);
  });
  if (_.isEmpty(this.nodes)) {
    this.nodes = [new TextNode('Click here and start typing.')]
  }
  this.nodeMap = _.zipObject(_.pluck(this.nodes, 'id'), this.nodes);
};

TextNodeCollection.prototype.update = function(id, html) {
  this.nodeMap[id].html = html;
  util.store('nodes', this.nodes);
}

///////////////////
// React

var dom = React.DOM;

var WordCounter = React.createClass({
  render: function() {
    return dom.div({id: "count"}, this.props.count);
  }
});

var Pane = React.createClass({
  emitChange: function() {
    var html = this.getDOMNode().innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange(this.props.id, html);
    }
    this.lastHtml = html;
    // TODO scroll to caret
  },
  shouldComponentUpdate: function(nextProps) {
    return nextProps.html !== this.getDOMNode().innerHTML;
  },
  render: function() {
    return dom.div({
      className: 'pane',
      contentEditable: true,
      onInput: this.emitChange,
      onBlur: this.emitChange,
      dangerouslySetInnerHTML: {__html: this.props.html}
    });
  }
})

var App = React.createClass({
  getInitialState: function() {
    return {wordCount: 0, paneWordCounts: {}};
  },
  handleChange: function(id, html) {
    this.props.model.update(id, html);
    this.setState({
      wordCount: _.reduce(this.props.model.nodes, function(sum, node) {
        return sum + node.wordCount();
      }, 0)
    });
  },
  render: function() {
    var handleChange = this.handleChange;

    var panes = _.map(this.props.model.nodes, function(node) {
      return Pane({
        id: node.id,
        key: node.id,
        html: node.html,
        onChange: handleChange
      });
    });

    return dom.div(
      null,
      panes,
      WordCounter({count: this.state.wordCount})
    );
  }
});

React.renderComponent(App({model: new TextNodeCollection()}), document.getElementById('map'));
