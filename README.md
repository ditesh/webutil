webutil.js
==========

webutil.js is a [phantomjs](http://phantomjs.org)-based tool to analyze websites. It can provide a summary of key metrics for the page in addition to being able to automatically run a size analysis on all assets.

INSTALL
-------

1. Install [phantomjs 1.8.0](http://phantomjs.org/download.html) or greater
2. Get the code: `git clone git://github.com/ditesh/webutil.js`
3. Run it: `sh wush www.slashdot.org`

What can it do?
---------------

Lets get relevant stats for the GNU website:

    $ chmod a+x wush  # make the shell script executable
    $ ./wush http://www.gnu.org
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        Requests    10 request(s), 55350 bytes (54 KB), 0 redirect(s)
        Resources   HTML: 1, CSS: 4, JS: 0, images: 5, others: 0
                    UTF-8: 0, ISO-8859-1: 0, others: 10
                    compressed: 5, not-compressed: 5
        Timing      onDomContentLoaded: 0s, onLoad: 2.76s
        Errors      4xx: 0, 5xx: 0, JS: 0

As you can see, it provides a nicely formatted summary about the site.

Now, lets get a complete list of URL's accessed by the browser when loading up the site:

    $ ./wush -u http://www.gnu.org
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        ... summary goes here ...

    [URLs]
        text/html 20855 http://www.gnu.org/
        text/css  6746  http://www.gnu.org/combo.css
        image/jpeg  2494  http://www.gnu.org/graphics/t-desktop-4-small.jpg
        image/png 469 http://www.gnu.org/feed-icon-10x10.png
        text/css  13400 http://www.gnu.org/layout.css
        image/png 3911  http://static.fsf.org/fsforg/graphics/Knob3.png
        image/gif 51  http://www.gnu.org/graphics/bullet.gif
        image/png 3937  http://www.gnu.org/graphics/topbanner.png
        text/css  1821  http://www.gnu.org/mini.css
        text/css  1666  http://www.gnu.org/print.css

As you can see, the mimetype, HTTP response code and the URL to the resource is provided. Occasionally, we are only interested in resources from the same domain. This can be achieved as follows:

    $ ./wush -u -d http://www.gnu.org
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        ... summary goes here ...

    [URLs]
        text/html 20855 http://www.gnu.org/
        text/css  6746  http://www.gnu.org/combo.css
        image/jpeg  2494  http://www.gnu.org/graphics/t-desktop-4-small.jpg
        image/png 469 http://www.gnu.org/feed-icon-10x10.png
        text/css  13400 http://www.gnu.org/layout.css
        image/gif 51  http://www.gnu.org/graphics/bullet.gif
        image/png 3937  http://www.gnu.org/graphics/topbanner.png
        text/css  1821  http://www.gnu.org/mini.css
        text/css  1666  http://www.gnu.org/print.css

As you can see, the resources from `static.fsf.org` is no longer part of the list.

There is a bundled shell script that can automatically take this list of URL's and attempt to compress/minify all assets.

    $ chmod a+x optimize.sh
    $ ./optimize.sh http://www.themalaysianinsider.com

    Web Optimization Tool 1.0 (c) 2013 Ditesh Gathani <ditesh@gathani.org>
    Running webutil ... done.
    Checking for PNG files ... found
    Downloading PNG files ... done.
    Optimizing PNG files ... done.
    Checking for JPG files ... found.
    Downloading JPG files ... done.
    Optimizing JPG files ... done.
    Checking for GIF files ... not found.
    Checking for CSS files ... found.
    Downloading CSS files ... done.
    Optimizing CSS files ... done.
    Checking for JS files ... found.
    Downloading JS files ... done.
    Optimizing JS files ... done.

    Results:
    JPG: 15KB 4.9KB 10.1KB 67.33%
    PNG: 38KB 35KB 3KB 7.89%
    CSS: 143KB 110KB 33KB 23.07%
    JS: 65KB 63KB 2KB 3.07%
    Total: 261KB 212.9KB 48.1KB 18.42%
    AWS bandwidth savings: USD$ 8.71 (1 million visits/month)

A few things to note here:

* [UglifyJS2](https://github.com/mishoo/UglifyJS2) is used to optimize JavaScript files
* [csstidy](http://csstidy.sourceforge.net/) is used to optimize CSS files
* [optipng](http://optipng.sourceforge.net/) is used to optimize PNG files
* [jpegtran](http://jpegclub.org/jpegtran/) is used to optimize JPEG files
* [optipng](http://optipng.sourceforge.net/) is used to optimize GIF files by converting them to PNG only if the GIF is not animated and the resulting filesize is smaller
* Bandwidth calculations are based on the 1-10TB pricing for the Singaporean AWS region
* Downloaded resources are available in `/tmp/webutil/js/pre` (replace js with css/png/jpg)
* Optimized resources are available in `/tmp/webutil/js/post` (replace js with css/png/jpg)

