"use strict"

exports.sniff = function() {

    return textTests(scriptTests(metaTests(linkTests(cssTests(jsTests({}))))));

    function cssTests(retval) {

        var tests = {
            "bootstrap": '.navbar-pills, .hero-unit, .carousel-control, [class^="icon-"]:last-child'
        };

        for (var i in tests) if (jQuery(tests[i]).length > 0) retval[i] = "";
        return retval;

    }

    function metaTests(retval) {

        // From https://github.com/nqbao/chromesniffer
        var tests = {
            'generator': {
                "joomla": /joomla!?\s*([\d\.]+)?/i,
                'vbulletin': /vBulletin\s*(.*)/i,
                'wordpress': /WordPress\s*(.*)/i,
                'xoops': /xoops/i,
                'plone': /plone/i,
                'mediawiki': /MediaWiki\s*(.*)/i,
                'cms-made-simple': /CMS Made Simple/i,
                'silverstripe': /SilverStripe/i,
                'movabletype': /Movable Type/i,
                'amiro-cms': /Amiro/i,
                'bbpress': /bbPress/i,
                'dokuwiki': /dokuWiki/i,
                'typo3': /TYPO3/i,
                'phpnuke': /PHP-Nuke/i,
                'dotnetnuke': /DotNetNuke/i,
                'sitefinity': /Sitefinity\s+(.*)/i,
                'webgui': /WebGUI/i,
                'ez publish': /eZ\s*Publish/i,
                'bigace': /BIGACE/i,
                'typepad': /typepad\.com/i,
                'blogger': /blogger/i,
                'prestashop': /PrestaShop/i,
                'sharepoint': /SharePoint/,
                'jaliosjcms': /Jalios JCMS/i,
                'zencart': /zen-cart/i,
                'wpml': /WPML/i,
                'pivotx': /PivotX/i,
                'openacs': /OpenACS/i,
                'concrete5': /concrete5 -\s*(.*)$/,
                'getsimple': /GetSimple/,
            },
            'copyright': {
                'phpBB': /phpBB/i
            },
            'elggrelease': {
                'Elgg': /.+/
            },
            'powered-by': {
                'Serendipity': /Serendipity/i
            },
            'author': {
                'Avactis': /Avactis Team/i
            }
        };

        for (var i in tests) {

            for (var j in tests[i]) {

                if (j.toLowerCase() in retval) continue;

                jQuery("meta").each(function(id, elem) {
                
                    elem = jQuery(elem);
                    var content = elem.attr("name");
                    if (typeof content !== "undefined") {

                        content = content.toLowerCase();

                        if (content === i) {

                            content = elem.attr("content");
                            var match = tests[i][j].exec(content);
                            if (match !== null) retval[j.toLowerCase()] = "";

                        }
                    }
                });
            }
        }

        return retval;

    }

    function linkTests(retval) {

        var tests = {
            "amazon-s3": /s3.amazonaws.com/i,
            "amazon-cloudfront": /cloudfront.net/i,
            "rackspace-cloudfiles": /cloudfiles.rackspacecloud.com/i,
        };

        function cb(idx, elem) {

            var src = "";
            elem = jQuery(elem);

            if (elem.is("img")) src = elem.attr("src");
            else src = elem.attr("href");

            if (typeof src !== "undefined") {

                src = src.toLowerCase();

                for (var i in tests) {

                    if (i in retval) continue;
                    var match = tests[i].exec(src);
                    if (match !== null) retval[i.toLowerCase()] = "";

                }
            }
        }

        jQuery("img").each(cb);
        jQuery("a, link").each(cb);

        return retval;

    }

    function scriptTests(retval) {

        // Most tests from https://github.com/nqbao/chromesniffer
        var tests = {
            "chartbeat": /static.chartbeat.com\/js\/chartbeat.js/i,
            "innity": /cdn.innity.net\/admanager.js/i,
            "comscore": /scorecardresearch.com\/beacon.js/i,
            "_gaq": /google-analytics.com\/(ga|urchin).js/i,
            "quantcast": /quantserve\.com\/quant\.js/i,
            "prototype": /prototype\.js/i,
            "joomla": /\/components\/com_/,
            "ubercart": /uc_cart/i,
            "closure": /\/goog\/base\.js/i,
            "modx": /\/min\/b=.*f=.*/,
            "mootools": /mootools/i,
            "dojo": /dojo(\.xd)?\.js/i,
            "scriptaculous": /scriptaculous\.js/i,
            "disqus": /disqus.com/i,
            'getsatisfaction': /getsatisfaction\.com\/feedback/i,
            'wibiya': /wibiya\.com\/Loaders\//i,
            'recaptcha': /(google\.com\/recaptcha|api\.recaptcha\.net\/)/i,
            'mollom': /mollom\/mollom\.js/i,
            'zenphoto': /zp-core\/js/i,
            'gallery': /main\.php\?.*g2_.*/i,
            'adsense': /pagead\/show_ads\.js/,
            'xenforo': /js\/xenforo\//i,
            'cappuccino': /Frameworks\/Objective-J\/Objective-J\.js/,
            'avactis': /\/avactis-themes\//i,
            'volusion': /a\/j\/javascripts\.js/,
            'addthis': /addthis\.com\/js/,
            'buysellads': /buysellads.com\/.*bsa\.js/,
            'weebly': /weebly\.com\/weebly\//,
            'bootstrap': /bootstrap-.*\.js/,
            'jigsy': /javascripts\/asterion\.js/,
            'yola': /analytics\.yola\.net/,
            'alfresco': /(alfresco)+(-min)?(\/scripts\/menu)?\.js/
        };

        jQuery("script").each(function(idx, elem) {

            var src = jQuery(elem).attr("src");
            if (typeof src !== "undefined") {

                src = src.toLowerCase();

                for (var i in tests) {

                    if (i in retval) continue;
                    var match = tests[i].exec(src);
                    if (match !== null) retval[i.toLowerCase()] = "";

                }
            }
        });

        return retval;

    }

    function textTests(retval) {

        // From https://github.com/nqbao/chromesniffer
        var tests = {
            'smf': /<script .+\s+var smf_/i,
            'magento': /var BLANK_URL = '[^>]+js\/blank\.html'/i,
            'tumblr': /<iframe src=("|')http:\/\/\S+\.tumblr\.com/i,
            'wordpress': /<link rel=("|')stylesheet("|') [^>]+wp-content/i,
            'closure': /<script[^>]*>.*goog\.require/i,
            'liferay': /<script[^>]*>.*LifeRay\.currentURL/i,
            'vbulletin': /vbmenu_control/i,
            'modx': /(<a[^>]+>Powered by MODx<\/a>|var el= \$\('modxhost'\);|<script type=("|')text\/javascript("|')>var MODX_MEDIA_PATH = "media";)/i,
            'minibb': /<a href=("|')[^>]+minibb.+\s*<!--End of copyright link/i,
            'phpfusion': /(href|src)=["']?infusions\//i,
            'openx': /(href|src)=["'].*delivery\/(afr|ajs|avw|ck)\.php[^"']*/,
            'getsatisfaction': /asset_host\s*\+\s*"javascripts\/feedback.*\.js/igm, // better recognization
            'contao': /powered by (TYPOlight|Contao)/i,
            'moodle' : /<link[^>]*\/theme\/standard\/styles.php".*>|<link[^>]*\/theme\/styles.php\?theme=.*".*>/,
            'opencms' : /<link[^>]*\.opencms\..*?>/i,
            'humanstxt': /<link[^>]*rel=['"]?author['"]?/i,
            "webfonts": /ref=["']?http:\/\/fonts.googleapis.com\//i,
            'prostores' : /-legacycss\/Asset">/,
            "oscommerce": /(product_info\.php\?products_id|_eof \/\/-->)/,
            "opencart": /index.php\?route=product\/product/,
            "shibboleth": /<form action="\/idp\/Authn\/UserPassword" method="post">/
        };

        var content = jQuery("html").html();

        for (var i in tests) {

            if (i in retval) continue;
            var match = tests[i].exec(content);
            if (match !== null) retval[i.toLowerCase()] = "";

        }

        return retval;
    }

    function jsTests(retval) {

        var v = {

            "_": function() { return window._.VERSION },
            "_gaq": function() { return "" },
            "angular": function() { return window.angular.version.full },
            "Backbone": function() { return window.Backbone.VERSION },
            "Batman": function() { return window.Batman.version },
            "brightcove": function() { return "" },
            "can": function() { return "" },
            "Cufon": function() { return "" },
            "d3": function() { return window.d3.version },
            "dojo": function() { return window.dojo.version.toString() },
            "Drupal": function() { return "" },
            "Ember": function() { return window.Ember.VERSION },
            "enyo": function() { return "" },
            "Ext": function() { return window.Ext.version },
            "facebox": function() { return "" },
            "fancybox": function() { return "" },
            "FB": function() { return "" },
            "flowplayer": function() { return "" },
            "google.load": function() { return "" },
            "google.maps": function() { return window.google.maps.version },
            "Handlebars": function() { return window.Handlebars.VERSION },
            "Highcharts": function() { return window.Highcharts.version },
            "io": function() { return window.io.version },
            "jQuery": function() { return window.jQuery.fn.jquery },
            "jQuery.ui": function() { return window.jQuery.ui.version },
            "ko": function() { return window.ko.version },
            "Meteor": function() { return "" },
            "MochiKit": function() { return window.MochiKit.Base.VERSION },
            "Modernizr": function() { return window.Modernizr._version },
            "MooTools": function() { return window.MooTools.version },
            "nivoSlider": function() { return "" },
            "PDFJS": function() { return window.PDFJS.version },
            "Processing": function() { return window.Processing.version },
            "Prototype": function() { return window.Prototype.Version },
            "Raphael": function() { return window.Raphael.version },
            "requirejs": function() { return window.requirejs.version },
            "s.t": function() { return "" },
            "sIFR": function() { return "" },
            "Scriptaculous": function() { return window.Scriptaculous.Version },
            "scrollTo": function() { return "" },
            "Spine": function() { return window.Spine.version },
            "SproutCore": function() { return "" },
            "superfish": function() { return "" },
            "swfobject": function() { return "" },
            "turn": function() { return "" },
            "twttr": function() { return "" },
            "Typekit": function() { return "" },
            "webfonts": function() { return "" },
            "YUI": function() { return window.YUI().version },
            "Zepto": function() { return "" }

        };

        var objs = ["_gaq", "angular", "Backbone", "brightcove", "can", "d3", "dojo", "Drupal", "Ember", "Ext", "FB",
            "google.maps", "Handlebars", "Highcharts", "ko", "io", "Meteor", "MochiKit", "Modernizr", "MooTools", "PDFJS",
            "Prototype", "jQuery.ui", "Scriptaculous", "sIFR", "Spine", "SproutCore", "swfobject", "twttr", "Typekit"],
            funs = ["_", "Batman", "Cufon", "google.load", "jQuery", "Processing", "Raphael", "requirejs", "s.t", "webfonts",
            "YUI", "Zepto"],
            jqPlugins = ["facebox", "fancybox", "flowplayer", "nivoSlider", "scrollTo", "superfish", "turn"];

        for (var i in objs) {

            if (objs.hasOwnProperty(i) === false) continue;

            if (objs[i].indexOf(".") >= 0) {

                var splits = objs[i].split(".");
                if (typeof window[splits[0]] !== "undefined" && typeof window[splits[0]][splits[1]] === "object")
                    retval[objs[i]] = v[objs[i]]();

            } else if (typeof window[objs[i]] === "object") retval[objs[i].toLowerCase()] = v[objs[i]]();

        }

        for (var i in funs) {
            
            if (funs.hasOwnProperty(i) === false) continue;

            if (funs[i].indexOf(".") >= 0) {

                var splits = funs[i].split(".");
                if (typeof window[splits[0]] !== "undefined" && typeof window[splits[0]][splits[1]] === "function")
                    retval[funs[i]] = v[funs[i]]();

            } else if (typeof window[funs[i]] === "function") retval[funs[i].toLowerCase()] = v[funs[i]]();

        }

        if (typeof window["jQuery"] === "function") for (var i in jqPlugins)
                if (typeof window["jQuery"]["fn"][jqPlugins[i]] === "function")
                    retval[jqPlugins[i].toLowerCase()] = v[jqPlugins[i]]();

        return retval;

    }

}
