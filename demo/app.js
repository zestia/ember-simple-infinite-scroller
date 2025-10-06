import Application from '@ember/application';
import Resolver from 'ember-resolver';
import config from './config.js';
import * as Router from './router.js';
import * as ApplicationTemplate from './templates/application.gjs';
import * as Example1Template from './templates/example-1.gjs';
import * as Example2Template from './templates/example-2.gjs';
import * as Example3Template from './templates/example-3.gjs';
import * as Example4Template from './templates/example-4.gjs';
import * as Example5Template from './templates/example-5.gjs';
import * as ApplicationRoute from './routes/application.js';
import * as IndexRoute from './routes/index.js';
import * as ApplicationService from './services/application.js';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules({
    'demo/router': Router,
    'demo/templates/application': ApplicationTemplate,
    'demo/templates/example-1': Example1Template,
    'demo/templates/example-2': Example2Template,
    'demo/templates/example-3': Example3Template,
    'demo/templates/example-4': Example4Template,
    'demo/templates/example-5': Example5Template,
    'demo/routes/application': ApplicationRoute,
    'demo/routes/index': IndexRoute,
    'demo/services/application': ApplicationService
  });

  customEvents = {
    touchstart: null,
    touchmove: null,
    touchend: null,
    touchcancel: null
  };
}
