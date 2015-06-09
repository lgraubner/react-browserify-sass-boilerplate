/**
 * Simple wrapper for Google Maps API v3.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 0.1.0
 */
var GoogleMap = (function(window, document, $, google) {
    "use strict";

    var _maps = {},
        _queue = [],
        _loaded = false;

    /**
     * Default Google Map settings.
     */
    var _defaults = {
        draggable: true,
        scrollwheel: true,
        disableDefaultUI: false,
        disableDoubleClickZoom: false,
        minZoom: null,
        mapTypeControl:false,
        maxZoom: null,
        zoom: 11,
        center: null,
    };

    /**
     * Initializes a Google Map with given options.
     *
     * @param  {Object} mapOptions  object with options for new map
     */
    var _initMap = function(mapOptions) {
        var options = $.extend({
                center: new google.maps.Latlng(mapOptions.coords)
            }, _defaults, mapOptions.options);

        var map = new google.maps.Map($(mapOptions.container).get(), options),
            marker, coords;

        $.each(mapOptions.marker, function(key, marker) {
            coords = marker.coords.split(",");
            marker = new google.maps.Marker({
                position : new google.maps.LatLng(coords[0], coords[1]),
                icon : (marker.icon ? new google.maps.MarkerImage(marker.icon) : null),
                title : marker.title,
                map : map
            });

            // TODO: Marker infowindows
        });

        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });

        _maps[mapOptions.name] = map;
    };

    /**
     * Getter for created maps by name.
     *
     * @param  {string} name    name of map
     * @return {Map}            Google map
     */
    var getMap = function(name) {
        return _maps[name];
    };

    /**
     * Set defaults to use for new maps.
     *
     * @param  {Object} options     object containing default options
     */
    var setDefaults = function(options) {
        _defaults = $.extend(_defaults, options);
    };

    /**
     * Adds map to create to queue or initializes it if Google maps is ready.
     *
     * @param  {Object} mapOptions  options for new Google Map
     */
    var create = function(mapOptions) {
        if (!_loaded) {
            _queue.push(mapOptions);
        } else {
            _initMap(mapOptions);
        }
    };

    /**
     * Listens for dom ready and initializes all maps in the queue.
     */
    var init = function() {
        google.maps.event.addDomListener(window, 'load', function() {
            $.each(_queue, function(key, mapOptions) {
                _initMap(mapOptions);
            });
            _loaded = true;
        });
    };

    return {
        create: create,
        getMap: getMap,
        setDefaults: setDefaults
    };

})(this, document, jQuery, google);

GoogleMap.init();
