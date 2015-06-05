var StateManager = (function(window, document, $, undefined) {
    "use strict";

    var _states = [],
        _currentStates = [],
        $win = $(window),
        i, removeItem, match, inArray;

    var _debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Event Listener fuer Window resize
    var _resizeListener = function() {
        $.each(_states, function(key, state) {
            match = _match(state);
            inArray = matchState(state.name);

            if (!inArray && match) {
                if (state.match) state.match.call(window);
                _currentStates.push(state.name);
            } else if (inArray && !match) {
                removeItem = state.name;
                _currentStates = $.grep(_currentStates, function(val) {
                    return val != removeItem;
                });
            }
        });
    };

    var _match = function(state) {
        var width = $win.width();
        if (state.minWidth && state.maxWidth) {
            if (width >= state.minWidth && width <= state.maxWidth) {
                return true;
            }
        } else if (state.minWidth && width >= state.minWidth || state.maxWidth && width <= state.maxWidth) {
            return true;
        }

        return false;
    };

    var matchState = function(stateName) {
        return $.inArray(stateName, _currentStates) === -1 ? false : true;
    };

    var addState = function(state) {
        _states.push(state);

    };

    // init Funktion
    var init = function() {
        _resizeListener();

        $win.on("resize", _debounce(_resizeListener, 100));
    };

    return {
        init: init,
        matchState: matchState,
        addState: addState
    };

})(this, document, jQuery);
