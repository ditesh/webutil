# webutil

webutil provides automatic website analysis for the savvy web developer. It helps you build faster websites and pinpoint bottlenecks. It provides:

* quick glance summary of key metrics
* HTTP and JavaScript error reporting
* caching analysis with an empty and primed cache
* detection of 2<sup>7</sup> commonly used front end libraries, content management systems and third party embeds (aka What's That Site Running?)
* automatic asset (HTML, JavaScript, CSS, images) optimization facility:
    * minification
    * compression
    * asset optimization benefit analysis
* header verification and analysis
* built in user agent support with screen dimensions
* standard `phantomjs` facilities
    * screenshots
    * HAR file generation

webutil is a [phantomjs](http://phantomjs.org)-based tool.

## INSTALL

1. Install [phantomjs](http://phantomjs.org/download.html)
2. Get the code: `git clone git://github.com/ditesh/webutil.js`
3. Run it: `chmod a+x wush; ./wush www.reddit.com`

## What can it do?

Lots. Let's get relevant stats for Reddit:

    $ chmod a+x wush  # make the shell script executable
    $ ./wush reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
    Requests    33 request(s), 385103 bytes (376 KB), 0 redirect(s)
    Resources   HTML: 2, CSS: 1, JS: 4, images: 26, others: 0
                UTF-8: 4, ISO-8859-1: 0, others: 0, not-specified: 29
                compressed: 27, not-compressed: 6
    Timing      first byte: 291 ms, onDOMContentLoaded: 667 ms, onLoad: 2386 ms, fully loaded: 4390 ms
    Errors      4xx: 0, 5xx: 0, JS: 0

As you can see, it provides a nicely formatted summary about the site highlighting key areas.

### Getting URL's

Now, lets get a complete list of URL's accessed by the browser when loading up the site:

    $ ./wush -lu reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
    ... snipped for brevity ...

    [URLs]
    HTML  115084  http://www.reddit.com/
    JS    45830   http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
    CSS   78617   http://www.redditstatic.com/reddit._E2WnMcei1o.css
    JS    58064   http://www.redditstatic.com/reddit.en.yRpDmsrGWVQ.js
    ... snipped for brevity ...


Content type, resource size and resource URL is provided. Occasionally, we are only interested in resources from the same domain. This can be achieved by using the `-d` parameter:

    $ ./wush -u -d reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
    ... snipped for brevity ...

    [URLs]
    HTML  110196  http://www.reddit.com/
    HTML  2108    http://www.reddit.com/api/request_promo

Whoops, clearly the URL list is wrong. As it turns out, reddit.com keeps its assets in other domains. We need to rerun the command using the -dd to specify other domains reddit.com uses.

    $ ./wush -u -dd reddit,media reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
        ... snipped for brevity ...

    [URLs]
    HTML  114590  http://www.reddit.com/
    CSS   78497   http://www.redditstatic.com/reddit._E2WnMcei1o.css
    JS    68817   http://www.redditstatic.com/reddit.en.yRpDmsrGWVQ.js
    PNG   9670    http://www.redditstatic.com/sprite-reddit.HLCFG7U22Hg.png
    ... snipped for brevity ...

The `-dd` pulls up URL's by doing pattern matching on all hostnames (ie, in this case, hostname is matched against the words `reddit` and `media`). This allows finegrained controlled of which URL's are to be included in the analysis.

The important thing to note about `-d` and `-dd` is that the numbers in the summary are reflective of the URL's analyzed.

### Primed Cache

There is an inbuilt facility to provide the summary but with a primed cache. This is a good way to check whether the browser is, in fact, caching the site on subsequent visits.

    # One execution
    $ ./wush reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
    Requests    33 request(s), 385103 bytes (376 KB), 0 redirect(s)
    Resources   HTML: 2, CSS: 1, JS: 4, images: 26, others: 0
                UTF-8: 4, ISO-8859-1: 0, others: 0, not-specified: 29
                compressed: 27, not-compressed: 6
    Timing      first byte: 291 ms, onDOMContentLoaded: 667 ms, onLoad: 2386 ms, fully loaded: 4390 ms
    Errors      4xx: 0, 5xx: 0, JS: 0

    # Two executions
    $ ./wush -c 1 reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
    Requests    14 request(s), 135463 bytes (132 KB), 0 redirect(s)
    Resources   HTML: 2, CSS: 0, JS: 1, images: 11, others: 0
                UTF-8: 3, ISO-8859-1: 0, others: 0, not-specified: 11
                compressed: 12, not-compressed: 2
    Timing      first byte: 291 ms, onDOMContentLoaded: 667 ms, onLoad: 2386 ms, fully loaded: 4390 ms
    Errors      4xx: 0, 5xx: 0, JS: 0

When the `-c` parameter is passed, the page is reloaded the specified number of times. In the example above, the page is loaded once, and then reloaded one more time (reflecting the effect of passing `-c 1`).

You can see the benefits of caching as the number of requests, page size etc drop. This is best used with `-d` or `-dd` to exclude third party resources.

### Optimizing

There is a bundled shell script that can automatically take the URL's and attempt to compress/minify CSS, JS or image assets.

    $ chmod a+x tools/downloader tools/optimizer
    $ tools/downloader -dd reddit,media reddit.com

    Web Downloader Tool 1.0.1 (c) 2013 Ditesh Gathani <ditesh@gathani.org>

    Running webutil ... done.
    Checking for PNG files ... found ... downloading ... done.
    Checking for JPEG files ... found ... downloading ... done.
    Checking for GIF files ... found ... downloading ... done.
    Checking for CSS files ... found ... downloading ... done.
    Checking for JS files ... found ... downloading ... done.

    # tools/optimizer

    Web Optimization Tool 1.0.1 (c) 2013 Ditesh Gathani <ditesh@gathani.org>

    Checking for PNG files ... optimizing ... done.
    Checking for JPEG files ... optimizing ... done.
    Checking for GIF files ... optimizing ... done.
    Checking for CSS files ... optimizing ... done.
    Checking for JS files ... optimizing ...done.

    RESULTS (with no compression)

    ASSET  COUNT  AS-IS  OPTIMIZED  DIFF(KB)  DIFF(%)
    -----  -----  -----  ---------  --------  -------
    GIF    2      5KB    5KB        0KB       0%
    JPG    18     40KB   40KB       0KB       0%
    PNG    6      50KB   46KB       4KB       8.00%
    CSS    2      127KB  125KB      2KB       1.57%
    JS     3      127KB  126KB      1KB       0.78%
    TOTAL  31     349KB  342KB      7KB       2.00%

    AWS bandwidth savings: USD$ 1.26 per million visits

    RESULTS (with gzip compression)

    RESOURCE  COUNT  AS-IS  OPTIMIZED  DIFF(KB)  DIFF(%)
    -----     -----  -----  ---------  --------  -------
    GIF       2      5KB    5KB        0KB       0%
    JPG       18     40KB   40KB       0KB       0%
    PNG       6      49KB   46KB       3KB       6.12%
    CSS       2      29KB   29KB       0KB       0%
    JS        3      42KB   42KB       0KB       0%
    TOTAL     31     165KB  162KB      3KB       1.81%

    AWS bandwidth savings: USD$ 0.54 per million visits

A few things to note here:

* [UglifyJS2](https://github.com/mishoo/UglifyJS2) is used to minify, optimize and compress JavaScript files
* [csstidy](http://csstidy.sourceforge.net/) is used to optimize CSS files
* [optipng](http://optipng.sourceforge.net/) is used to optimize PNG files
* [jpegtran](http://jpegclub.org/jpegtran/) is used to optimize JPEG files
* [optipng](http://optipng.sourceforge.net/) is used to optimize GIF files by converting them to PNG only if the GIF is not animated and the resulting filesize is smaller
* Bandwidth calculations are based on the 1-10TB pricing for the Singaporean AWS region
* Downloaded resources are available in `/tmp/webutil/js/pre` (replace js with css/png/jpg)
* Optimized resources are available in `/tmp/webutil/js/post` (replace js with css/png/jpg)

### Credits

1. PhantomJS
2. Sniffer
3. Steve Souder's Spriter
4. Redbot
5. WebPageTest
