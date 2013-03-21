/*

webutil 1.0.1

Copyright (c) 2012-2013 Ditesh Shashikant Gathani

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict"

exports.data = {

    // @ref http://underscorejs.org
    // @example http://underscorejs.org
    "_": {
        name: "Underscore.JS",
        url: "http://underscorejs.org/",
        type: "js-library"
    },

    // @ref http://www.google.com/analytics/
    // @example http://koolred.com
    "_gaq": {
        name: "Google Analytics",
        url: "http://www.google.com/analytics/",
        type: "analytics"
    },

    // @ref https://www.google.com/adsense/
    // @example https://www.google.com/adsense/
    "adsense": {
        name: "Google AdSense",
        url: "https://www.google.com/adsense/",
        type: "advertising"
    },
 
    // @ref http://www.addthis.com/
    // @example http://www.addthis.com/
    "addthis": {
        name: "AddThis",
        url: "http://www.addthis.com/",
        type: "biz-library"
    },

    // @ref http://www.alfresco.com/
    "alfresco": {
        name: "Alfresco",
        url: "http://www.alfresco.com/",
        type: "document-management"
    },

    // @ref http://aws.amazon.com/cloudfront/
    // @example https://touch.tunelabs.asia/
    "amazon-cloudfront": {
        name: "Amazon AWS CloudFront",
        url: "http://aws.amazon.com/cloudfront/",
        type: "cloud"
    },

    // @ref http://aws.amazon.com/s3/
    // @example https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#wiki-webpage-frameUrl
    "amazon-s3": {
        name: "Amazon AWS S3",
        url: "http://aws.amazon.com/s3/",
        type: "cloud"
    },

    // @ref http://www.amirocms.com/
    "amiro-cms": {
        name: "Amiro.CMS",
        url: "http://www.amirocms.com/",
        type: "cms"
    },

    // @ref http://angularjs.org
    // @example http://angularjs.org
    "angular": {
        name: "AngularJS",
        url: "http://angularjs.org/",
        type: "js-library"
    },

    // @ref http://www.avactis.com/
    "avactis": {
        name: "Avactis",
        url: "http://www.avactis.com/",
        type: "e-commerce"
    },

    // @ref http://backbonejs.org
    // @example http://backbonejs.org
    "backbone": {
        name: "BackboneJS",
        url: "http://backbonejs.org/",
        type: "js-library"
    },

    // @ref http://batmanjs.org
    // @example http://batmanjs.org/examples/hello.html#!/404
    "batman": {
        name: "batman.js",
        url: "http://batmanjs.org/",
        type: "js-library"
    },

    // @ref http://bbpress.org/
    // @example http://bbpress.org/forums/
    "bbpress": {
        name: "bbPress",
        url: "http://bbpress.org/",
        type: "forum"
    },

    // @ref http://www.bigace.de/
    // @example http://www.bigace.de/
    "bigace": {
        name: "BIGACE",
        url: "http://www.bigace.de/",
        type: "cms"
    },

    // @ref http://www.blogger.com/
    // @example http://buzz.blogger.com/
    "blogger": {
        name: "Blogger",
        url: "http://www.blogger.com/",
        type: "cms"
    },

    // @ref http://www.brightcove.com/en/
    // @example http://www.brightcove.com/en/
    "brightcove": {
        name: "Brightcove",
        url: "http://www.brightcove.com/en/",
        type: "biz-library"
    },

    // @ref http://twitter.github.com/bootstrap/
    // @example http://twitter.github.com/bootstrap/
    "bootstrap": {
        name: "Bootstrap",
        url: "http://twitter.github.com/bootstrap/",
        type: "front-end-library"
    },

    // @ref http://buysellads.com/
    "buysellads": {
        name: "BuySellAds",
        url: "http://buysellads.com/",
        type: "advertising"
    },

    // @ref http://canjs.us/
    // @example http://canjs.us/
    "can": {
        name: "CanJS",
        url: "http://canjs.us/",
        type: "js-library"
    },

    // @ref http://www.cappuccino-project.org/
    "cappucino": {
        name: "Cappucino",
        url: "http://www.cappuccino-project.org/",
        type: "framework"
    },

    // @ref http://chartbeat.com/
    // @example http://themalaysianinsider.com
    "chartbeat": {
        name: "Chartbeat",
        url: "http://chartbeat.com/",
        type: "analytics"
    },

    // @ref https://developers.google.com/closure/library/
    "closure": {
        name: "Closure Tools",
        url: "https://developers.google.com/closure/library/",
        type: "js-library"
    },

    // @ref http://www.cmsmadesimple.org/
    // @example http://www.cmsmadesimple.org/
    "cms-made-simple": {
        name: "CMS Made Simple",
        url: "http://www.cmsmadesimple.org/",
        type: "cms"
    },

    // @ref http://www.comscore.com/
    // @example http://themalaysianinsider.com/
    "comscore": {
        name: "comScore",
        url: "http://www.comscore.com/",
        type: "biz-library"
    },

    // @ref http://www.concrete5.org/
    // @example http://www.concrete5.org/
    "concrete5": {
        name: "concrete5",
        url: "http://www.concrete5.org/",
        type: "cms"
    },

    // @ref https://contao.org/en/
    "contao": {
        name: "Contao",
        url: "https://contao.org/en/",
        type: "cms"
    },

    // @ref http://cufon.shoqolate.com/generate/
    // @example http://cufon.shoqolate.com/generate/
    "cufon": {
        name: "Cufon",
        url: "http://cufon.shoqolate.com/generate/",
        type: "font-library"
    },

    // @ref http://d3js.org
    // @example http://d3js.org
    "d3": {
        name: "D3.js",
        url: "http://d3js.org/",
        type: "visualization-library"
    },

    // @ref http://disqus.com/
    // @example http://thenextweb.com/microsoft/2013/03/04/blurred-navision-microsoft-may-owe-denmark-more-than-1-billion-in-monster-tax-case/?fromcat=all
    "disqus": {
        name: "Disqus",
        url: "http://disqus.com/",
        type: "commenting"
    },

    // @ref http://docuwiki.net/index.php?title=Main_Page
    // @example http://docuwiki.net/index.php?title=Main_Page
    "docuwiki": {
        name: "DocuWiki",
        url: "http://docuwiki.net/index.php?title=Main_Page",
        type: "wiki"
    },

    // @ref http://dojotoolkit.org
    // @example http://dojotoolkit.org
    "dojo": {
        name: "Dojo",
        url: "http://dojotoolkit.org/",
        type: "js-library"
    },

    // @ref http://www.dotnetnuke.com/
    "dotnetnuke": {
        name: "DotNetNuke",
        url: "http://www.dotnetnuke.com/",
        type: "cms"
    },

    // @ref http://drupal.org
    // @example http://drupal.org
    "drupal": {
        name: "Drupal",
        url: "http://drupal.org/",
        type: "cms"
    },

    // @ref http://www.elgg.org/
    // @example http://community.brighton.ac.uk/
    "elgg": {
        name: "Elgg",
        url: "http://www.elgg.org/",
        type: "social-network"
    },

    // @ref http://emberjs.com
    // @example http://emberjs.com/examples/todos/
    "ember": {
        name: "EmberJS",
        url: "http://emberjs.com/",
        type: "js-library"
    },

    // No version for EnyoJS yet
    // @ref http://enyojs.com
    "enyo": {
        name: "EnyoJS",
        url: "http://enyojs.com/",
        type: "js-library"
    },

    // @ref http://www.sencha.com/products/extjs
    // @example http://www.sencha.com/products/extjs
    "ext": {
        name: "ExtJS",
        url: "http://www.sencha.com/products/extjs",
        type: "js-library"
    },

    // @ref http://ez.no/
    // @example http://ez.no/
    "eZ Publish": {
        name: "eZ Publish",
        url: "http://ez.no/",
        type: "cms"
    },

    // @ref http://defunkt.io/facebox/
    // @example http://defunkt.io/facebox/
    "facebox": {
        name: "jQuery Facebox plugin",
        url: "http://defunkt.io/facebox/",
        type: "js-library"
    },

    // @ref http://fancybox.net/
    // @example http://fancybox.net/
    "fancybox": {
        name: "jQuery Fancybox plugin",
        url: "http://fancybox.net/",
        type: "js-library"
    },

    // @ref https://dev.twitter.com/docs
    // @example http://www.koolred.com
    "fb": {
        name: "Facebook Widgets",
        url: "https://developers.facebook.com/",
        type: "social-networking"
    },

    // @ref https://dev.twitter.com/docs
    // @example http://www.koolred.com
    "flowplayer": {
        name: "jQuery Flowplayer plugin",
        url: "https://flowplayer.org/",
        type: "js-library"
    },

    // @ref http://galleryproject.org/
    // @example http://journal.55-millimetres.net/gallery
    "gallery": {
        name: "Gallery",
        url: "http://galleryproject.org/",
        type: "visualization-library"
    },

    // @ref https://getsatisfaction.com/
    "getsatisfaction": {
        name: "GetSatisfaction",
        url: "https://getsatisfaction.com/",
        type: "customer-support"
    },

    // @ref http://get-simple.info/
    // @example http://get-simple.info/
    "getsimple": {
        name: "GetSimple",
        url: "http://get-simple.info/",
        type: "cms"
    },

    // @ref https://developers.google.com/loader/
    // @example https://developers.google.com/loader/
    "google.load": {
        name: "Google Loader",
        url: "https://developers.google.com/loader/",
        type: "js-library"
    },

    // @ref https://developers.google.com/maps/
    // @example http://www.w3schools.com/googleAPI/default.asp
    "google.maps": {
        name: "Google Maps",
        url: "https://developers.google.com/maps/",
        type: "unknown"
    },

    // @ref http://handlebarsjs.com/
    // @example http://tryhandlebarsjs.com/
    "handlebars": {
        name: "Handlebars",
        url: "http://handlebarsjs.com/",
        type: "js-library"
    },

    // @ref http://highcharts.com/
    // @example http://www.highcharts.com/demo/
    "highcharts": {
        name: "Highcharts",
        url: "http://highcharts.com/",
        type: "visualization-library"
    },

    // @ref http://humanstxt.org/
    // @example http://humanstxt.org/
    "humanstxt": {
        name: "humans.txt",
        url: "http://humanstxt.org/",
        type: "unknown"
    },

    // @ref http://www.innity.com
    // @example http://themalaysianinsider.com
    "innity": {
        name: "Innity",
        url: "http://www.innity.com/",
        type: "online-marketing"
    },

    // @ref http://socket.io/
    // @example http://divergentcoder.com/Chat/
    "io": {
        name: "Socket.IO",
        url: "http://socket.io/",
        type: "js-library"
    },

    // @ref http://www.jalios.com/jcms/jc_5056/home
    "jaliosjcms": {
        name: "Jalios JCMS",
        url: "http://www.jalios.com/jcms/jc_5056/home",
        type: "cms"
    },

    // @ref http://jigsy.com/
    "jigsy": {
        name: "Jigsy",
        url: "http://jigsy.com/",
        type: "cms"
    },

    // @ref http://www.joomla.org
    // @example http://www.joomla.org
    "joomla": {
        name: "Joomla!",
        url: "http://www.joomla.org",
        type: "cms"
    },

    // @ref http://jquery.com
    // @example http://jquery.com
    "jquery": {
        name: "jQuery",
        url: "http://jquery.com",
        type: "js-library"
    },

    // @ref http://jqueryui.com
    // @example http://www.koolred.com
    "jquery.ui": {
        name: "jQuery UI",
        url: "http://jqueryui.com",
        type: "js-library"
    },

    // @ref http://knockoutjs.com
    // @example http://knockoutjs.com/examples/
    "ko": {
        name: "Knockout",
        url: "http://knockoutjs.com",
        type: "js-library"
    },

    // @ref http://www.liferay.com/
    "liferay": {
        name: "Liferay",
        url: "http://www.liferay.com/",
        type: "cms"
    },

    // @ref http://www.magentocommerce.com/
    // @example https://www.airasiamegastore.com
    "magento": {
        name: "Magento Commerce",
        url: "http://www.magentocommerce.com/",
        type: "e-commerce"
    },

    // @ref http://www.mediawiki.org/wiki/MediaWiki
    // @example http://www.mediawiki.org/wiki/MediaWiki
    "mediawiki": {
        name: "MediaWiki",
        url: "http://www.mediawiki.org/wiki/MediaWiki",
        type: "wiki"
    },

    // @ref http://www.meteor.com/
    // @example http://www.meteor.com/examples/leaderboard
    "meteor": {
        name: "Meteor",
        url: "http://www.meteor.com",
        type: "js-library"
    },

    // @ref http://www.minibb.com/
    // @example http://minibb.org/minibb-test.php?
    "minibb": {
        name: "MiniBB",
        url: "http://www.minibb.com/",
        type: "forum"
    },

    // @ref http://mochi.github.com/mochikit/
    // @example http://mochi.github.com/mochikit/about.html
    "mochikit": {
        name: "MochiKit",
        url: "http://mochi.github.com/mochikit/",
        type: "js-library"
    },

    // @ref http://modernizr.com
    // @example http://modernizr.com
    "modernizr": {
        name: "Modernizr",
        url: "http://modernizr.com",
    },

    // @ref http://modx.com/
    "modx": {
        name: "MODX",
        url: "http://modx.com/",
        type: "cms"
    },

    // @ref http://mollom.com/
    "mollom": {
        name: "Mollom",
        url: "http://mollom.com/",
        type: "unknown"
    },

    // @ref https://moodle.org/
    "moodle": {
        name: "Moodle",
        url: "https://moodle.org/",
        type: "course-management-system"
    },

    // @ref http://mootools.net
    // @example http://mootools.net
    "mootools": {
        name: "MooTools",
        url: "http://mootools.net",
        type: "js-library"
    },

    // @ref http://www.movabletype.com/
    // @example http://www.movabletype.com/
    "movabletype": {
        name: "MovableType",
        url: "http://www.movabletype.com/",
        type: "blogging-platform"
    },

    // @ref http://http://dev7studios.com/nivo-slider/
    // @example http://dev7studios.com/nivo-slider/
    "nivoslider": {
        name: "jQuery nivoSlider plugin",
        url: "http://dev7studios.com/nivo-slider/",
        type: "visualization-library"
    },

    // @ref http://openacs.org/
    // @example http://openacs.org/
    "openacs": {
        name: "OpenACS",
        url: "http://openacs.org/",
        type: "cms"
    },

    // @ref http://www.opencart.com/
    // @example http://demo.opencart.com/
    "opencart": {
        name: "OpenCart",
        url: "http://www.opencart.com/",
        type: "e-commerce"
    },

    // @ref http://www.opencms.org/en/
    // @example http://www.opencms.org/en/
    "opencms": {
        name: "OpenCMS",
        url: "http://www.opencms.org/en/",
        type: "cms"
    },

    // @ref http://www.openx.com/
    // @example http://themalaysianinsider.com
    "openx": {
        name: "OpenX",
        url: "http://www.openx.com/",
        type: "advertising"
    },

    // @ref http://www.oscommerce.com/
    // @example http://demo.oscommerce.com/
    "oscommerce": {
        name: "osCommerce",
        url: "http://www.oscommerce.com/",
        type: "e-commerce"
    },

    // @ref https://github.com/mozilla/pdf.js
    // @example http://mozilla.github.com/pdf.js/web/viewer.html
    "pdfjs": {
        name: "PDF.js",
        url: "https://github.com/mozilla/pdf.js",
        type: "visualization-library"
    },

    // @ref https://www.phpbb.com/
    "phpbb": {
        name: "phpBB",
        url: "https://www.phpbb.com/",
        type: "forum"
    },

    // @ref http://www.php-fusion.co.uk/news.php
    // @example http://www.php-fusion.co.uk/news.php
    "phpfusion": {
        name: "PHP Fusion",
        url: "http://www.php-fusion.co.uk/news.php",
        type: "cms"
    },

    // @ref http://www.phpnuke.org/
    "phpnuke": {
        name: "PHP-Nuke",
        url: "http://www.phpnuke.org/",
        type: "cms"
    },

    // @ref http://www.phpnuke.org/
    // @example http://pivotx.net/
    "pivotx": {
        name: "PivotX",
        url: "http://pivotx.net/",
        type: "cms"
    },

    // @ref http://plone.org/
    // @example http://plone.org/
    "plone": {
        name: "Plone",
        url: "http://plone.org/",
        type: "cms"
    },

    // @ref http://www.prestashop.com/en
    // @example http://demo-store.prestashop.com/en/
    "prestashop": {
        name: "PrestaShop",
        url: "http://www.prestashop.com/en",
        type: "e-commerce"
    },

    // @ref http://processingjs.org
    // @example http://processingjs.org
    "processing": {
        name: "Processing",
        url: "http://processingjs.org",
        type: "visualization-library"
    },

    // @ref http://www.prostores.com/
    "prostores": {
        name: "ProStores",
        url: "http://www.prostores.com/",
        type: "e-commerce"
    },

    // @ref http://prototypejs.org/
    // @example https://www.airasiamegastore.com/
    "prototype": {
        name: "Prototype",
        url: "http://prototypejs.org",
        type: "js-library"
    },

    // @ref https://www.quantcast.com/
    // @example https://www.quantcast.com/
    "quantcast": {
        name: "Quantcast",
        url: "https://www.quantcast.com/",
        type: "biz-library"
    },

    // @ref http://www.rackspace.com/cloud/files/
    // @example http://www.rackspace.com/
    "rackspace-cloudfiles": {
        name: "Rackspace Cloud Files",
        url: "http://www.rackspace.com/cloud/files/",
        type: "cloud"
    },

    // @ref http://raphaeljs.com/
    // @example http://raphaeljs.com/
    "raphael": {
        name: "Raphaël",
        url: "http://raphaeljs.com",
        type: "visualization-library"
    },

    // @ref http://www.google.com/recaptcha
    // @example http://www.google.com/recaptcha
    "recaptcha": {
        name: "reCaptcha",
        url: "http://www.google.com/recaptcha",
        type: "js-library"
    },

 
    // @ref http://requirejs.org/
    // @example http://hallmark.com/
    "requirejs": {
        name: "RequireJS",
        url: "http://requirejs.org",
        type: "js-library"
    },

    // @ref http://www.adobe.com/solutions/digital-marketing.html
    // @example https://my.omniture.com/login/
    "s.t": {
        name: "Omniture SiteCatalyst",
        url: "http://www.adobe.com/solutions/digital-marketing.html",
        type: "analytics"
    },

    // @ref http://www.s9y.org/
    // @example http://blog.s9y.org/
    "serendipity": {
        name: "Serendipity",
        url: "http://www.s9y.org",
        type: "blogging-platform"
    },

    // @ref http://www.sifrgenerator.com/
    // @example http://www.sifrgenerator.com/example/example.html
    "sifr": {
        name: "sIFR",
        url: "http://www.sifrgenerator.com/",
        type: "font-library"
    },

    // @ref http://www.silverstripe.com/
    // @example http://www.silverstripe.com/
    "silverstripe": {
        name: "SilverStripe",
        url: "http://www.silverstripe.com/",
        type: "cms"
    },

    // @ref http://www.sitefinity.com/
    "sitefinity": {
        name: "SiteFinity",
        url: "http://www.sitefinity.com/",
        type: "cms"
    },

    // @ref http://script.aculo.us
    // @example https://www.airasiamegastore.com/
    "scriptaculous": {
        name: "Scriptaculous",
        url: "http://script.aculo.us",
        type: "js-library"
    },

    // @ref http://demos.flesler.com/jquery/scrollTo/
    // @example https://www.airasiamegastore.com/
    "scrollto": {
        name: "jQuery ScrollTo plugin",
        url: "http://demos.flesler.com/jquery/scrollTo/",
        type: "js-library"
    },

    // @ref http://office.microsoft.com/en-us/collaboration-software-sharepoint-FX103479517.aspx
    "sharepoint": {
        name: "SharePoint",
        url: "http://office.microsoft.com/en-us/collaboration-software-sharepoint-FX103479517.aspx",
        type: "cms",
    },

    // @ref http://shibboleth.net/
    "shibboleth": {
        name: "Shibboleth",
        url: "http://shibboleth.net/",
        type: "unknown",
    },

    // @ref http://www.simplemachines.org/
    // @example https://www.airasiamegastore.com/
    "smf": {
        name: "Simple Machines Forum",
        url: "http://www.simplemachines.org/",
        type: "forum",
    },

    // @ref http://spinejs.com/
    // @example http://maccman.github.com/spine.todos/
    "spine": {
        name: "Spine",
        url: "http://spinejs.com/",
        type: "js-library"
    },

    // @ref http://sproutcore.com
    // @example http://sproutcore.com
    "sproutcore": {
        name: "SproutCore",
        url: "http://sproutcore.com/",
        type: "js-library"
    },

    // @ref http://code.google.com/p/swfobject/
    // @example http://www.bobbyvandersluis.com/swfobject/testsuite_2_2/test_dynamic.html
    "superfish": {
        name: "jQuery Superfish plugin",
        url: "http://users.tpg.com.au/j_birch/plugins/superfish/",
        type: "js-library"
    },

    // @ref http://code.google.com/p/swfobject/
    // @example http://www.bobbyvandersluis.com/swfobject/testsuite_2_2/test_dynamic.html
    "swfobject": {
        name: "SWFObject",
        url: "http://code.google.com/p/swfobject/",
        type: "js-library"
    },

    // @ref http://www.tumblr.com/
    "tumblr": {
        name: "Tumblr",
        url: "http://www.tumblr.com/",
        type: "blogging-platform"
    },

    // @ref http://www.turnjs.com/
    // @example http://www.turnjs.com/
    "turn": {
        name: "jQuery Turn.js plugin",
        url: "http://www.turnjs.com/",
        type: "visualization-library"
    },

    // @ref https://dev.twitter.com/docs
    // @example http://www.koolred.com
    "twttr": {
        name: "Twitter Widgets",
        url: "https://dev.twitter.com/docs",
        type: "social-networking"
    },

    // @ref https://typekit.com/
    // @example https://typekit.com/
    "typekit": {
        name: "Typekit",
        url: "https://typekit.com/",
        type: "font-library"
    },

    // @ref https://typekit.com/
    // @example http://www.justmakestuff.com/ndg/2013/03/what-i-learned.html
    "typepad": {
        name: "Typepad",
        url: "http://www.typepad.com/",
        type: "blogging-platform"
    },

    // @ref http://typo3.org/
    // @example http://typo3.org/
    "typo3": {
        name: "Typo3",
        url: "http://typo3.org/",
        type: "cms"
    },

    // @ref http://www.ubercart.org/
    // @example http://www.ubercartdemo.com/
    "ubercart": {
        name: "Ubercart",
        url: "http://www.ubercart.org/",
        type: "e-commerce"
    },

    // @ref http://www.vbulletin.com/
    // @example http://www.vbulletin.com/vb5demo/
    "vbulletin": {
        name: "vBulletin",
        url: "http://www.vbulletin.com/",
        type: "forum"
    },

    // @ref http://www.volusion.com/
    // @example http://www.shopnatgeo.co.uk/
    "volusion": {
        name: "Volusion",
        url: "http://www.volusion.com/",
        type: "e-commerce"
    },

    // @ref http://www.google.com/webfonts
    // @example http://www.google.com/webfonts
    "webfonts": {
        name: "Google Web Fonts",
        url: "http://www.google.com/webfonts",
        type: "js-library"
    },

    // @ref http://www.webgui.org/
    // @example http://www.webgui.org/
    "webgui": {
        name: "WebGUI",
        url: "http://www.webgui.org/",
        type: "cms"
    },

    // @ref http://www.weebly.com/
    "weebly": {
        name: "Weebly",
        url: "http://www.weebly.com/",
        type: "cms"
    },

    // @ref http://wibiya.conduit.com/
    "wibiya": {
        name: "Wibiya",
        url: "http://wibiya.conduit.com/",
        type: "engagement"
    },

    // @ref http://wordpress.org
    // @example http://ditesh.gathani.org/blog
    "wordpress": {
        name: "WordPress",
        url: "http://wordpress.org",
        type: "blogging-platform"
    },

    // @ref http://wpml.org/
    "wpml": {
        name: "WordPress Multilingual Plugin",
        url: "http://wpml.org/",
        type: "blogging-platform"
    },

    // @ref http://xenforo.com/
    "xenforo": {
        name: "Xen Foro",
        url: "http://xenforo.com/",
        type: "forum"
    },

    // @ref http://xoops.org
    // @example http://demo.xoopsfire.com/
    "xoops": {
        name: "XOOPS",
        url: "http://www.xoops.org",
        type: "cms"
    },

    // @ref https://www.yola.com/
    "yola": {
        name: "Yola",
        url: "https://www.yola.com/",
        type: "cms"
    },

    // @ref http://yuilibrary.com
    // @example http://yuilibrary.com
    "yui": {
        name: "Yahoo! UI Library",
        url: "http://www.yuilibrary.com",
        type: "js-library"
    },

    // @ref http://www.zen-cart.com/
    // @example http://www.negativeionaccessories.com/
    "zencart": {
        name: "Zen Cart",
        url: "http://www.zen-cart.com/",
        type: "e-commerce"
    },

    // @ref http://www.zenphoto.org/
    // @example http://www.zenphoto.org/demo/
    "zenphoto": {
        name: "Zen Photo",
        url: "http://www.zenphoto.org/",
        type: "cms"
    },

    // @ref http://zeptojs.com/
    // @example http://zeptojs.com/
    "zepto": {
        name: "Zepto.JS",
        url: "http://zeptojs.com/",
        type: "js-library"
    },

};
