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
                if (StateManager.getState() == "mobile") {
                    e.preventDefault();
                }
            });
        }
    };

    $(function() {
        // fuehrt entsprechende Funktion bei initialisierung und resize aus
        StateManager.init({
            breakpoint: 768,
            mobile: app.displayMobile,
            desktop: app.displayDesktop
        });

        app.init();
    });

})(this, document, jQuery);
