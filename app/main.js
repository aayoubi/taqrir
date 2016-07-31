// React Class Hierarchy
//  - MxTimeTable
//      - FileSelector
//      - DateFilter ?
//      - Breakdowns ?
//      - TeamTable
//        - PieChart
//        - DrillDownBarChart
//      - UserTables
//        - User
//          - PieChart
//          - DrillDownBarChart
//        ...

require.config({
  baseUrl : '../',
  paths: {
    "jquery": "bower_components/jquery/dist/jquery.min",
    "bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
    "bootstrap-multiselect": "bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect",
    "underscore": "bower_components/underscore/underscore-min",
    "highcharts": "bower_components/highcharts/highcharts",
    "highcharts-drilldown": "bower_components/highcharts/modules/drilldown",
    "react": "bower_components/react/react-with-addons",
    "react-dom": "bower_components/react/react-dom.min",
    "react-select": "bower_components/react-select/dist/react-select",
    "react-input-autosize": "bower_components/react-input-autosize/dist/react-input-autosize",
    "classnames": "bower_components/classnames/index",
    "babel": "bower_components/requirejs-react-jsx/babel-5.8.34.min",
    "jsx": "bower_components/requirejs-react-jsx/jsx",
    "text": "bower_components/requirejs-text/text"
  },

  shim : {
    react: {
      "exports": "React"
    },
    'bootstrap-multiselect': {
      deps: ["bootstrap", "jquery"]
    },
    highcharts: {
      exports: "Highcharts",
      deps: ["jquery"]
    },
    "highcharts-drilldown": {
      exports: "Highcharts",
      deps: ["highcharts"]
    }
  },

  config: {
    babel: {
      sourceMaps: "inline", // One of [false, 'inline', 'both']. See https://babeljs.io/docs/usage/options/
      fileExtension: ".jsx" // Can be set to anything, like .es6 or .js. Defaults to .jsx
    }
  }
});

define('reactSelectDep',['react', 'react-input-autosize', 'classnames'],function(React, autoSize, classNames){
    window['React'] = React;
    window['classNames'] = classNames;
    window['AutosizeInput'] = autoSize;
    return {};
})

define('reactInputDep',['react'],function(React){
    window['React'] = React;
    return {};
})

define('reactClassnamesDep',['react'],function(React){
    window['React'] = React;
    return {};
})

require(['jsx!lib/app'], function(App){
  var app = new App();
  app.init();
});
