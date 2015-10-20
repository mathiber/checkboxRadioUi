/**
 * checkboxRadioUI v1.0.0
 * More information visit http://likeclever1.github.io/checkboxRadioUI/
 * Copyright 2015, Yuriy Berezovskiy
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 * 
 * Usages: $(...).checkboxRadioUI();
 * 
 * Options:
 * - label: boolean
 */

"use strict";
;(function($) {
    
    var plugin = {};

    var defaults = {
        'label': null,
        // CALLBACKS
        onChange: function() {}
    }

    $.fn.checkboxRadioUI = function(options) {
        if(this.length == 0) return this;

        if(this.length > 1) {
            this.each(function() {
                $(this).checkboxRadioUI(options);
            });
            return this;
        }

        // create the namespace to be throught the plugin
        var ui = {};
        // set the reference to our ui element
        var el = this,
            $el = $(this);

        ui.el = this.get(0);
        ui.$el = this;

        ui.type = null;
        ui.$group = null;
        ui.$label = null;

        /**
         * ===================================================================================
         * = PRIVATE FUNCTIONS
         * ===================================================================================
         */
        
        /**
         * Initializes namespace settings to be used throughout plugin
         */
        
        var _init = function() {
            // merge user options with defaults
            ui.settings = $.extend({}, defaults, options);
            // set wrapper class
            ui.wrapCheckboxCls = "checkboxUI";
            ui.wrapRadioCls = "radioUI";
            ui.checkedClsuffix = "_checked";
            ui.disabledClsuffix = "_disabled";
            // determine touch events
            ui.touch = ("ontouchstart" in document.documentElement) ? true : false;
            // determine event types
            ui.eventTypes = {
                mousedown: (ui.touch) ? "touchstart" : "mousedown"
            };
            // determine radio or checkbox
            if(ui.el.tagName.toUpperCase() == "INPUT" ) {
                if(ui.el.type.toUpperCase() == "CHECKBOX") {
                    ui.type = "CHECKBOX";
                } else if(ui.el.type.toUpperCase() == "RADIO") {
                    ui.type = "RADIO";
                    ui.$group = $("input[name='" + ui.$el.prop("name") + "']").not(ui.el);
                }
            }
            if(ui.type) {
                _setup();
            }
        };

        /**
         * Performs all DOM and CSS modifications
         */
        
        var _setup = function() {
            // wrap element
            ui.$el.wrap("<span style='display: inline-block; position: relative; overflow:hidden; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none;'>");
            // wrap element
            ui.wrap = ui.$el.parent();

            ui.wrap.addClass(function() {
                return (ui.type == "CHECKBOX") ? ui.wrapCheckboxCls : ui.wrapRadioCls;
            });
            //set wrap needed width and height
            ui.wrap.css({
                "width": ui.settings.width + "px",
                "height": ui.settings.height + "px"
            });
            // add css to element
            ui.$el.css({
                "position": "absolute",
                "left": "-" + 99999 + "px"
            });
            // add wrap disabled cls
            if(ui.$el.is(":disabled")) {
                ui.wrap.addClass(function() {
                    return (ui.type == "CHECKBOX") ? ui.wrapCheckboxCls+ui.disabledClsuffix : ui.wrapRadioCls+ui.disabledClsuffix;
                });
            }
            // add wrap checked cls
            if(ui.$el.is(":checked")) {
                ui.wrap.addClass(function() {
                    return (ui.type == "CHECKBOX") ? ui.wrapCheckboxCls+ui.checkedClsuffix : ui.wrapRadioCls+ui.checkedClsuffix;
                });
            }

            // initialize events
            if(!ui.$el.is(":disabled")) {
                _eventClick();
                if(ui.settings.label) {
                    _eventClickLabel();
                }
            }
        };

        /**
         * Event Methods _eventClick, _eventClickLabel
         */
        
        // method for event click on element
        function _eventClick() {
            ui.wrap.on(ui.eventTypes.mousedown, function(e) {
                _changeControl();
            });
            ui.$el.on('change', function(){
                var disabledCls;
                if (ui.type == 'CHECKBOX') {
                    if (ui.$el.is(':checked')) {
                        ui.wrap.addClass(ui.wrapCheckboxCls + ui.checkedClsuffix);
                    } else {
                        ui.wrap.removeClass(ui.wrapCheckboxCls + ui.checkedClsuffix);
                    }
                    disabledCls = ui.wrapCheckboxCls + ui.disabledClsuffix;
                } else if (ui.type == 'RADIO') { 
                    if (ui.$el.is(':checked')) {
                        ui.$group.parent().removeClass(ui.wrapRadioCls + ui.checkedClsuffix);
                        ui.wrap.addClass(ui.wrapRadioCls + ui.checkedClsuffix);
                    }
                    disabledCls = ui.wrapRadioCls + ui.disabledClsuffix;
                }
                if (ui.$el.is(':disabled')) {
                    ui.wrap.addClass(disabledCls);
                } else {
                    ui.wrap.removeClass(disabledCls);
                }
                if (this === ui.el && ui.settings.onChange) {
                    ui.settings.onChange(ui.el);
                }
            });
        };

        var _eventClickLabel = function() {
            ui.$label = ui.wrap.siblings("label");
            ui.$label.on(ui.eventTypes.mousedown, function(e) {
                _changeControl();
            });
        };

        function _changeControl() {
            if (ui.$el.is(':disabled')) {
                return;
            }
            // ui.wrap toggle checked cls for checkbox
            if(ui.type == "CHECKBOX") {
                ui.$el.prop("checked", !ui.$el.is(':checked')).trigger('change');
            }
            // ui.wrap toggle checked cls for radio
            if(ui.type == "RADIO") {
                ui.$group.prop("checked", false).trigger('change');
                ui.$el.prop("checked", true).trigger('change');
            }
        }

        _init();

        // returns the current jQuery object
        return this;
    };

})(jQuery);