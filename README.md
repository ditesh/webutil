# webutil.js

webutil.js is a [phantomjs](http://phantomjs.org)-based tool to analyze and optimize websites. It provides key metrics for a site, runs size and caching analysis and provides an automatic asset optimization feature.

## INSTALL

1. Install [phantomjs](http://phantomjs.org/download.html)
2. Get the code: `git clone git://github.com/ditesh/webutil.js`
3. Run it: `chmod a+x wush; ./wush http://www.reddit.com`

## What can it do?

Lots. Let's get relevant stats for Reddit:

    $ chmod a+x wush  # make the shell script executable
    $ ./wush reddit.com
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        Requests    33 request(s), 385103 bytes (376 KB), 0 redirect(s)
        Resources   HTML: 2, CSS: 1, JS: 4, images: 26, others: 0
                    UTF-8: 4, ISO-8859-1: 0, others: 29
                    compressed: 27, not-compressed: 6
        Timing      onDomContentLoaded: 3.1s, onLoad: 3.91s
        Errors      4xx: 0, 5xx: 0, JS: 0

As you can see, it provides a nicely formatted summary about the site highlighting key areas.

### Getting URL's

Now, lets get a complete list of URL's accessed by the browser when loading up the site:

    $ ./wush -u reddit.com
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        ... snipped for brevity ...

    [URLs]
        text/html               115084  http://www.reddit.com/
        text/javascript         45830   http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
        text/css                78617   http://www.redditstatic.com/reddit._E2WnMcei1o.css
        application/javascript  58064   http://www.redditstatic.com/reddit.en.yRpDmsrGWVQ.js
        ... snipped for brevity ...


Mimetype, resource size and resource URL is provided. Occasionally, we are only interested in resources from the same domain. This can be achieved by using the `-d` parameter:

    $ ./wush -u -d reddit.com
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        ... snipped for brevity ...

    [URLs]

Whoops, there are no URL's. As it turns out, reddit.com doesn't have any resources from the same domain. We need to rerun the command using the -dd to specify the other domains reddit.com uses.

    $ ./wush -u -dd reddit,media reddit.com
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        ... snipped for brevity ...

    [URLs]
        text/html               114590  http://www.reddit.com/
        text/css                78497   http://www.redditstatic.com/reddit._E2WnMcei1o.css
        application/javascript  68817   http://www.redditstatic.com/reddit.en.yRpDmsrGWVQ.js
        image/png               9670    http://www.redditstatic.com/sprite-reddit.HLCFG7U22Hg.png
        ... snipped for brevity ...

The `-dd` pulls up URL's by doing pattern matching on all hostnames (ie, in this case, hostname is matched against the words `reddit` and `media`). This allows finegrained controlled of which URL's are to be included in the analysis.

The important thing to note about `-d` and `-dd` is that the numbers in the summary are reflective of the URL's analyzed.

### Primed Cache

There is an inbuilt facility to provide the summary but with a primed cached. This is a good way to check whether the browser is, in fact, caching the site on subsequent visits.

    # One execution
    $ ./wush reddit.com
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        Requests    33 request(s), 385103 bytes (376 KB), 0 redirect(s)
        Resources   HTML: 2, CSS: 1, JS: 4, images: 26, others: 0
                    UTF-8: 4, ISO-8859-1: 0, others: 29
                    compressed: 27, not-compressed: 6
        Timing      onDomContentLoaded: 3.1s, onLoad: 3.91s
        Errors      4xx: 0, 5xx: 0, JS: 0

    # Two executions
    $ ./wush -c 1 reddit.com
    webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        Requests    14 request(s), 135463 bytes (132 KB), 0 redirect(s)
        Resources   HTML: 2, CSS: 0, JS: 1, images: 11, others: 0
                    UTF-8: 3, ISO-8859-1: 0, others: 11
                    compressed: 12, not-compressed: 2
        Timing      onDomContentLoaded: 1.68s, onLoad: 4.65s
        Errors      4xx: 0, 5xx: 0, JS: 0

When the `-c` parameter is passed, the page is reloaded the specified number of times. In the example above, the page is loaded once, and then reloaded one more time (reflecting the effect of passing `-c 1`).

You can see the benefits of caching as the number of requests, page size etc drop. This is best used with `-d` or `-dd` to exclude third party resources.

### Optimizing

There is a bundled shell script that can automatically take the URL's and attempt to compress/minify CSS, JS or image assets.

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

    [*] RESULTS (with no compression):

    RESOURCE  AS-IS  OPTIMIZED  DIFF(KB)  DIFF(%)
    --------  -----  ---------  -------   -------
    JPG       15KB   4.9KB      10.1KB    67.33%
    PNG       38KB   35KB       3KB       7.89%
    CSS       143KB  110KB      33KB      23.07%
    JS        65KB   63KB       2KB       3.07%
    TOTAL     261KB  212.9KB    48.1KB    18.42%

    AWS bandwidth savings: USD$ 8.71 per million visits

    [*] RESULTS (with gzip compression)

    RESOURCE  AS-IS   OPTIMIZED  DIFF(KB)  DIFF(%)
    --------  -----   ---------  -------   -------
    JPG       7.7KB   4.4KB      3.3KB     42.85%
    PNG       38KB    35KB       3KB       7.89%
    CSS       30KB    25KB       5KB       16.66%
    JS        21KB    20KB       1KB       4.76%
    TOTAL     96.7KB  84.4KB     12.3KB    12.71%

    AWS bandwidth savings: USD$ 2.22 per million visits

A few things to note here:

* [UglifyJS2](https://github.com/mishoo/UglifyJS2) is used to minify, optimize and compress JavaScript files
* [csstidy](http://csstidy.sourceforge.net/) is used to optimize CSS files
* [optipng](http://optipng.sourceforge.net/) is used to optimize PNG files
* [jpegtran](http://jpegclub.org/jpegtran/) is used to optimize JPEG files
* [optipng](http://optipng.sourceforge.net/) is used to optimize GIF files by converting them to PNG only if the GIF is not animated and the resulting filesize is smaller
* Bandwidth calculations are based on the 1-10TB pricing for the Singaporean AWS region
* Downloaded resources are available in `/tmp/webutil/js/pre` (replace js with css/png/jpg)
* Optimized resources are available in `/tmp/webutil/js/post` (replace js with css/png/jpg)

