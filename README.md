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

As you can see, it provides a nicely formatted summary about the site highlighting key areas. Timing information, so often key to web developers, is covered in more detail below.

### Get a page weight breakdown

Get a page weight breakdown by resources:

    $ ./wush -b reddit.com
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    Summary
    Requests    41 request(s), 587702 bytes (574 KB), 1 redirect(s)
    Resources   HTML: 3, CSS: 3, JS: 9, images: 26, others: 0
                UTF-8: 5, ISO-8859-1: 0, others: 0, not-specified: 36
                compressed: 27, not-compressed: 14
                encrypted: 0, not-encrypted: 41
    Timing      first byte: 149 ms, onDOMContentLoaded: 563 ms, onLoad: 1755 ms, fully loaded: 3760 ms
    Errors      4xx: 0, 5xx: 0, JS: 0

    Breakdown
    HTML      3 files   107243 bytes (105 KB)
    JS        9 files   338664 bytes (331 KB)
    CSS       3 files   79286 bytes (77 KB)
    PNG       7 files   29916 bytes (29 KB)
    GIF       4 files   1245 bytes (1 KB)
    JPG      15 files   31348 bytes (31 KB)

Lets run it again but only have it consider resources that are within reddit's control (ie, excluding third party embeds). The `-dd` parameter achieves this (more on this below):

    $ ./wush -b -dd reddit,media reddit.com
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    Summary
    Requests    33 request(s), 371169 bytes (362 KB), 1 redirect(s)
    Resources   HTML: 2, CSS: 2, JS: 3, images: 26, others: 0
                UTF-8: 3, ISO-8859-1: 0, others: 0, not-specified: 30
                compressed: 27, not-compressed: 6
                encrypted: 0, not-encrypted: 33
    Timing      first byte: 281 ms, onDOMContentLoaded: 688 ms, onLoad: 2139 ms, fully loaded: 4142 ms
    Errors      4xx: 0, 5xx: 0, JS: 0

    Breakdown
    HTML      2 files   104255 bytes (102 KB)
    CSS       2 files   77670 bytes (76 KB)
    JS        3 files   126757 bytes (124 KB)
    GIF       2 files   1167 bytes (1 KB)
    PNG       6 files   25966 bytes (25 KB)
    JPG      18 files   35354 bytes (35 KB)


### List URL's and content types

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

    $ ./wush -lu -d reddit.com
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

### List resources by compression status

Listing resources by compression status is easy:

    $ ./wush -lc reddit.com
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    Summary
    ... snipped for brevity ...

    URI's (Compressed)
        http://www.reddit.com/
        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
        http://www.redditstatic.com/subreddit-stylesheet/l5HnWp45tKh_Hs__SZks99bdVJ8.css
        http://www.redditstatic.com/reddit.en.NiOpBLl9IG8.js
        http://www.redditstatic.com/reddit-init.en.uiM-SGfQunU.js
        http://static.adzerk.net/Extensions/adFeedback.css
        ... snipped for brevity ...

    URI's (Not Compressed)
        http://www.redditstatic.com/welcome-lines.png
        http://www.redditstatic.com/kill.png
        http://www.redditstatic.com/droparrowgray.gif
        ... snipped for brevity ...

This is a good way of spotting whether server side compression is configured correctly.

### Listing resources by encryption status

Listing resources by encryption status is easy as well:

    $ ./wush -ls https://news.ycombinator.com
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    Summary
    ... snipped for brevity ...

    URI's (Encrypted)
        https://news.ycombinator.com/
        https://news.ycombinator.com/news.css
        https://news.ycombinator.com/y18.gif
        https://news.ycombinator.com/s.gif
        https://news.ycombinator.com/grayarrow.gif

    URI's (Not Encrypted)
    None

### List resources by charset

Finally, to list resources by charset:

    $ ./wush -le https://news.ycombinator.com
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    Summary
    ... snipped for brevity ...

    Charset (utf-8)
        http://www.reddit.com/
        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
        http://www.reddit.com/api/request_promo

    Charset (not specified)
        http://www.redditstatic.com/subreddit-stylesheet/l5HnWp45tKh_Hs__SZks99bdVJ8.css
        http://www.redditstatic.com/reddit.Ib1IJ_64tM4.css
        http://www.redditstatic.com/reddit-init.en.uiM-SGfQunU.js
        ... snipped for brevity ...

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

### Timing

Timing information is important for web developers. `webutil` offers four parameters:

* first byte: measurement of latency between request and first chunk of the first response
* onDOMContentLoaded: fires when the page's DOM is fully constructed, but the referenced resources may not finish loading
* onLoad: fires when the document loading completes
* fully loaded: fires when there is no more network activity

The four parameters are clearly visible below:

    $ ./wush reddit.com
    webutil.js 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    [Summary]
    Requests    33 request(s), 385103 bytes (376 KB), 0 redirect(s)
    Resources   HTML: 2, CSS: 1, JS: 4, images: 26, others: 0
                UTF-8: 4, ISO-8859-1: 0, others: 0, not-specified: 29
                compressed: 27, not-compressed: 6
    Timing      first byte: 291 ms, onDOMContentLoaded: 667 ms, onLoad: 2386 ms, fully loaded: 4390 ms
    Errors      4xx: 0, 5xx: 0, JS: 0

There is an additional `python` based tool that will help execute multiple runs and provide average and standard deviation timing information. This is invoked transparently as follows:

    $ ./wush -repeat 10 reddit.com
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>
    Executing 10 runs on reddit.com

    First Byte:   mean 162.6ms, standard deviation: 30.45ms
    DOMContentLoaded: mean 612.8ms, standard deviation: 32.29ms
    On Load:    mean 1767.4ms, standard deviation: 109.02ms
    Fully Loaded:   mean 3771.3ms, standard deviation: 109.0ms

For reference, the python script is available in `tools/timing.py`

### List HTTP and JavaScript errors

List HTTP errors (4xx, 5xx) and JavaScript errors as follows:

    # We use www.klia.com.my as the site has some errors
    $ ./wush -he -je www.klia.com.my
    webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>

    Summary
    Requests    90 request(s), 178290 bytes (174 KB), 0 redirect(s)
    Resources   HTML: 1, CSS: 6, JS: 15, images: 68, others: 0
                UTF-8: 1, ISO-8859-1: 0, others: 0, not-specified: 89
                compressed: 89, not-compressed: 1
                encrypted: 0, not-encrypted: 90
    Timing      first byte: 273 ms, onDOMContentLoaded: 764 ms, onLoad: 1701 ms, fully loaded: 3706 ms
    Errors      4xx: 8, 5xx: 0, JS: 1

    JavaScript errors
    "SyntaxError: Parse error"

    HTTP errors
    404 http://www.klia.com.my/images/btt_airports_over.gif
    404 http://www.klia.com.my/images/btt_news_over.gif
    404 http://www.klia.com.my/images/btt_investor_over.gif
    404 http://www.klia.com.my/btt_airlines_over.gif
    404 http://www.klia.com.my/images/btt_careers_over.gif
    404 http://www.klia.com.my/images/btt_social_over.gif
    404 http://www.klia.com.my/images/btt_about_over.gif
    404 http://www.klia.com.my/klia2008eng/global_js/menu_dom.js

### JSON output

Pass `-json` for JSON-only output:

    $ ./wush -json -b reddit.com
    {"HTML":{"count":3,"size":115683},"JS":{"count":9,"size":279306},"CSS":{"count":3,"size":79210},"GIF":{"count":4,"size":1245},"PNG":{"count":7,"size":28463},"JPG":{"count":19,"size":37402}}

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
