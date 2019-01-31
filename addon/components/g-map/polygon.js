import MapComponent from './map-component';
import { get, set } from '@ember/object';

/**
 * A wrapper for the google.maps.Polyline class.
 *
 * @class Polygon
 * @namespace GMap
 * @module ember-google-maps/components/g-map/polygon
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  _type: 'polygon',
  _requiredOptions: ['path'],
  _watchedOptions: ['path.[]'],

  _addComponent() {
    set(this, 'mapComponent', new google.maps.Polygon(get(this, '_options')));
  }
});
