exports.header = function() {
    if (flags !== undefined && flags["silent"] === true) return;
    console.log("webutil.js 1.0 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>");
}

exports.footer = function() {
    if (flags["silent"] === false) console.log("");
}

exports.results = function(results) {

    var prefix = flags["prefix"];
    var silent = flags["silent"];

    if (silent !== true) {

        console.log("");
        console.log("[Summary]");
        console.log(prefix + "Requests\t" +  + results["urls"].length + " request(s), "
                + formatWeight(results["summary"]["total-size"])
                + ", " + results["redirects"].length + " redirect(s)");
        console.log(prefix + "Resources\t" + formatResources(results["summary"]["counts"]["resources"]));
        console.log(prefix + "\t\t" + formatResources(results["summary"]["counts"]["encodings"]));
        console.log(prefix + "\t\t" + formatResources(results["summary"]["counts"]["compression"]));
        console.log(prefix + "Timing\t\t" + "onDomContentLoaded: " +results["summary"]["on-dom-content-loaded"]
                + "s, onLoad: " + results["summary"]["load-time"] + "s");
        console.log(prefix + "Errors\t\t" + "4xx: " + results["4xx-errors"].length
                + ", 5xx: " + results["5xx-errors"].length
                + ", JS: " + results["js-errors"].length);

    }

    if (flags["print-breakdown"] === true) {

        if (silent !== true) {

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

        if (silent !== true) {

            console.log("");
            console.log("[URLs]");

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

        if (silent !== true) {

            console.log("");
            console.log("[JavaScript errors]");

        }

        results["js-errors"].forEach(function(arg, i) {
            console.log(prefix + JSON.stringify(arg));
        });

        if (results["js-errors"].length === 0) console.log(prefix + "None");

    }

    if (flags["print-http-errors"] === true) {

        if (silent !== true) {

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

        if (silent !== true) {

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

    if (flags["print-har"] === true) {

        if (silent !== true) {

            console.log("");
            console.log("[HAR]");

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

    function formatResources(counts) {

        var retval = [];
        for (var i in counts) retval.push(i + ": " + counts[i]);
        return retval.join(", ");

    }

    function formatWeight(weight) {
        return sizestr = weight + " bytes (" + Math.round(weight/1024) + " KB)";
    }
}

exports.error = function(msg) {
    console.log("Error: " + msg);
    console.log("");
}

exports.help = function() {

    console.log("");
    console.log("Usage: phantomjs webutil.js [options] url");
    console.log("\t-b: print weight breakdown by network resources");
    console.log("\t-d: print data for resources within the same domain only (exception is load time)");
    console.log("\t-r: print all redirects");
    console.log("\t-s: print only relevant data (with no summary), works with either -b OR -u specified (and not both)");
    console.log("\t-u: print all retrieved URL's");
    console.log("\t-z: specify a screenshot path");
    console.log("\t-he: print HTTP errors (status code >= 400)");
    console.log("\t-je: print JavaScript errors");
    console.log("\t-sc: sort by Content Type (only applicable for -b or -u)");
    console.log("\t-sa: sort by size ascending (only applicable for -b or -u)");
    console.log("\t-sd: sort by size descending (only applicable for -b or -u)");
    console.log("\t-ua: specify a user agent");
//    console.log("\t-har: pretty print HAR based timeline");
    console.log("\t-username: username for HTTP authentication");
    console.log("\t-password: password for HTTP authentication");
    console.log("");

}

exports.debug = function(obj) {
    console.log(JSON.stringify(obj));
}
