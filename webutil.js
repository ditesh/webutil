var page = require("webpage").create();
var system = require('system');
var skip = false,
    flags = {
        "print-urls": false,
        "print-redirects": false,
        "print-http-errors": false,
        "print-javascript-errors": false,
        "screenshot": false,
        "print-breakdown": false,
        "screenshot-path": "/tmp/screenshot.png",
        "sort-by": 0,
        "silent": false
    },
    startTime = Date.now(),
    jsErrors = [],
    prefix = "\t\t";

if (system.args.length === 1) {

    printHeader();
    printHelp();
    phantom.exit();

} else {

    system.args.forEach(function (arg, i) {

        if (skip === true) skip = false;
        else if (arg === "-h") {

            printHelp();
            phantom.exit();

        } else if (arg === "-ua") {

            skip = true;

            if (i+1 >= system.args.length) {

                printHelp();
                phantom.exit();

            }

            var path = system.args[i+1];

            if (path.charAt(0) === "-") {

                printHelp();
                phantom.exit();

            }

            page.settings.userAgent = system.args[i+1]

        } else if (arg === "-z") {
            
            skip = true;
            flags["screenshot"] = true;

            if (i+1 >= system.args.length) {

                printHelp();
                phantom.exit();

            }

            var path = system.args[i+1];

            if (path.charAt(0) === "-") {

                printHelp();
                phantom.exit();

            }

            flags["screenshot-path"] = system.args[i+1];

        } else if (arg === "-s") {

            prefix = "";
            flags["silent"] = true;

        } else if (arg === "-sa") flags["sort-by"] |= 2;
        else if (arg === "-sd") flags["sort-by"] |= 4;
        else if (arg === "-sc") flags["sort-by"] |= 8;
        else if (arg === "-he") flags["print-http-errors"] = true;
        else if (arg === "-je") flags["print-javascript-errors"] = true;
        else if (arg === "-u") flags["print-urls"] = true;
        else if (arg === "-b") flags["print-breakdown"] = true;
        else if (arg === "-r") flags["print-redirects"] = true;
        else url = arg.trim();

    });
}

var testflag = 0;
if (flags["print-urls"] === true) testflag += 1;
if (flags["print-breakdown"] === true) testflag += 1;
if (flags["print-http-errors"] === true) testflag += 1;
if (flags["print-javascript-errors"] === true) testflag += 1;

if (url.length === 0 || (flags["silent"] === true && testflag > 2)) {

    flags["silent"] = false;

    printHeader();
    printHelp();
    phantom.exit();

}

printHeader();

var assets = [];

page.onError = function(msg, trace) {
    jsErrors.push(msg);
}

page.open(url, function(status) {

    if (status === "success") {

        var totalSize = 0,
            types = {},
            urls = [],
            redirects = [],
            httpErrors = [],
            breakdown = {},
            loadTime = Math.round((Date.now() - startTime)/10)/100;

        for (var i in assets) {

            if (assets[i]["stage"] === "start") {

                var type = assets[i]["contentType"];
                var offset = type.indexOf(";");
                var statusCode = assets[i]["status"];
                if (offset > 0) type = type.substr(0, offset);

                if (statusCode >= 400) {

                    httpErrors.push({
                        "status-code": statusCode,
                        "url": assets[i]["url"],
                    });

                } else {

                    urls.push({
                        
                        "url": assets[i]["url"],
                        "size": assets[i]["bodySize"],
                        "content-type": type,

                    });

                    totalSize += assets[i]["bodySize"];

                    if (assets[i]["redirectURL"] !== null) {
                        
                        redirects.push({
                            "status-code": assets[i]["status"],
                            "original-url": assets[i]["url"],
                            "new-url": assets[i]["redirectURL"],
                        });

                    }

                    if (type === null) type = "unspecified";
                    else if (type.trim().length === 0) type = "unspecified";
                    else if (type.match(/gif/) !== null) type = "GIF";
                    else if (type.match(/png/) !== null) type = "PNG";
                    else if (type.match(/jpeg/) !== null) type = "JPG";
                    else if (type.match(/css/) !== null) type = "CSS";
                    else if (type.match(/html/) !== null) type = "HTML";
                    else if (type.match(/xml/) !== null) type = "XML";
                    else if (type.match(/plain/) !== null) type = "Text";
                    else if (type.match(/javascript/) !== null) type = "JS";
                    else type = "Others";

                    if ((type in breakdown) === false) breakdown[type] = { count: 0, size: 0};
                    breakdown[type]["count"] += 1;
                    breakdown[type]["size"] += assets[i]["bodySize"];

                }
            }
        }

        printResults({
            "summary": {
                "total-size": totalSize,
                "load-time": loadTime,
            },
            "urls": urls,
            "redirects": redirects,
            "breakdown": breakdown,
            "http-errors": httpErrors,
            "javascript-errors": jsErrors
        });

        if (flags["screenshot"] === true) {

            var retval= page.render(flags["screenshot-path"]);
            if  (retval === FALSE) printError("Unable to save screenshot to " + flags["screenshot-path"]);

        }

        printFooter();
        phantom.exit();

    } else {

        printError("Cannot connect to " + url);
        phantom.exit();

    }
});

