import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('example-1');
  this.route('example-2');
  this.route('example-3');
});

export default Router;
