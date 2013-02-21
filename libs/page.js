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
            "encodings": {
                "UTF-8": 0,
                "ISO-8859-1": 0,
                "others": 0,
            }
        },
        "total-size": 0,
        "load-time": -1,
        "on-dom-content-loaded": 0,
        "first-byte-time": 0
    },
    fs = require('fs'), startTime = Date.now(),
    title="", count = 0, debug = flags["debug"],
    errors = {"4xx": [], "5xx": [], "js": []},
    tempAssets = {}, assets = {}, serializedAssets = [];

exports.onResourceRequested = function(res) {

    if (debug) helper.log("onResourceRequested: " + JSON.stringify(res));

    var id = res["id"];
    if ((id in tempAssets) === false) tempAssets[id] = {};
    tempAssets[id]["request"] = res;

};

exports.onResourceReceived = function(res) {

    if (debug) helper.log("onResourceReceived: " + JSON.stringify(res));

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

    if (debug) helper.log("onError");

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

    if (debug) helper.log("onInitialized");
    webpage.evaluate(function(domContentLoadedMsg) {
        document.addEventListener("DOMContentLoaded", function() {
              window.callPhantom("DOMContentLoaded");
        }, false);
    });

};

exports.onNavigationRequested = function(url, type, willNavigate, main) {

    if (debug) helper.log("onNavigationRequested");
    startTime = Date.now();

};

exports.onLoadFinished = function(status) {
    if (debug) helper.log("onLoadFinished");
    summary["load-time"] = Date.now() - startTime;
};

exports.onCallback = function(data) {
    if (debug) helper.log("onCallback");
    if (data === "DOMContentLoaded") summary["on-dom-content-loaded"] = Date.now() - startTime;
    title = webpage.evaluate(function() { return document.title; });
};

exports.callback = function(status) {

    if (debug) helper.log("callback with status " + status);

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

        // Get latency for first byte response
        for (var i in serializedAssets) {

            var firstAsset = assets[serializedAssets[i]];
            if (firstAsset["start-response"]["status"] !== 200) continue;

            summary["first-byte-time"] = firstAsset["start-response"]["time"].getTime() - firstAsset["request"]["time"].getTime();
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

                    var matchurl = flags["equivalent-domains"][d].toLowerCase();

                    if (helper.parseURL(assetURL)["host"].indexOf(matchurl) >= 0) {

                        nomatches = false;
                        break;

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

                } else summary["counts"]["encodings"]["others"] += 1;

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
            "js-errors": errors["js"]
        });

        if (flags["screenshot-path"].length > 0) {

            var retval= webpage.render(flags["screenshot-path"]);
            if  (retval === false) print.error("Unable to save screenshot to " + flags["screenshot-path"]);

        }

        if (flags["har-path"].length > 0) {

            har = helper.createHAR(url, title, summary["load-time"], summary["on-dom-content-loaded"], new Date(startTime), assets);
            fs.write(flags["har-path"], JSON.stringify(har), "w");

        }

        print.footer();
        phantom.exit();

    } else {

        print.error("Cannot connect to " + cli["url"]);
        phantom.exit(1);

    }
};


