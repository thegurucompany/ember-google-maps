import Base from './base';
import layout from '../../templates/components/g-map/directions';
import { inject as service } from '@ember/service';
import { get, setProperties } from '@ember/object';
import { reads } from '@ember/object/computed';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { Promise } from 'rsvp';

export default Base.extend({
  layout,

  _type: 'direction',

  googleMapsApi: service(),
  directionsService: reads('googleMapsApi.directionsService'),

  _ignoreAttrs: ['onDirectionsChanged'],
  _requiredOptions: ['origin', 'destination', 'travelMode', 'waypoints'],
  _watchedOptions: ['waypoints.[]'],

  init() {
    this._super(...arguments);
    this.waypoints = A();

    setProperties(this.publicAPI, {
      waypoints: this.waypoints
    });
  },

  _addComponent() {
    this.getRoute().then(() => this._didAddComponent());
  },

  _updateComponent() {
    this.getRoute();
  },

  getRoute() {
    return this.route().then((directions) => {
      const newDirections = {
        directions,
        mapComponent: directions
      };
      setProperties(this, newDirections);
      setProperties(this.publicAPI, newDirections);
      tryInvoke(this, 'onDirectionsChanged', [this.publicAPI]);
    });
  },

  route() {
    return get(this, 'directionsService').then((directionsService) => {
      const options = get(this, '_options');
      delete options.map;

      return new Promise((resolve, reject) => {
        directionsService.route(options, (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(status);
          }
        });
      });
    });
  },

  _registerWaypoint(waypoint) {
    get(this, 'waypoints').pushObject(waypoint);
  },

  _unregisterWaypoint(waypoint) {
    get(this, 'waypoints').removeObject(waypoint);
  }
});
