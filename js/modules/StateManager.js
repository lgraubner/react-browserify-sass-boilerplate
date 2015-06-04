var StateManager = (function(window, document, $, undefined) {
    "use strict";

    var _state = null,
        _breakpoint = null,
        _opts = null,
        $win = $(window);

    // Funktion fuer Mobile
    var _displayMobile = function() {
        if (typeof _opts.mobile === "function") _opts.mobile();
    };

    // Funktion fuer Desktop
    var _displayDesktop = function() {
        if (typeof _opts.desktop === "function") _opts.desktop();
    };

    // Event Listener fuer Window resize
    var _resizeListener = function() {
        if ($win.width() < _breakpoint) {
            if (_state !== "mobile") {
                _state = "mobile";
                _displayMobile();
            }
        } else {
            if (_state !== "desktop") {
                _state = "desktop";
                _displayDesktop();
            }
        }
    };

    // Getter fuer state
    var getState = function() {
        return _state;
    };

    // init Funktion
    // akzeptiert Objekt mit breakpoint (int), mobile (function), desktop (function)
    var init = function(options) {
        _opts = options;
        _breakpoint = _opts.breakpoint || 768;

        _resizeListener();
        $win.on("resize", _resizeListener);
    };

    return {
        init: init,
        getState: getState
    };

})(this, document, jQuery);
