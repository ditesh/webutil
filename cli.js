var system = require("system"),
    skip = false;

exports.parse = function() {

    var flags = {
        "prefix": "\t\t",
        "sort-by": 0,
        "silent": false,
        "screenshot": false,
        "print-urls": false,
        "same-domain": false,
        "print-har": false,
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

                if (i+1 >= system.args.length) {

                    print.help();
                    phantom.exit(1);

                }

                var arg = system.args[i+1];

                if (arg.charAt(0) === "-") {

                    print.help();
                    phantom.exit(1);

                }

                page.settings.userAgent = system.args[i+1];

            } else if (arg === "-z") {

                skip = true;

                if (i+1 >= system.args.length) {

                    print.help();
                    phantom.exit(1);

                }

                var arg = system.args[i+1];

                if (arg.charAt(0) === "-") {

                    print.help();
                    phantom.exit(1);

                }

                flags["screenshot"] = true;
                flags["screenshot-path"] = system.args[i+1];

            } else if (arg === "-username") {

                skip = true;

                if (i+1 >= system.args.length) {

                    print.help();
                    phantom.exit(1);

                }

                var arg = system.args[i+1];

                if (arg.charAt(0) === "-") {

                    print.help();
                    phantom.exit(1);

                }

                page.settings.userName = system.args[i+1];

            } else if (arg === "-password") {

                skip = true;

                if (i+1 >= system.args.length) {

                    print.help();
                    phantom.exit(1);

                }

                var arg = system.args[i+1];

                if (arg.charAt(0) === "-") {

                    print.help();
                    phantom.exit(1);

                }

                page.settings.password = system.args[i+1];



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
            else if (i > 0) url = arg.trim();

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

    if (("host" in url) === false) url = "http://" +url["path"];
    else url = url["scheme"] + "://" + url["host"] + url["path"];

    return {
        "url": url,
        "flags": flags
    };
}