page.onResourceReceived = function(res) {
    assets.push(res);
};

function printHeader() {
    if (flags["silent"] === false) console.log("webutil.js 1.0 (c) 2012 Ditesh Gathani <ditesh@gathani.org>");
}

function printFooter() {
    if (flags["silent"] === false) console.log("");
}

function printResults(results) {

    if (flags["silent"] !== true) {

        console.log("");
        console.log("[Summary]");
        console.log(prefix + "Transferred\t" + formatWeight(results["summary"]["total-size"]));
        console.log(prefix + "Redirects\t" + results["redirects"].length);
        console.log(prefix + "Load time\t" + results["summary"]["load-time"] + " seconds");
        console.log(prefix + "JS errors\t" + results["javascript-errors"].length);
        console.log(prefix + "HTTP errors\t" + results["http-errors"].length);

    }

    if (flags["print-breakdown"] === true) {

        if (flags["silent"] !== true) {

            console.log("");
            console.log("[Breakdown]");

        }

        for (var i in results["breakdown"]) {

            var size = formatWeight(results["breakdown"][i]["size"]);
            var count = results["breakdown"][i]["count"];

            if (count === 1) console.log(prefix + i + "\t\t  " + count + " file \t"+ size);
            else {
                
                if (count < 10) console.log(prefix + i + "\t\t  " + count + " files\t"+ size);
                else if (count < 100) console.log(prefix + i + "\t\t " + count + " files\t"+ size);
                else console.log(prefix + i+ "\t\t" + count + " files\t"+ size);

            }
        }
    }

    if (flags["print-urls"] === true) {

        if (flags["silent"] !== true) {

            console.log("");
            console.log("[urls]");

        }

        results["urls"].sort(function(a, b) {

            if (flags["sort-by"] === 2) return (a["size"] < b["size"] ? -1 : 1);
            else if (flags["sort-by"] === 4) return (a["size"] > b["size"] ? -1 : 1);
            else if (flags["sort-by"] > 4) {
                
                if (a["content-type"] < b["content-type"]) return -1;
                else if (a["content-type"] === b["content-type"]) {
                    
                    if (flags["sort-by"] === 10) return (a["size"] < b["size"] ? -1 : 1);
                    else if (flags["sort-by"] === 12) return (a["size"] > b["size"] ? -1 : 1);
                    else return 0;

                } else return 1;

            }
        });

        results["urls"].forEach(function(arg, i) {
            console.log(prefix + arg["content-type"] + "\t" + arg["size"] + "\t" + arg["url"]);
        });
    }

    if (flags["print-javascript-errors"] === true) {

        if (flags["silent"] !== true) {

            console.log("");
            console.log("[JavaScript errors]");

        }

        results["javascript-errors"].forEach(function(arg, i) {
            console.log(prefix + arg["url"]);
        });

        if (results["javascript-errors"].length === 0) console.log(prefix + "None");

    }

    if (flags["print-http-errors"] === true) {

        if (flags["silent"] !== true) {

            console.log("");
            console.log("[HTTP errors]");

        }

        if (results["http-errors"].length === 0) console.log(prefix + "None");
        else {

            results["http-errors"].sort(function(a, b) {
                return (a["status-code"] < b["status-code"] ? -1 : 1);
            });

            results["http-errors"].forEach(function(arg, i) {
                console.log(prefix + arg["status-code"] + "\t" + arg["url"]);
            });
        }
    }

    if (flags["print-redirects"] === true) {

        if (flags["silent"] !== true) {

            console.log("");
            console.log("[Redirects]");

        }

        if (results["redirects"].length === 0) console.log(prefix + "None");
        else {

            results["redirects"].sort(function(a, b) {
                return (a["status-code"] < b["status-code"] ? -1 : 1);
            });

            results["redirects"].forEach(function(arg, i) {
                console.log(prefix + arg["status-code"] + "\t" + arg["original-url"] + "\t" + arg["new-url"]);
            });

        }
    }

    function formatWeight(weight) {
        return sizestr = weight + " bytes (" + Math.round(weight/1024) + " KB)";
    }
}

function printError(msg) {
    console.log("Error: " + msg);
    console.log("");
}

function printHelp() {

    console.log("");
    console.log("Usage: phantomjs webutil.js [options] url");
    console.log("\t-b: print weight breakdown by network resources");
    console.log("\t-r: print all redirects");
    console.log("\t-s: print only relevant data (with no summary), works with either -b OR -u specified (and not both)");
    console.log("\t-u: print all retrieved URL's");
    console.log("\t-z: specify a screenshot path");
    console.log("\t-he: print HTTP errors (status code >= 400)");
    console.log("\t-je: print JavaScript errors");
    console.log("\t-ua: specify a user agent");
    console.log("\t-sc: sort by Content Type (only applicable for -b or -u)");
    console.log("\t-sa: sort by size ascending (only applicable for -b or -u)");
    console.log("\t-sd: sort by size descending (only applicable for -b or -u)");
    console.log("");

}

function debug(obj) {
    console.log(JSON.stringify(obj));
}
