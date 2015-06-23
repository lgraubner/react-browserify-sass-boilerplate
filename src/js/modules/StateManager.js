/**
 * Handles browser states depending on it's width.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 1.1.0
 */

var StateManager = (function(window, document, $, undefined) {
    "use strict";

    var _states = [],
        _activeStates = [],
        $win, removeItem, match, inArray;

    /**
     * Debounce function to delay function calls.
     *
     * @param  {Function} func      function to call
     * @param  {number} wait        delay in milliseconds
     * @param  {boolean} immediate
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
     * Triggers all matching states.
     */
    var _triggerStates = function() {
        $.each(_states, function(key, state) {
            match = _match(state);
            inArray = matchState(state.name);

            if (!inArray && match) {
                if (state.match) state.match.call(window);

                _activeStates.push(state.name);
            } else if (inArray && !match) {
                if (state.unmatch) state.unmatch.call(window);

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
     * @param  {Object} state   state object
     * @return {boolean}        matches
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
     * @param  {string} stateName   name of the state
     * @return {boolean}            matches
     */
    var matchState = function(stateName) {
        return $.inArray(stateName, _activeStates) === -1 ? false : true;
    };

    /**
     * Adds state object to check for matches.
     *
     * @param  {Object} state state object
     */
    var addState = function(state) {
        _states.push(state);
        _triggerStates();
    };

    /**
     * Destroys the StateManager and removes all States and EventListeners.
     */
    var destroy = function() {
        $win.off("resize.sm");
        _states = [];
        _activeStates = [];
    };

    /**
     * Constructor for new StateManager instances.
     *
     * @param  {Array} states   Array of states
     */
    var constructor = function(states) {
        $win = $(window);

        $.each(states, function(key, state) {
            addState(state);
        });

        _triggerStates();

        $win.on("resize.sm", _debounce(_triggerStates, 100));
    };

    constructor.prototype = {
        addState: addState,
        matchState: matchState,
        destroy: destroy
    };

    return constructor;

})(this, document, jQuery);
