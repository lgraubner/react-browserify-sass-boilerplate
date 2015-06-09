(function(window, document, $, undefined) {
    "use strict";

    var app = {

        // Funktionen fuer Mobile
        displayMobile: function() {

        },

        // Functionen fuer Desktop
        displayDesktop: function() {

        },

        // Funktionen fuer Mobile und Desktop (!)
        init: function() {
            $('a[href^="tel:"]').click(function(e) {
                if (!StateManager.matchState("mobile")) {
                    e.preventDefault();
                }
            });
        }
    };

    $(function() {
        // fuehrt entsprechende Funktion bei initialisierung und resize aus
        StateManager.addState({
            name: "mobile",
            maxWidth: 768,
            match: app.displayMobile
        });

        StateManager.addState({
            name: "desktop",
            minWidth: 769,
            match: app.displayDesktop
        });

        StateManager.init();

        GoogleMap.create({
            name: "kontakt",
            coords: "1235,23464",
            options: {
                zoom: 10
            },
            markers: {
                coords: "123543,32646",
                info: "This is the info",
                title: "hello world"
            }
        });

        app.init();
    });

})(this, document, jQuery);
