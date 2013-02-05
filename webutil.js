var fs = require('fs');

var print = require("./print"), helper = require("./helper"),
    page = require("webpage").create(), cli = require("./cli").parse(),
    startTime = Date.now(), assets = [], flags = cli["flags"],
    errors = {"4xx": [], "5xx": [], "js": []}, 
    summary = {
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
        "load-time": 0,
        "on-dom-content-loaded": 0
    };

print.header();

var count = 0;
var pagecb = function(status) {

    count += 1;
    if (count > flags["cache-retries"]) callback(status);
    else {

        assets = [];
        startTime = Date.now();
        page.open(cli["url"], pagecb);

    }

};

var callback = function(status) {

    if (status === "success") {

        var har = {}, types = {}, urls = [], url = cli["url-parts"], redirects = [], breakdown = {};
        summary["load-time"] = Math.round((Date.now() - startTime)/10)/100;

        for (var i in assets) {

            var asset = assets[i];
            var assetURL = asset["url"];
            var statusCode = assets[i]["status"];

            if (asset["stage"] === "start") {

                if (flags["same-domain"] === true) {

                    if (helper.parse_url(assetURL)["host"] !== url["host"]) continue;

                } else if (flags["equivalent-domains"].length > 0) {

                    var nomatches = true;

                    for (var d in flags["equivalent-domains"]) {

                        var matchurl = flags["equivalent-domains"][d].toLowerCase();

                        if (helper.parse_url(assetURL)["host"].indexOf(matchurl) >= 0) {

                            nomatches = false;
                            break;

                        }
                    }

                    if (nomatches === true) continue;
                }

                var type = asset["contentType"].toLowerCase();

                if (statusCode >= 400 && statusCode < 500) {

                    errors["4xx"].push({
                        "url": assetURL,
                        "status-code": statusCode,
                    });

                } else {

                    var offset = type.indexOf(";")

                    urls.push({
                        
                        "url": assetURL,
                        "content-type": (offset > 0) ? type.substr(0, offset) : type,
                        "size": asset["bodySize"],

                    });

                    summary["total-size"] += asset["bodySize"];

                    if (asset["redirectURL"] !== null) {
                        
                        redirects.push({
                            "original-url": assetURL,
                            "status-code": asset["status"],
                            "new-url": asset["redirectURL"],
                        });
                    }

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
                    breakdown[type]["size"] += asset["bodySize"];

                    var compressed = false;

                    for (var i in asset["headers"]) {

                        var header = asset["headers"][i];
                        if (header["name"] === "Content-Encoding") compressed = true;

                    }

                    if (compressed === true) summary["counts"]["compression"]["not-compressed"] += 1;
                    else summary["counts"]["compression"]["compressed"] += 1;

                }

            } else {

                if (statusCode >= 500) {

                    errors["5xx"].push({
                        "url": assetURL,
                        "status-code": statusCode,
                    });

                }
            }
        }

        print.results({
            "har": har,
            "urls": urls,
            "summary": summary,
            "redirects": redirects,
            "breakdown": breakdown,
            "4xx-errors": errors["4xx"],
            "5xx-errors": errors["5xx"],
            "http-errors": errors["4xx"].concat(errors["5xx"]),
            "js-errors": errors["js"]
        });

        if (flags["screenshot"] === true) {

            var retval= page.render(flags["screenshot-path"]);
            if  (retval === false) print.error("Unable to save screenshot to " + flags["screenshot-path"]);

        }

        print.footer();
        phantom.exit();

    } else {

        print.error("Cannot connect to " + cli["url"]);
        phantom.exit(1);

    }
};

page.onResourceReceived = function(res) {
    assets.push(res);
};

page.onError = function(msg, trace) {
    console.log(msg);
    errors["js"].push(msg);
};

page.onInitialized = function() {
    page.evaluate(function(domContentLoadedMsg) {
        document.addEventListener("DOMContentLoaded", function() {
              window.callPhantom("DOMContentLoaded");
        }, false);
    });
};

page.onCallback = function(data) {
    if (data === "DOMContentLoaded") summary["on-dom-content-loaded"] = Math.round((Date.now() - startTime)/10)/100;
};


page.open(cli["url"], pagecb);
