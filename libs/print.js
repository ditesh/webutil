exports.header = function() {
    if (flags !== undefined && flags["silent"] === true) return;
    console.log(helper.title("webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>"));
};

exports.footer = function() {
    if (flags["silent"] === false) console.log("");
};

exports.results = function(results) {

    var prefix = flags["prefix"];
    var silent = flags["silent"];

    if (silent !== true) {

        print.header();
        console.log("");
        console.log(helper.header("Summary"));
        console.log(prefix + helper.subheader("Requests") + "\t" +  + results["urls"].length + " request(s), "
                + formatWeight(results["summary"]["total-size"])
                + ", " + results["redirects"].length + " redirect(s)");
        console.log(prefix + helper.subheader("Resources") + "\t" + formatResources(results["summary"]["counts"]["resources"]));
        console.log(prefix + "\t\t" + formatResources(results["summary"]["counts"]["encodings"]));
        console.log(prefix + "\t\t" + formatResources(results["summary"]["counts"]["compression"]));
        console.log(prefix + "\t\t" + formatResources(results["summary"]["counts"]["encryption"]));
        console.log(prefix + helper.subheader("Timing") + "\t\t" + "first byte: " + results["summary"]["first-byte-time"]
                + " ms, onDOMContentLoaded: " +results["summary"]["on-dom-content-loaded"]
                + " ms, onLoad: " + results["summary"]["load-time"] + " ms");
        console.log(prefix + helper.subheader("Errors") + "\t\t" + "4xx: " + results["4xx-errors"].length
                + ", 5xx: " + results["5xx-errors"].length
                + ", JS: " + results["js-errors"].length);

    }

    if (flags["print-breakdown"] === true) {

        if (silent !== true) {

            console.log("");
            console.log(helper.header("Breakdown"));

        }

        for (var i in results["breakdown"]) {

            var size = formatWeight(results["breakdown"][i]["size"]);
            var count = results["breakdown"][i]["count"];

            if (count === 1) console.log(prefix + helper.subheader(i) + "\t\t  " + count + " file \t"+ size);
            else {
                
                if (count < 10) console.log(prefix + helper.subheader(i) + "\t\t  " + count + " files\t"+ size);
                else if (count < 100) console.log(prefix + helper.subheader(i) + "\t\t " + count + " files\t"+ size);
                else console.log(prefix + helper.subheader(i) + "\t\t" + count + " files\t"+ size);

            }
        }
    }

    if (flags["print-urls"] === true) {

        if (silent !== true) {

            console.log("");
            console.log(helper.header("URI's"));

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
            console.log(helper.header("JavaScript errors"));

        }

        results["js-errors"].forEach(function(arg, i) {
            console.log(prefix + JSON.stringify(arg));
        });

        if (results["js-errors"].length === 0) console.log(prefix + "None");

    }

    if (flags["sniff"] === true) {

        if (silent !== true) {

            console.log("");
            console.log(helper.header("Detected Libraries and Frameworks"));

        }

        results["sniffer-output"].forEach(function(arg, i) {
            console.log(prefix + "o " + arg["name"] + " " + arg["version"]);
        });

        if (results["sniffer-output"].length === 0) console.log(prefix + "None");

    }

    if (flags["print-http-errors"] === true) {

        if (silent !== true) {

            console.log("");
            console.log(helper.header("HTTP errors"));

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
            console.log(helper.header("Redirects"));

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
};

exports.error = function(msg) {
    console.log("Error: " + msg);
    console.log("");
};

exports.help = function() {

    console.log("");
    console.log("Usage: phantomjs webutil.js [options] url");
    console.log("\t-b: print weight breakdown by network resources");
    console.log("\t-c: reload specified number of times (eg -c 2 loads the page 3 times)");
    console.log("\t-d: print data for resources within the same domain only (exception is load time)");
    console.log("\t-r: print all redirects");
    console.log("\t-s: print only relevant data (with no summary), works with either -b OR -u specified (and not both)");
    console.log("\t-u: print all retrieved URL's");
    console.log("\t-z: specify screenshot path");
    console.log("\t-dd: specify keywords for 'same domain' matches");
    console.log("\t-fl: specify fully loaded state interval check (defaults to 2 second checks)");
    console.log("\t-he: print HTTP errors (status code >= 400)");
    console.log("\t-je: print JavaScript errors");
    console.log("\t-sc: sort by Content Type (only applicable for -b or -u)");
    console.log("\t-sa: sort by size ascending (only applicable for -b or -u)");
    console.log("\t-sd: sort by size descending (only applicable for -b or -u)");
    console.log("\t-ua: specify user agent");
    console.log("\t-har: specify HAR filename");
    console.log("\t-debug: enable debugging (default false)");
    console.log("\t-sniffer: print all libraries and CMS's detected");
    console.log("\t-timeout: specify timeout in seconds (default 30 seconds)");
    console.log("\t-username: specify username for HTTP authentication");
    console.log("\t-password: specify password for HTTP authentication");
    console.log("\t-cookies-path: specify path to cookies file to be added to the request");
    console.log("");

};

exports.debug = function(obj) {
    console.log(JSON.stringify(obj));
};
