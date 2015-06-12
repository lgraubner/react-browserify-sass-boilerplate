/**
 * Simple wrapper for Google Maps API v3.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 0.3.0
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
        options: {
            draggable: true,
            scrollwheel: true,
            disableDefaultUI: false,
            disableDoubleClickZoom: false,
            mapTypeControl: false,
            zoom: 11
        }
    };

    /**
     * Generates a random string.
     *
     * @param  {number} length  length of the random string
     * @return {string}         string with random characters
     */
    var _genRandStr = function(length) {
        var str = "",
            chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ ) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return str;
    };

    /**
     * Initializes a Google Map with given options.
     *
     * @param  {Object} mapOptions  object with options for new map
     */
    var _initMap = function(mapOptions) {
        var $cont = $(mapOptions.container),
            data = $cont.data(),
            coords;

        if ($cont.length === 0 || $cont.data("initialized") === true) return;

        var opts = $.extend(true, {}, _defaults, mapOptions, data);

        coords = opts.coords.split(",");
        opts.options.center = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));

        var map = new google.maps.Map($cont.get(0), opts.options),
            marker;

        if (opts.marker) {
            $.each(opts.marker, function(key, marker) {
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

        var name = opts.name || _genRandStr(5);
        _maps[name] = map;
        $cont.data("initialized", true);
    };

    /**
     * Returns all initialized maps.
     *
     * @return {Map}            Google map
     */
    var getMaps = function() {
        return _maps;
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
        $('[data-spy="gmap"]').each(function() {
            _initMap({
            	name: $(this).attr("data-name"),
                container: this
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
        getMaps: getMaps,
        setDefaults: setDefaults
    };

})(this, document, jQuery, google);
