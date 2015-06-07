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

        app.init();
    });

})(this, document, jQuery);
