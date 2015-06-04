(function(window, document, $, google, undefined) {
    "use strict";

    var map;

    var initialize = function() {
        var myLatlng = new google.maps.LatLng(-34.397, 150.644),
            /* Drag ausschalten, wenn Mobilgeraet */
            isDraggable = StateManager.getState() == "mobile" ? true : false,
            /* oft benutzte default options*/
            mapOptions = {
                draggable: isDraggable,
                scrollwheel: false,
                disableDefaultUI: false,
                disableDoubleClickZoom: false,
                minZoom: null,
                maxZoom: null,
                zoom: 13,
                center: myLatlng,
            };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        /* Info window für den Marker */
        var infowindow = new google.maps.InfoWindow({
            content: "Info window Inhalt."
        });

        /* Marker auf der Karte */
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: "Hello World!",
            /*icon: '/img/icon.png';*/
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });

        /* Center bei Aenderung der Kartengroesse aktualisieren */
        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });
    };

    /* Karte initialisieren */
    google.maps.event.addDomListener(window, 'load', initialize);
})(this, document, jQuery, google);
