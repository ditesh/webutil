var system = require("system"),
    skip = false;

exports.parse = function() {

    var flags = {
        "prefix": "\t\t",
        "sort-by": 0,
        "silent": false,
        "print-har": false,
        "cache-retries": 0,
        "screenshot": false,
        "print-urls": false,
        "same-domain": false,
        "equivalent-domains": [],
        "print-breakdown": false,
        "print-redirects": false,
        "print-http-errors": false,
        "print-javascript-errors": false,
        "screenshot-path": "/tmp/screenshot.png",
    };

    if (system.args.length === 1) {

        print.header();
        print.help();
        phantom.exit(1);

    } else {

        system.args.forEach(function (arg, i) {

            if (skip === true) skip = false;
            else if (arg === "-h") {

                print.header();
                print.help();
                phantom.exit();

            } else if (arg === "-ua") {

                skip = true;
                arg = parseArg(i);

                if (arg === "ipad") arg = "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10";
                else if (arg === "iphone") arg = "Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3";
                else if (arg === "android") arg = "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
                else if (arg === "chrome") arg = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17";
                else if (arg === "firefox") arg = "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:15.0) Gecko/20100101 Firefox/15.0.1";
                else if (arg === "ie" || arg === "ie10") arg = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
                else if (arg === "ie9") arg = "Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))";
                else if (arg === "ie8") arg = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)";
                else if (arg === "ie7") arg = "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 6.0)";

                page.settings.userAgent = arg;

            } else if (arg === "-z") {

                skip = true;
                arg = parseArg(i);

                flags["screenshot"] = true;
                flags["screenshot-path"] = arg;

            } else if (arg === "-username") {

                skip = true;
                arg = parseArg(i);
                page.settings.userName = arg;

            } else if (arg === "-password") {

                skip = true;
                arg = parseArg(i);
                page.settings.password = arg;

            } else if (arg === "-dd") {

                skip = true;
                arg = parseArg(i);
                flags["equivalent-domains"] = arg.split(",");

            } else if (arg === "-c") {

                skip = true;
                arg = parseArg(i);
                var narg = parseInt(arg);

                if (isNaN(narg) === true) {

                    print.help();
                    phantom.exit(1);

                }

                flags["cache-retries"] = narg;

            } else if (arg === "-s") {

                flags["prefix"] = "";
                flags["silent"] = true;

            } else if (arg === "-sa") flags["sort-by"] |= 2;
            else if (arg === "-sd") flags["sort-by"] |= 4;
            else if (arg === "-sc") flags["sort-by"] |= 8;
//            else if (arg === "-har") flags["print-har"] = true;
            else if (arg === "-he") flags["print-http-errors"] = true;
            else if (arg === "-je") flags["print-javascript-errors"] = true;
            else if (arg === "-u") flags["print-urls"] = true;
            else if (arg === "-b") flags["print-breakdown"] = true;
            else if (arg === "-r") flags["print-redirects"] = true;
            else if (arg === "-d") flags["same-domain"] = true;
            else if (arg.charAt(0) !== "-" && i > 0) url = arg.trim();

        });
    }

    var testflag = 0;
    if (flags["print-urls"] === true) testflag += 1;
    if (flags["print-breakdown"] === true) testflag += 1;
    if (flags["print-http-errors"] === true) testflag += 1;
    if (flags["print-javascript-errors"] === true) testflag += 1;

    if (url === undefined || (flags["silent"] === true && testflag > 2)) {

        flags["silent"] = false;

        print.header();
        print.help();
        phantom.exit(1);

    }

    // Auto correct protocol-less domains
    var url = helper.parse_url(url);

    if (url["path"] === undefined) url["path"] = "";
    if (("host" in url) === false) {
        
        url["host"] = url["path"];
        url["path"] = "";

    }

    if (("scheme" in url) === false) url["scheme"] = "http";
    
    url["host"] = url["host"].toLowerCase();

    if (flags["equivalent-domains"].length > 0) flags["equivalent-domains"].push(url["host"]);

    return {
        "url": url["scheme"] + "://" + url["host"] + url["path"],
        "url-parts": url,
        "flags": flags
    };
}

function parseArg(i) {

    if (i+1 >= system.args.length) {

        print.help();
        phantom.exit(1);

    }

    var arg = system.args[i+1];

    if (arg.charAt(0) === "-") {

        print.help();
        phantom.exit(1);

    }

    return arg;

}
