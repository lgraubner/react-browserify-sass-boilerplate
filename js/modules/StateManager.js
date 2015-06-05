/**
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 0.1.1
 *
 * Handles browser states depending on it's width.
 */

var StateManager = (function(window, document, $, undefined) {
    "use strict";

    var _states = [],
        _activeStates = [],
        $win = $(window),
        removeItem, match, inArray;

    /**
     * Debounce function to delay function calls.
     *
     * @param {func} function to call
     * @param {delay} delay in milliseconds
     * @param {immediate}
     */
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

    /**
     * Listener for window resize event. Checks if any state matches.
     */
    var _resizeListener = function() {
        $.each(_states, function(key, state) {
            match = _match(state);
            inArray = matchState(state.name);

            if (!inArray && match) {
                if (state.match) state.match.call(window);

                _activeStates.push(state.name);
            } else if (inArray && !match) {
                if (state.match) state.unmatch.call(window);

                removeItem = state.name;
                _activeStates = $.grep(_activeStates, function(val) {
                    return val != removeItem;
                });
            }
        });
    };

    /**
     * Checks if given state matches.
     *
     * @param {state} state object
     * @return {boolean}
     */
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

    /**
     * Checks if a state is currently active.
     *
     * @param {stateName} name of the state
     * @return {boolean}
     */
    var matchState = function(stateName) {
        return $.inArray(stateName, _activeStates) === -1 ? false : true;
    };

    /**
     * Adds state object to check for matches.
     *
     * @param {state} state object
     */
    var addState = function(state) {
        _states.push(state);
    };

    /**
     * Init function. Registers resize listener and executes it once.
     */
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
