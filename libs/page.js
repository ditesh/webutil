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

var summary = {
        "counts": {
            "resources": {
                "HTML": 0,
                "CSS": 0,
                "JS": 0,
                "images": 0,
                "others": 0,
            },
            "compression": {
                "compressed": 0,
                "not-compressed": 0,
            },
            "encryption": {
                "encrypted": 0,
                "not-encrypted": 0,
            },
            "encodings": {
                "UTF-8": 0,
                "ISO-8859-1": 0,
                "others": 0,
                "not-specified": 0,
            }
        },
        "total-size": 0,
        "timings": {
            "first-byte": 0,
            "on-dom-content-loaded": 0,
            "on-load": -1,
            "fully-loaded": -1,
        },
    },
    title="", count = 0, debug = flags["debug"],
    errors = {"4xx": [], "5xx": [], "js": []},
    fs = require('fs'), startTime = -1, loadFinished = false,
    tempAssets = {}, assets = {}, serializedAssets = [], snifferOutput = [];

var firstbyte = false;

exports.onResourceRequested = function(res) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("onResourceRequested: ") + JSON.stringify(res));

    var id = res["id"];
    if ((id in tempAssets) === false) tempAssets[id] = {};
    tempAssets[id]["request"] = res;

};

exports.onResourceReceived = function(res) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("onResourceReceived: ") + JSON.stringify(res));

    var id = res["id"]
    if (res["stage"] === "start") tempAssets[id]["start-response"] = res;
    else {

        if ((id in assets) === false) assets[id] = {};

        assets[id]["request"] = tempAssets[id]["request"];
        assets[id]["start-response"] = tempAssets[id]["start-response"];
        delete tempAssets[id];


        if (assets[id]["start-response"] === undefined) {

            assets[id]["start-response"] = res;
            if (("bodySize" in assets[id]["start-response"]) === false) assets[id]["start-response"]["bodySize"] = 0;

        }

        assets[id]["end-response"] = res;
        serializedAssets.push(id);

    }
};

exports.onError = function(msg, trace) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("onError"));

    // Log errors in the webutil codebase to stdout
    if (trace.length > 0 && trace[0]["file"].substr(0, 4) !== "http") {
        
        if (flags["silent"] !== true) console.log("BUG in webutil, dumping stack trace and exiting");
        console.log(msg);
        console.log(JSON.stringify(trace));
        console.log();
        phantom.exit(1);

    } else errors["js"].push(msg);

};

exports.onInitialized = function() {

    webpage.evaluate(function(domContentLoadedMsg) {
        document.addEventListener("DOMContentLoaded", function() {
              window.callPhantom("DOMContentLoaded");
        }, false);
    });

};

exports.onNavigationRequested = function(url, type, willNavigate, main) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("onNavigationRequested"));
    if (main === true) startTime = Date.now();

};

exports.onLoadStarted = function() {};
exports.onConsoleMessage = function(msg) {
//    helper.log(msg);
};

exports.onLoadFinished = function(status) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("onLoadFinished"));

    summary["timings"]["on-load"] = Date.now() - startTime;

    if (flags["sniff"] === true) {

        webpage.injectJs("resources/jquery-1.9.1.min.js");
        var sniffed = webpage.evaluate(sniffer.sniff);

        for (var i in sniffed) {

            var datum = {}, res = data[i];
            datum["version"] = sniffed[i];

            if (res === undefined) { datum["name"] = i; helper.log(i); }
            else datum["name"] = res["name"];

            snifferOutput.push(datum);

        }
    }
};

exports.onCallback = function(data) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("onCallback"));
    if (data === "DOMContentLoaded") summary["timings"]["on-dom-content-loaded"] = Date.now() - startTime;
    title = webpage.evaluate(function() { return document.title; });

};

exports.callback = function(status) {

    if (debug) helper.log(helper.title(new Date()) + " " + helper.subheader("Callback with status: ") + status);

    count += 1;
    if (count > flags["cache-retries"]) {
        
        // onLoad event has fired
        var assetlen = assets.length;
        var flcount = 0;

        // Check if page has been fully loaded
        // It does this by checking if there has been network activity
        // Maxes out at 10 * fully-loaded interval check
        var id = setInterval(function() {

            if (assets.length === assetlen || flcount > 10) {

                clearInterval(id);
                callback(status);

            } else flcount += 1;

        }, flags["fully-loaded"]*1000);

    } else {

        assets = {}, serializedAssets = [], startTime = Date.now();
        webpage.open(cli["url"], this);

    }
};

