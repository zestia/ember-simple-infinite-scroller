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
import * as ApplicationController from './controllers/application.js';
import * as Example1Controller from './controllers/example-1.js';
import * as Example2Controller from './controllers/example-2.js';
import * as Example3Controller from './controllers/example-3.js';
import * as Example4Controller from './controllers/example-4.js';
import * as Example5Controller from './controllers/example-5.js';
import * as ThingsController from './controllers/_things.js';
import * as IndexRoute from './routes/index.js';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules({
    'demo/router': Router,
    'demo/controllers/application': ApplicationController,
    'demo/controllers/example-1': Example1Controller,
    'demo/controllers/example-2': Example2Controller,
    'demo/controllers/example-3': Example3Controller,
    'demo/controllers/example-4': Example4Controller,
    'demo/controllers/example-5': Example5Controller,
    'demo/controllers/_things': ThingsController,
    'demo/templates/application': ApplicationTemplate,
    'demo/templates/example-1': Example1Template,
    'demo/templates/example-2': Example2Template,
    'demo/templates/example-3': Example3Template,
    'demo/templates/example-4': Example4Template,
    'demo/templates/example-5': Example5Template,
    'demo/routes/index': IndexRoute
  });

  customEvents = {
    touchstart: null,
    touchmove: null,
    touchend: null,
    touchcancel: null
  };
}
