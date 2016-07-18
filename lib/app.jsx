define(function(require){

  const React = require('react');
  const ReactDOM = require('react-dom');
  const ActivityTable = require('jsx!lib/ActivityTable');

  function App() {
    this.testThing = ActivityTable;
    console.log(this.testThing);
    this.AppView = React.createClass({
      render: function() {
        return (
          <div>Test</div>
        )
      }
    });
  }

  App.prototype.init = function () {
    ReactDOM.render(<this.testThing />, document.getElementById('content'));
  };

  return App;

});
