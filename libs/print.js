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

exports.header = function() {
    console.log(helper.title("webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>"));
};

exports.footer = function() {
    console.log("");
};

exports.results = function(results) {

    var prefix = flags["prefix"];

    if ((flags["json"] === null) || (flags["json"] === false && (flags["print-breakdown"] || flags["list-compressed"] || flags["list-charsets"]
            || flags["list-secure"] || flags["list-urls"] || flags["print-http-errors"] || flags["print-javascript-errors"]
            || flags["sniff"] || flags["print-redirects"]))) {
        
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
            console.log(prefix + helper.subheader("Timing") + "\t\t" + "first byte: " + results["summary"]["timings"]["first-byte"]
                    + " ms, onDOMContentLoaded: " +results["summary"]["timings"]["on-dom-content-loaded"]
                    + " ms, onLoad: " + results["summary"]["timings"]["on-load"]
                    + " ms, fully loaded: " + results["summary"]["timings"]["fully-loaded"] + " ms");
            console.log(prefix + helper.subheader("Errors") + "\t\t" + "4xx: " + results["errors"]["4xx"].length
                    + ", 5xx: " + results["errors"]["5xx"].length
                    + ", JS: " + results["errors"]["js"].length);

    } else if (flags["json"] === true && !(flags["print-breakdown"] || flags["list-compressed"] || flags["list-charsets"]
            || flags["list-secure"] || flags["list-urls"] || flags["print-http-errors"] || flags["print-javascript-errors"]
            || flags["sniff"] || flags["print-redirects"])) {

        helper.log({
            "summary": results["summary"],
            "errors": results["errors"],
            "urls": results["urls"]
        });

        return;

    }




    if (flags["print-breakdown"] === true) {

        if (flags["json"] === true) {
            
            helper.log(results["breakdown"]);
            return;

        } else {

            console.log("");
            console.log(helper.header("Breakdown"));

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
    }

    if (flags["list-compressed"] === true) {

        if (flags["json"] === true) helper.log(results["urls"]);
        else {

            console.log("");
            console.log(helper.header("URI's (Compressed)"));

            // Two individual for loops may not be the best approach,
            // but for small n's, its good enough
            results["urls"].forEach(function(arg, i) {
                if (arg["compressed"] === true) console.log(prefix + "\t" + arg["url"]);
            });

            console.log("");
            console.log(helper.header("URI's (Not Compressed)"));

            // Two individual for loops may not be the best approach,
            // but for small n's, its good enough
            results["urls"].forEach(function(arg, i) {
                if (arg["compressed"] === false) console.log(prefix + "\t" + arg["url"]);
            });

        }
    }

    if (flags["list-charsets"] === true) {

        if (flags["json"] === true) helper.log(results["urls"]);
        else {

            var charsets = {};
            console.log("");

            results["urls"].forEach(function(arg, i) {

                if (arg["charset"] === "") arg["charset"] = "not specified";

                if ((arg["charset"] in charsets) === false) charsets[arg["charset"]] = [];
                charsets[arg["charset"]].push(arg["url"]);

            });

            for (var charset in charsets) {

                console.log(helper.header("Charset ("+charset+")"));
                charsets[charset].forEach(function(url) {
                    console.log(prefix + "\t" + url);
                });
                console.log("");

            }
        }
    }

    if (flags["list-secure"] === true) {

        if (flags["json"] === true) helper.log(results["urls"]);
        else {

            console.log("");
            console.log(helper.header("URI's (Encrypted)"));


            // Two individual for loops may not be the best approach,
            // but for small n's, its good enough
            var noneflag = true;
            results["urls"].forEach(function(arg, i) {
                if (arg["secure"] === true) {
                    
                    noneflag = false;
                    console.log(prefix + "\t" + arg["url"]);

                }
            });

            if (noneflag === true) console.log(prefix + "None");

            console.log("");
            console.log(helper.header("URI's (Not Encrypted)"));

            noneflag = true;
            results["urls"].forEach(function(arg, i) {
                if (arg["secure"] === false) {
                    
                    noneflag = false;
                    console.log(prefix + "\t" + arg["url"]);

                }
            });

            if (noneflag === true) console.log(prefix + "None");

        }
    }

    if (flags["list-urls"] === true) {

        if (flags["json"] === true) helper.log(results["urls"]);
        else {

            if (flags["silent"] === false) {

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
    }

    if (flags["print-javascript-errors"] === true) {

        if (flags["json"] === true) helper.log(results["errors"]["js"]);
        else {


            console.log("");
            console.log(helper.header("JavaScript errors"));

            results["errors"]["js"].forEach(function(arg, i) {
                console.log(prefix + JSON.stringify(arg));
            });

            if (results["errors"]["js"].length === 0) console.log(prefix + "None");

        }
    }

    if (flags["sniff"] === true) {

        if (flags["json"] === true) helper.log(results["sniffer"]);
        else {

            console.log("");
            console.log(helper.header("Detected Libraries and Frameworks"));

            results["sniffer"].forEach(function(arg, i) {
                console.log(prefix + "o " + arg["name"] + " " + arg["version"]);
            });

            if (results["sniffer"].length === 0) console.log(prefix + "None");

        }
    }

    if (flags["print-http-errors"] === true) {

        if (flags["json"] === true) helper.log(results["errors"]["http"]);
        else {

            console.log("");
            console.log(helper.header("HTTP errors"));

            if (results["errors"]["http"].length === 0) console.log(prefix + "None");
            else {

                results["errors"]["http"].sort(function(a, b) {
                    return (a["status-code"] < b["status-code"] ? -1 : 1);
                });

                results["errors"]["http"].forEach(function(arg, i) {
                    console.log(prefix + arg["status-code"] + "\t" + arg["url"]);
                });
            }
        }
    }

    if (flags["print-redirects"] === true) {

        if (flags["json"] === true) helper.log(results["redirects"]);
        else {

            console.log("");
            console.log(helper.header("Redirects"));

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
    console.log("\t-s: silent mode (only applicable for -lu)");
    console.log("\t-z: specify screenshot path");
    console.log("\t-dd: specify keywords for 'same domain' matches");
    console.log("\t-fl: specify fully loaded state interval check (defaults to 2 second checks)");
    console.log("\t-he: print HTTP errors (status code >= 400)");
    console.log("\t-je: print JavaScript errors");
    console.log("\t-lc: list all retrieved URL's by compression status");
    console.log("\t-le: list all retrieved URL's by charsets");
    console.log("\t-ls: list all retrieved URL's by encrypted state");
    console.log("\t-lu: list all retrieved URL's");
    console.log("\t-sc: sort by Content Type (only applicable for -b or -lu in plain text output)");
    console.log("\t-sa: sort by size ascending (only applicable for -b or -lu in plain text output)");
    console.log("\t-sd: sort by size descending (only applicable for -b or -lu in plain text output)");
    console.log("\t-ua: specify user agent");
    console.log("\t-har: specify HAR filename");
    console.log("\t-debug: enable debugging");
    console.log("\t-json: JSON output");
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
