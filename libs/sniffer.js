"use strict"

exports.Sniffer = function() {

    var self = this;

    this.getCMS = function() {
        return "abc";
    };

    this.getJSLibraries = function() {

        var versions={};

        // @ref http://angularjs.org
        // @example http://angularjs.org
        versions["angular"] = function() {
            return {
                name: "AngularJS",
                url: "http://angularjs.org/",
                version: window.angular.version.full
            };
        };

        // @ref http://backbonejs.org
        // @example http://backbonejs.org
        versions["Backbone"] = function() {
            return {
                name: "BackboneJS",
                url: "http://backbonejs.org/",
                version: window.Backbone.VERSION
            };
        };

        // @ref http://d3js.org
        // @example http://d3js.org
        versions["d3"] = function() {
            return {
                name: "D3.js",
                url: "http://d3js.org/",
                version: window.d3.version
            };
        };

        // @ref http://dojotoolkit.org
        // @example http://dojotoolkit.org
        versions["dojo"] = function() {
            return {
                name: "Dojo",
                url: "http://dojotoolkit.org/",
                version: window.dojo.version.toString()
            };
        };


        // @ref http://emberjs.com
        // @example http://emberjs.com/examples/todos/
        versions["Ember"] = function() {
            return {
                name: "EmberJS",
                url: "http://emberjs.com/",
                version: window.Ember.VERSION
            };
        };

        // No version for EnyoJS yet
        // @ref http://enyojs.com
        versions["enyo"] = function() {
            return {
                name: "EnyoJS",
                url: "http://enyojs.com/",
                version: ""
            };
        };

        // @ref http://www.sencha.com/products/extjs
        // @example http://www.sencha.com/products/extjs
        versions["Ext"] = function() {
            return {
                name: "ExtJS",
                url: "http://www.sencha.com/products/extjs",
                version: window.Ext.version
            };
        };

        // @ref http://handlebarsjs.com/
        // @example http://tryhandlebarsjs.com/
        versions["Handlebars"] = function() {
            return {
                name: "Handlebars",
                url: "http://handlebarsjs.com/",
                version: window.Handlebars.VERSION
            };
        };

        // @ref http://socket.io/
        // @example http://divergentcoder.com/Chat/
        versions["io"] = function() {
            return {
                name: "Socket.IO",
                url: "http://socket.io/",
                version: window.io.version
            };
        };

        // @ref http://jquery.com
        // @example http://jquery.com
        versions["jQuery"] = function() {
            return {
                name: "jQuery",
                url: "http://jquery.com",
                version: window.jQuery.fn.jquery
            };
        };

        // @ref http://jqueryui.com
        versions["jQuery.ui"] = function() {
            return {
                name: "jQuery UI",
                url: "http://jqueryui.com",
                version: window.jQuery.ui.version
            };
        };

        // @ref http://mochi.github.com/mochikit/
        // @example http://mochi.github.com/mochikit/about.html
        versions["MochiKit"] = function() {
            return {
                name: "MochiKit",
                url: "http://mochi.github.com/mochikit/",
                version: window.MochiKit.Base.VERSION
            };
        };

        // @ref http://modernizr.com
        // @example http://modernizr.com
        versions["Modernizr"] = function() {
            return {
                name: "Modernizr",
                url: "http://modernizr.com",
                version: window.Modernizr._version
            };
        };

        // @ref http://mootools.net
        // @example http://mootools.net
        versions["MooTools"] = function() {
            return {
                name: "MooTools",
                url: "http://mootools.net",
                version: window.MooTools.version
            };
        };

        // @ref https://github.com/mozilla/pdf.js
        // @example http://mozilla.github.com/pdf.js/web/viewer.html
        versions["PDFJS"] = function() {
            return {
                name: "PDF.js",
                url: "https://github.com/mozilla/pdf.js",
                version: window.PDFJS.version
            };
        };

        // @ref http://processingjs.org
        // @example http://processingjs.org
        versions["Processing"] = function() {
            return {
                name: "Processing",
                url: "http://processingjs.org",
                version: window.Processing.version
            };
        };

        // @ref http://prototypejs.org/
        // @example https://www.airasiamegastore.com/
        versions["Prototype"] = function() {
            return {
                name: "Prototype",
                url: "http://prototypejs.org",
                version: window.Prototype.Version
            };
        };

        // @ref http://raphaeljs.com/
        // @example http://raphaeljs.com/
        versions["Raphael"] = function() {
            return {
                name: "Raphaël",
                url: "http://raphaeljs.com",
                version: window.Raphael.version
            };
        };

        // @ref http://requirejs.org/
        // @example http://hallmark.com/
        versions["requirejs"] = function() {
            return {
                name: "RequireJS",
                url: "http://requirejs.org",
                version: window.requirejs.version
            };
        };

        // @ref http://script.aculo.us
        // @example https://www.airasiamegastore.com/
        versions["Scriptaculous"] = function() {
            return {
                name: "Scriptaculous",
                url: "http://script.aculo.us",
                version: window.Scriptaculous.Version
            };
        };

        // @ref http://sproutcore.com
        // @example http://sproutcore.com
        versions["SproutCore"] = function() {
            return {
                name: "SproutCore",
                url: "http://sproutcore.com/",
                version: ""
            };
        };

        // @ref http://code.google.com/p/swfobject/
        // @example http://www.bobbyvandersluis.com/swfobject/testsuite_2_2/test_dynamic.html
        versions["swfobject"] = function() {
            return {
                name: "swfobject",
                url: "http://code.google.com/p/swfobject/",
                version: ""
            };
        };

        // @ref http://yuilibrary.com
        // @example http://yuilibrary.com
        versions["YUI"] = function() {
            return {
                name: "Yahoo! UI Library",
                url: "http://www.yuilibrary.com",
                version: window.YUI().version
            };
        };

        // @ref http://underscorejs.org
        // @example http://underscorejs.org
        versions["_"] = function() {
            return {
                name: "Underscore.JS",
                url: "http://underscorejs.org/",
                version: window._.VERSION
            };
        };

        var retval = [],
            objs = ["angular", "Backbone", "d3", "dojo", "Ember", "Ext", "Handlebars", "io", "MochiKit", "Modernizr", "MooTools", "PDFJS", "Prototype", "jQuery.ui", "Scriptaculous", "SproutCore", "swfobject"],
            funs = ["_", "jQuery", "Processing", "Raphael", "requirejs", "YUI"];

        for (var i in objs) {

            if (objs.hasOwnProperty(i) === false) continue;

            if (objs[i].indexOf(".") >= 0) {

                var splits = objs[i].split(".");
                if (typeof window[splits[0]] !== "undefined" && window[splits[0]][splits[1]] === "object") retval.push(versions[objs[i]]());

            } else if (typeof window[objs[i]] === "object") retval.push(versions[objs[i]]());

        }

        for (var i in funs) {
            
            if (funs.hasOwnProperty(i) === false) continue;

            if (funs[i].indexOf(".") >= 0) {

                var splits = funs[i].split(".");
                if (typeof window[splits[0]] !== "undefined" && window[splits[0]][splits[1]] === "function") retval.push(versions[funs[i]]());

            } else if (typeof window[funs[i]] === "function") retval.push(versions[funs[i]]());

        }

        return retval;

    };

    this.isWordpress = function(page) {

        page.evaluate(function() {

            $("link").forEach(function(idx, elem) {

                if (html.indexOf("wp-content"))  {




                };

            });

        });

    };

    return self;

}
