/*!
 * jQuery++ - 1.0.1
 * http://jquerypp.com
 * Copyright (c) 2013 Bitovi
 * Fri, 04 Oct 2013 20:31:12 GMT
 * Licensed MIT
 * Download from: http://bitbuilder.herokuapp.com/jquerypp.custom.js?plugins=jquerypp%2Fdom%2Fanimate&plugins=jquerypp%2Fevent%2Fswipe
 */
(function($) {

    // ## jquerypp/dom/styles/styles.js
    var __m3 = (function($) {
        var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
            // The following variables are used to convert camelcased attribute names
            // into dashed names, e.g. borderWidth to border-width
            rupper = /([A-Z])/g,
            rdashAlpha = /-([a-z])/ig,
            fcamelCase = function(all, letter) {
                return letter.toUpperCase();
            },
            // Returns the computed style for an elementn
            getStyle = function(elem) {
                if (getComputedStyle) {
                    return getComputedStyle(elem, null);
                } else if (elem.currentStyle) {
                    return elem.currentStyle;
                }
            },
            // Checks for float px and numeric values
            rfloat = /float/i,
            rnumpx = /^-?\d+(?:px)?$/i,
            rnum = /^-?\d/;

        // Returns a list of styles for a given element
        $.styles = function(el, styles) {
            if (!el) {
                return null;
            }
            var currentS = getStyle(el),
                oldName, val, style = el.style,
                results = {},
                i = 0,
                left, rsLeft, camelCase, name;

            // Go through each style
            for (; i < styles.length; i++) {
                name = styles[i];
                oldName = name.replace(rdashAlpha, fcamelCase);

                if (rfloat.test(name)) {
                    name = $.support.cssFloat ? "float" : "styleFloat";
                    oldName = "cssFloat";
                }

                // If we have getComputedStyle available
                if (getComputedStyle) {
                    // convert camelcased property names to dashed name
                    name = name.replace(rupper, "-$1").toLowerCase();
                    // use getPropertyValue of the current style object
                    val = currentS.getPropertyValue(name);
                    // default opacity is 1
                    if (name === "opacity" && val === "") {
                        val = "1";
                    }
                    results[oldName] = val;
                } else {
                    // Without getComputedStyles
                    camelCase = name.replace(rdashAlpha, fcamelCase);
                    results[oldName] = currentS[name] || currentS[camelCase];

                    // convert to px
                    if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName])) {
                        // Remember the original values
                        left = style.left;
                        rsLeft = el.runtimeStyle.left;

                        // Put in the new values to get a computed value out
                        el.runtimeStyle.left = el.currentStyle.left;
                        style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
                        results[oldName] = style.pixelLeft + "px";

                        // Revert the changed values
                        style.left = left;
                        el.runtimeStyle.left = rsLeft;
                    }

                }
            }

            return results;
        };


        $.fn.styles = function() {
            // Pass the arguments as an array to $.styles
            return $.styles(this[0], $.makeArray(arguments));
        };

        return $;
    })($);

    // ## jquerypp/dom/animate/animate.js
    var __m1 = (function($) {

        // Overwrites `jQuery.fn.animate` to use CSS 3 animations if possible

        var
        // The global animation counter
        animationNum = 0,
            // The stylesheet for our animations
            styleSheet = null,
            // The animation cache
            cache = [],
            // Stores the browser properties like transition end event name and prefix
            browser = null,
            // Store the original $.fn.animate
            oldanimate = $.fn.animate,

            // Return the stylesheet, create it if it doesn't exists
            getStyleSheet = function() {
                if (!styleSheet) {
                    var style = document.createElement('style');
                    style.setAttribute("type", "text/css");
                    style.setAttribute("media", "screen");

                    document.getElementsByTagName('head')[0].appendChild(style);
                    if (!window.createPopup) {
                        style.appendChild(document.createTextNode(''));
                    }

                    styleSheet = style.sheet;
                }

                return styleSheet;
            },

            //removes an animation rule from a sheet
            removeAnimation = function(sheet, name) {
                for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
                    var rule = sheet.cssRules[j];
                    // 7 means the keyframe rule
                    if (rule.type === 7 && rule.name == name) {
                        sheet.deleteRule(j)
                        return;
                    }
                }
            },

            // Returns whether the animation should be passed to the original $.fn.animate.
            passThrough = function(props, ops, easing, callback) {
                var nonElement = !(this[0] && this[0].nodeType),
                    isInline = !nonElement && $(this).css("display") === "inline" && $(this).css("float") === "none",
                    browser = getBrowser();

                for (var name in props) {
                    // jQuery does something with these values
                    if (props[name] == 'show' || props[name] == 'hide' || props[name] == 'toggle'
                        // Arrays for individual easing
                        || $.isArray(props[name])
                        // Negative values not handled the same
                        || props[name] < 0
                        // unit-less value
                        || name == 'zIndex' || name == 'z-index' || name == 'scrollTop' || name == 'scrollLeft') {
                        return true;
                    }
                }

                return props.jquery === true || browser === null || browser.prefix === '-o-' ||
                // Animating empty properties
                $.isEmptyObject(props) ||
                // We can't do custom easing
                (easing || easing && typeof easing == 'string') ||
                // Second parameter is an object - we can only handle primitives
                $.isPlainObject(ops) ||
                // Inline and non elements
                isInline || nonElement;
            },

            // Gets a CSS number (with px added as the default unit if the value is a number)
            cssValue = function(origName, value) {
                if (typeof value === "number" && !$.cssNumber[origName]) {
                    return value += "px";
                }
                return value;
            },

            // Feature detection borrowed by http://modernizr.com/
            getBrowser = function() {
                if (!browser) {
                    var t,
                        el = document.createElement('fakeelement'),
                        transitions = {
                            'transition': {
                                transitionEnd: 'transitionEnd',
                                prefix: ''
                            },
                            //						'MSTransition': {
                            //							transitionEnd : 'msTransitionEnd',
                            //							prefix : '-ms-'
                            //						},
                            'MozTransition': {
                                transitionEnd: 'animationend',
                                prefix: '-moz-'
                            },
                            'WebkitTransition': {
                                transitionEnd: 'webkitAnimationEnd',
                                prefix: '-webkit-'
                            },
                            'OTransition': {
                                transitionEnd: 'oTransitionEnd',
                                prefix: '-o-'
                            }
                        }

                    for (t in transitions) {
                        if (t in el.style) {
                            browser = transitions[t];
                        }
                    }
                }

                return browser;
            },

            // Properties that Firefox can't animate if set to 'auto':
            // https://bugzilla.mozilla.org/show_bug.cgi?id=571344
            // Provides a converter that returns the actual value
            ffProps = {
                top: function(el) {
                    return el.position().top;
                },
                left: function(el) {
                    return el.position().left;
                },
                width: function(el) {
                    return el.width();
                },
                height: function(el) {
                    return el.height();
                },
                fontSize: function(el) {
                    return '1em';
                }
            },

            // Add browser specific prefix
            addPrefix = function(properties) {
                var result = {};
                $.each(properties, function(name, value) {
                    result[getBrowser().prefix + name] = value;
                });
                return result;
            },

            // Returns the animation name for a given style. It either uses a cached
            // version or adds it to the stylesheet, removing the oldest style if the
            // cache has reached a certain size.
            getAnimation = function(style) {
                var sheet, name, last;

                // Look up the cached style, set it to that name and reset age if found
                // increment the age for any other animation
                $.each(cache, function(i, animation) {
                    if (style === animation.style) {
                        name = animation.name;
                        animation.age = 0;
                    } else {
                        animation.age += 1;
                    }
                });

                if (!name) { // Add a new style
                    sheet = getStyleSheet();
                    name = "jquerypp_animation_" + (animationNum++);
                    // get the last sheet and insert this rule into it
                    sheet.insertRule("@" + getBrowser().prefix + "keyframes " + name + ' ' + style, (sheet.cssRules && sheet.cssRules.length) || 0);
                    cache.push({
                            name: name,
                            style: style,
                            age: 0
                        });

                    // Sort the cache by age
                    cache.sort(function(first, second) {
                        return first.age - second.age;
                    });

                    // Remove the last (oldest) item from the cache if it has more than 20 items
                    if (cache.length > 20) {
                        last = cache.pop();
                        removeAnimation(sheet, last.name);
                    }
                }

                return name;
            };


        $.fn.animate = function(props, speed, easing, callback) {
            //default to normal animations if browser doesn't support them
            if (passThrough.apply(this, arguments)) {
                return oldanimate.apply(this, arguments);
            }

            var optall = $.speed(speed, easing, callback),
                overflow = [];

            // if we are animating height and width properties, set overflow to hidden, and save
            // the previous overflow information to replace with when done.
            if ("height" in props || "width" in props) {
                overflow = [this[0].style.overflow, this[0].style.overflowX, this[0].style.overflowY];
                this.css('overflow', 'hidden');
            }

            // Add everything to the animation queue
            this.queue(optall.queue, function(done) {
                var
                //current CSS values
                current,
                    // The list of properties passed
                    properties = [],
                    to = "",
                    prop,
                    self = $(this),
                    duration = optall.duration,
                    //the animation keyframe name
                    animationName,
                    // The key used to store the animation hook
                    dataKey,
                    //the text for the keyframe
                    style = "{ from {",
                    // The animation end event handler.
                    // Will be called both on animation end and after calling .stop()
                    animationEnd = function(currentCSS, exec) {
                        // As long as we don't stop mid animation, then we will replace
                        // the overflow values of the element being animated.
                        if (!exec) {
                            self[0].style.overflow = overflow[0];
                            self[0].style.overflowX = overflow[1];
                            self[0].style.overflowY = overflow[2];
                        } else {
                            self.css('overflow', '');
                        }

                        self.css(currentCSS);

                        self.css(addPrefix({
                                    "animation-duration": "",
                                    "animation-name": "",
                                    "animation-fill-mode": "",
                                    "animation-play-state": ""
                                }));

                        // Call the original callback
                        if ($.isFunction(optall.old) && exec) {
                            // Call success, pass the DOM element as the this reference
                            optall.old.call(self[0], true)
                        }

                        $.removeData(self, dataKey, true);
                    },
                    finishAnimation = function() {
                        // Call animationEnd using the passed properties
                        animationEnd(props, true);
                        done();
                    };

                for (prop in props) {
                    properties.push(prop);
                }

                if (getBrowser().prefix === '-moz-') {
                    // Normalize 'auto' properties in FF
                    $.each(properties, function(i, prop) {
                        var converter = ffProps[$.camelCase(prop)];
                        if (converter && self.css(prop) == 'auto') {
                            self.css(prop, converter(self));
                        }
                    });
                }

                // Use $.styles
                current = self.styles.apply(self, properties);
                $.each(properties, function(i, cur) {
                    // Convert a camelcased property name
                    var name = cur.replace(/([A-Z]|^ms)/g, "-$1").toLowerCase();
                    style += name + " : " + cssValue(cur, current[cur]) + "; ";
                    to += name + " : " + cssValue(cur, props[cur]) + "; ";
                });

                style += "} to {" + to + " }}";

                animationName = getAnimation(style);
                dataKey = animationName + '.run';

                // Add a hook which will be called when the animation stops
                $._data(this, dataKey, {
                        stop: function(gotoEnd) {
                            // Pause the animation
                            self.css(addPrefix({
                                        'animation-play-state': 'paused'
                                    }));
                            // Unbind the animation end handler
                            self.off(getBrowser().transitionEnd, finishAnimation);
                            if (!gotoEnd) {
                                // We were told not to finish the animation
                                // Call animationEnd but set the CSS to the current computed style
                                animationEnd(self.styles.apply(self, properties), false);
                            } else {
                                // Finish animaion
                                animationEnd(props, true);
                            }
                        }
                    });

                // set this element to point to that animation
                self.css(addPrefix({
                            "animation-duration": duration + "ms",
                            "animation-name": animationName,
                            "animation-fill-mode": "forwards"
                        }));

                // Attach the transition end event handler to run only once
                self.one(getBrowser().transitionEnd, finishAnimation);

            });

            return this;
        };

        return $;
    })($, __m3);

    // ## jquerypp/event/livehack/livehack.js
    var __m5 = (function($) {

        var event = $.event,

            //helper that finds handlers by type and calls back a function, this is basically handle
            // events - the events object
            // types - an array of event types to look for
            // callback(type, handlerFunc, selector) - a callback
            // selector - an optional selector to filter with, if there, matches by selector
            //     if null, matches anything, otherwise, matches with no selector
            findHelper = function(events, types, callback, selector) {
                var t, type, typeHandlers, all, h, handle,
                    namespaces, namespace,
                    match;
                for (t = 0; t < types.length; t++) {
                    type = types[t];
                    all = type.indexOf(".") < 0;
                    if (!all) {
                        namespaces = type.split(".");
                        type = namespaces.shift();
                        namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
                    }
                    typeHandlers = (events[type] || []).slice(0);

                    for (h = 0; h < typeHandlers.length; h++) {
                        handle = typeHandlers[h];

                        match = (all || namespace.test(handle.namespace));

                        if (match) {
                            if (selector) {
                                if (handle.selector === selector) {
                                    callback(type, handle.origHandler || handle.handler);
                                }
                            } else if (selector === null) {
                                callback(type, handle.origHandler || handle.handler, handle.selector);
                            } else if (!handle.selector) {
                                callback(type, handle.origHandler || handle.handler);

                            }
                        }


                    }
                }
            };


        event.find = function(el, types, selector) {
            var events = ($._data(el) || {}).events,
                handlers = [],
                t, liver, live;

            if (!events) {
                return handlers;
            }
            findHelper(events, types, function(type, handler) {
                handlers.push(handler);
            }, selector);
            return handlers;
        };

        event.findBySelector = function(el, types) {
            var events = $._data(el).events,
                selectors = {},
                //adds a handler for a given selector and event
                add = function(selector, event, handler) {
                    var select = selectors[selector] || (selectors[selector] = {}),
                        events = select[event] || (select[event] = []);
                    events.push(handler);
                };

            if (!events) {
                return selectors;
            }
            //first check live:

            //then check straight binds
            findHelper(events, types, function(type, handler, selector) {
                add(selector || "", type, handler);
            }, null);

            return selectors;
        };
        event.supportTouch = "ontouchend" in document;

        $.fn.respondsTo = function(events) {
            if (!this.length) {
                return false;
            } else {
                //add default ?
                return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
            }
        };
        $.fn.triggerHandled = function(event, data) {
            event = (typeof event == "string" ? $.Event(event) : event);
            this.trigger(event, data);
            return event.handled;
        };

        event.setupHelper = function(types, startingEvent, onFirst) {
            if (!onFirst) {
                onFirst = startingEvent;
                startingEvent = null;
            }
            var add = function(handleObj) {
                var bySelector,
                    selector = handleObj.selector || "",
                    namespace = handleObj.namespace ? '.' + handleObj.namespace : '';

                if (selector) {
                    bySelector = event.find(this, types, selector);
                    if (!bySelector.length) {
                        $(this).delegate(selector, startingEvent + namespace, onFirst);
                    }
                } else {
                    //var bySelector = event.find(this, types, selector);
                    if (!event.find(this, types, selector).length) {
                        event.add(this, startingEvent + namespace, onFirst, {
                                selector: selector,
                                delegate: this
                            });
                    }

                }

            },
                remove = function(handleObj) {
                    var bySelector, selector = handleObj.selector || "";
                    if (selector) {
                        bySelector = event.find(this, types, selector);
                        if (!bySelector.length) {
                            $(this).undelegate(selector, startingEvent, onFirst);
                        }
                    } else {
                        if (!event.find(this, types, selector).length) {
                            event.remove(this, startingEvent, onFirst, {
                                    selector: selector,
                                    delegate: this
                                });
                        }
                    }
                };
            $.each(types, function() {
                event.special[this] = {
                    add: add,
                    remove: remove,
                    setup: function() {},
                    teardown: function() {}
                };
            });
        };

        return $;
    })($);

    // ## jquerypp/event/swipe/swipe.js
    var __m4 = (function($) {
        var isPhantom = /Phantom/.test(navigator.userAgent),
            supportTouch = !isPhantom && "ontouchend" in document,
            scrollEvent = "touchmove scroll",
            // Use touch events or map it to mouse events
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
            data = function(event) {
                var d = event.originalEvent.touches ?
                    event.originalEvent.touches[0] :
                    event;
                return {
                    time: (new Date).getTime(),
                    coords: [d.clientX, d.clientY],
                    origin: $(event.target)
                };
            };

        var swipe = $.event.swipe = {

            delay: 500,

            max: 320,

            min: 30
        };

        $.event.setupHelper([

                "swipe",

                'swipeleft',

                'swiperight',

                'swipeup',

                'swipedown'
            ], touchStartEvent, function(ev) {
                var
                // update with data when the event was started
                start = data(ev),
                    stop,
                    delegate = ev.delegateTarget || ev.currentTarget,
                    selector = ev.handleObj.selector,
                    entered = this;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    // update stop with the data from the current event
                    stop = data(event);

                    // prevent scrolling
                    if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
                        event.preventDefault();
                    }
                };

                // Attach to the touch move events
                $(document.documentElement).bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function(event) {
                        $(this).unbind(touchMoveEvent, moveHandler);
                        // if start and stop contain data figure out if we have a swipe event
                        if (start && stop) {
                            // calculate the distance between start and stop data
                            var deltaX = Math.abs(start.coords[0] - stop.coords[0]),
                                deltaY = Math.abs(start.coords[1] - stop.coords[1]),
                                distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                            // check if the delay and distance are matched
                            if (stop.time - start.time < swipe.delay && distance >= swipe.min && distance <= swipe.max) {
                                var events = ['swipe'];
                                // check if we moved horizontally
                                if (deltaX >= swipe.min && deltaY < swipe.min) {
                                    // based on the x coordinate check if we moved left or right
                                    events.push(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
                                } else
                                // check if we moved vertically
                                if (deltaY >= swipe.min && deltaX < swipe.min) {
                                    // based on the y coordinate check if we moved up or down
                                    events.push(start.coords[1] < stop.coords[1] ? "swipedown" : "swipeup");
                                }

                                // trigger swipe events on this guy
                                $.each($.event.find(delegate, events, selector), function() {
                                    this.call(entered, ev, {
                                            start: start,
                                            end: stop
                                        })
                                })

                            }
                        }
                        // reset start and stop
                        start = stop = undefined;
                    })
            });

        return $;
    })($, __m5);
})(jQuery);