(function(window, document, $, undefined) {
    "use strict";

    var site = {

        addJSClass: function() {
            if (typeof window.Modernizr === "undefined") {
                $("html").removeClass("no-js").addClass("js");
            }
        },

        init: function() {
            this.addJSClass();
        }
    };

    $(function() {
        site.init();
    });

})(window, document, jQuery);
