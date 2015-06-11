/**
 * Simple wrapper for Google Maps API v3.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 0.2.0
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
        mapTypeControl: false,
        zoom: 11
    };

    /**
     * Initializes a Google Map with given options.
     *
     * @param  {Object} mapOptions  object with options for new map
     */
    var _initMap = function(mapOptions) {
        var coords = mapOptions.coords.split(",");

        var options = $.extend({
                center: new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]))
            }, _defaults, mapOptions.options);

        var map = new google.maps.Map($(mapOptions.container).get(0), options),
            marker;

            if (mapOptions.marker) {
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
        }

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
     * Executes when Google Maps is loaded. Auto detects maps and initializes all maps in queue.
     */
    var init = function() {
        $("[data-gmap-coords]").each(function() {
            var $el = $(this),
                data = $el.attr("data-gmap-coords").split(","),
                name = $el.attr("data-gmap-name") || null,
                zoom = parseInt(data[2]) || _defaults.zoom;

            _initMap({
                name: name,
                container: this,
                coords: data[0] + "," + data[1],
                options: {
                    zoom: zoom
                }
            });
        });

        _loaded = true;
        $.each(_queue, function(key, mapOptions) {
            _initMap(mapOptions);
        });
    };

    return {
        init: init,
        create: create,
        getMap: getMap,
        setDefaults: setDefaults
    };

})(this, document, jQuery, google);
