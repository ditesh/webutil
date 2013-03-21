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

var helper = require("./libs/helper"), webpage = require("webpage").create(),
    print = require("./libs/print"), cli = require("./libs/cli").parse(), flags = cli["flags"],
    page = require("./libs/page"), sniffer = require("./libs/sniffer"), data = require("./libs/data").data,
    headers = new (require("./libs/headers").Headers),
    cpa = require("./libs/cpa");

// Set a timeout to avoid long lived pages
// (eg those that don't fire the onLoad event or
// those with nasty javascript)
setTimeout(function() {

    if (flags["debug"]) helper.log("timeout called");
    webpage.close();
    page.callback("success");

}, flags["timeout"]*1000);

// Hook up the callbacks
webpage.onResourceRequested = page.onResourceRequested;
webpage.onResourceReceived = page.onResourceReceived;
webpage.onError = page.onError;
webpage.onInitialized =  page.onInitialized;
webpage.onNavigationRequested =  page.onNavigationRequested;
webpage.onLoadStarted =  page.onLoadStarted;
webpage.onLoadFinished =  page.onLoadFinished;
webpage.onCallback =  page.onCallback;
webpage.onConsoleMessage =  page.onConsoleMessage;

// Fire!
webpage.open(cli["url"], page.callback);
