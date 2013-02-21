"use strict"

var helper = require("./helper"), webpage = require("webpage").create(),
    cli = require("./cli").parse(), flags = cli["flags"],
    page = require("./page"), print = require("./print"), headers = new (require("./headers").Headers);

print.header();

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
webpage.onLoadFinished=  page.onLoadFinished;
webpage.onCallback =  page.onCallback;

// Fire!
webpage.open(cli["url"], page.callback);
