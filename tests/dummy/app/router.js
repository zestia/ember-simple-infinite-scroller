/* eslint-disable array-callback-return */

import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('example-1');
  this.route('example-2');
  this.route('example-3');
  this.route('example-4');
});
