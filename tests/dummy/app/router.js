import Router from '@ember/routing/router';
import config from './config/environment';

const DummyRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

DummyRouter.map(function() {
  this.route('example-1');
  this.route('example-2');
  this.route('example-3');
});

export default DummyRouter;