var callback = function(status) {

    if (status === "success") {

        var types = {}, urls = [], url = cli["url-parts"], redirects = [], breakdown = {};

        // Get fully loaded timing
        summary["timings"]["fully-loaded"]  = Date.now() - startTime;

        // Get latency for first byte response
        var firstAsset = assets[serializedAssets[0]];

        for (var i in serializedAssets) {

            var firstAsset = assets[serializedAssets[i]];
            if (firstAsset["start-response"]["status"] !== 200) continue;

            summary["timings"]["first-byte"] = firstAsset["start-response"]["time"].getTime() - firstAsset["request"]["time"].getTime();
            break;

        }

        for (var i in serializedAssets) {

            var asset = assets[serializedAssets[i]];

            // A hack for when no "end-response" is received
            // Seems to only happen intermittently with 301 redirects
            if (("end-response" in asset) === false) asset["end-response"] = asset["start-response"];

            var assetURL = asset["end-response"]["url"];
            var statusCode = asset["end-response"]["status"];
            var headers = asset["end-response"]["headers"];

            if (flags["same-domain"] === true) {

                if (helper.parseURL(assetURL)["host"] !== url["host"]) continue;

            } else if (flags["equivalent-domains"].length > 0) {

                var nomatches = true;

                for (var d in flags["equivalent-domains"]) {

                    if (flags["equivalent-domains"].hasOwnProperty(d)) {

                        var matchurl = flags["equivalent-domains"][d].toLowerCase();
                        var parsedURL = helper.parseURL(assetURL);

                        if ("host" in parsedURL && parsedURL["host"].indexOf(matchurl) >= 0) {

                            nomatches = false;
                            break;

                        }
                    }
                }

                if (nomatches === true) continue;
            }

            if (statusCode >= 400 && statusCode < 500) {

                errors["4xx"].push({
                    "url": assetURL,
                    "status-code": statusCode,
                });

            } else if (statusCode >= 500) {

                errors["5xx"].push({
                    "url": assetURL,
                    "status-code": statusCode,
                });

                continue;

            } else if (statusCode >= 300 && statusCode < 400) {

                    var newurl = asset["end-response"]["redirectURL"];
                    if (newurl === null) {

                        for (var i in headers) {

                            if (headers[i]["name"] === "Location")  {

                                newurl = headers["value"];
                                break;

                            }
                        }
                    }

                    redirects.push({
                        "original-url": assetURL,
                        "status-code": statusCode,
                        "new-url": newurl
                    });

            } else {

                var type = asset["start-response"]["contentType"];

                if (type === null) type = "";
                type = type.toLowerCase();

                var offset = type.indexOf(";")

                urls.push({
                    
                    "id": asset["request"]["id"],
                    "url": assetURL,
                    "content-type": (offset > 0) ? type.substr(0, offset) : type,
                    "size": (asset["start-response"]["bodySize"] !== null) ? asset["start-response"]["bodySize"] : 0,

                });

                summary["total-size"] += asset["start-response"]["bodySize"];

                if (offset > 0) {

                    var charset = type.split("charset=")

                    if (charset.length != 2) charset = "others";
                    else {

                        charset = charset[1].split(" ");
                        charset = charset[0].toLowerCase();

                    }

                    if (charset === "utf-8") summary["counts"]["encodings"]["UTF-8"] += 1;
                    else if (charset === "iso-8859-1") summary["counts"]["encodings"]["ISO-8859-1"] += 1;
                    else summary["counts"]["encodings"]["others"] += 1;

                    type = type.substr(0, offset);

                } else summary["counts"]["encodings"]["not-specified"] += 1;

                if (type === null) type = "unspecified", summary["counts"]["resources"]["others"] += 1;
                else if (type.trim().length === 0) type = "unspecified", summary["counts"]["resources"]["others"] += 1;
                else if (type.match(/gif/) !== null) type = "GIF", summary["counts"]["resources"]["images"] += 1;
                else if (type.match(/png/) !== null) type = "PNG", summary["counts"]["resources"]["images"] += 1;
                else if (type.match(/jpeg/) !== null) type = "JPG", summary["counts"]["resources"]["images"] += 1;
                else if (type.match(/css/) !== null) type = "CSS", summary["counts"]["resources"]["CSS"] += 1;
                else if (type.match(/html/) !== null) type = "HTML", summary["counts"]["resources"]["HTML"] += 1;
                else if (type.match(/xml/) !== null) type = "XML", summary["counts"]["resources"]["others"] += 1;
                else if (type.match(/plain/) !== null) type = "Text", summary["counts"]["resources"]["others"] += 1;
                else if (type.match(/javascript/) !== null) type = "JS", summary["counts"]["resources"]["JS"] += 1;
                else type = "Others", summary["counts"]["resources"]["others"] += 1;

                if ((type in breakdown) === false) breakdown[type] = { count: 0, size: 0};
                breakdown[type]["count"] += 1;
                breakdown[type]["size"] += asset["start-response"]["bodySize"];

                var compressed = false;

                for (var i in headers) if (headers[i]["name"] === "Content-Encoding") compressed = true;

                if (compressed === true) summary["counts"]["compression"]["not-compressed"] += 1;
                else summary["counts"]["compression"]["compressed"] += 1;

                if (assetURL.length >= 5 && assetURL.substr(0, 5) === "https") summary["counts"]["encryption"]["encrypted"] += 1;
                else summary["counts"]["encryption"]["not-encrypted"] += 1;

            }
        }

        print.results({
            "urls": urls,
            "summary": summary,
            "redirects": redirects,
            "breakdown": breakdown,
            "4xx-errors": errors["4xx"],
            "5xx-errors": errors["5xx"],
            "http-errors": errors["4xx"].concat(errors["5xx"]),
            "js-errors": errors["js"],
            "sniffer-output": snifferOutput
        });

        if (flags["screenshot-path"].length > 0) {

            var retval= webpage.render(flags["screenshot-path"]);
            if  (retval === false) print.error("Unable to save screenshot to " + flags["screenshot-path"]);

        }

        if (flags["asset-path"].length > 0) {

            fs.write(flags["asset-path"]+"/serialized-assets.json", JSON.stringify(serializedAssets), "w");
            fs.write(flags["asset-path"]+"/assets.json", JSON.stringify(assets), "w");

        }

        if (flags["har-path"].length > 0) {

            var har = helper.createHAR({
                url: url,
                title: title
            }, {
                "on-load-time": summary["timings"]["on-load"],
                "on-content-loaded-time": summary["timings"]["on-dom-content-loaded"],
                "start-time": new Date(startTime)
            }, {
                "assets": assets,
                "serialized-assets": serializedAssets
            });
            fs.write(flags["har-path"], JSON.stringify(har), "w");

        }

        print.footer();
        phantom.exit();

    } else {

        print.error("Cannot connect to " + cli["url"]);
        phantom.exit(1);

    }
};


