"use strict"

exports.Headers = function() {

    var self = this;

    var syntax = {

        uri: /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
        token: /(?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?)/i,
        quoted_string: /(?:"(?:[ \t\x21\x23-\x5B\x5D-\x7E]|\\[ \t\x21-\x7E])*")/i,
        parameter: /(?:(?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?)(?:\s*=\s*(?:(?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?)|(?:"(?:[ \t\x21\x23-\x5B\x5D-\x7E]|\\[ \t\x21-\x7E])*")))?)/i

    };

    var reasons = {
        "positive-integer-expected": "Invalid value (positive integer expected)",
        "invalid-status-for-method": "Invalid HTTP response status code for method",
        "invalid-date-format": "Invalid date format",
        "invalid-uri": "Invalid URI format",
        "syntax-error": "Syntax error parsing header",
        "non-gzip-encoding": "Non gzip encoding",
        "missing-dependent-header": "A dependent header is missing",
        "invalid-charset": "Invalid character set",
        "invalid-value": "Invalid header value",
        "deprecated": "Header has been deprecated",
        "not-found": "Header was not found",
        "ignored": "Custom header, ignored",
        "ok": "Header is OK"
    };

    this.parse = function(response) {

        var retval = {};
        var headers = response["headers"];
        
        for (var i in headers) {

            var header = headers[i];
            var name = header["name"].toLowerCase().replace(/-/g, "_");
            var value = header["value"].toLowerCase().trim();

            if (name.substr(0, 2) === "x_") retval[name] = "ignored";
            else if ((name in self) === false) {
                
                helper.log("Missing header " + name);
                retval[name] = false;

            } else {
                
                retval[name] = self[name](value, response);
                if (retval[name] !== "ok") helper.log(name + " is fubaring with reason " + retval[name] + " with value " + value);

            }

        }

        return retval;

    };

    this.accept_ranges = function(value, response) {

        if (value !== "bytes" && value !== "none") return "invalid-value";
        return "ok";

    };

    this.access_control_allow_origin = function(value, response) {

        if (value === "*") return "ok";
        if (syntax.uri.test(value) === false) return "invalid-uri";
        return "ok";

    };

    this.access_control_allow_methods = function(value, response) {
        return "ok";
    };

    this.access_control_max_age = function(value, response) {

        if (isNaN(value)) return "positive-integer-expected";

        value = parseInt(value);
        if (value < 0) return "positive-integer-expected";

        return "ok";

    };

    this.age = function(value, response) {

        if (isNaN(value)) return "positive-integer-expected";

        value = parseInt(value);
        if (value < 0) return "positive-integer-expected";

        return "ok";

    };

    this.allow = function(value, response) {

//        if (self.syntax.token.test(value) === false) return reasons["invalid-value"];
        return "ok";

    };

    this.cache_control = function(value, response) {

//        if (this.syntax.parameter.test(value) === false) return reasons["invalid-value"];

        var values = value.split(",");

        for (var i in values) {

            value = values[i].trim();
            value = value.split("=");

            if (value.length === 1) return "ok";

            if (value[0] === "max-age" || value[0] === "s-maxage")
                if (isNaN(value[1])) return "positive-integer-expected";

        }

        return "ok";

    };

    this.connection = function(value, response) {

        if ((value in ["keep-alive", "close"]) === false) "invalid-value";
        return "ok";

    };

    this.content_base = function(value, response) {
        return "deprecated";
    }

    this.content_disposition = function(value, response) {

//        var regex = /?:?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?(?:\s*;\s*?:?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?(?:\s*=\s*(?:?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?|?:"(?:[ \t\x21\x23-\x5B\x5D-\x7E]|\\[ \t\x21-\x7E])*"))?)*/

  //      if (regex.test(value) === false) return reasons["invalid-value"];

        value = value.split(";")
        if (value[0] !== "inline" && value[0] !== "attachment") return "invalid-value";

        if (value.length > 1) {

            value = value[1].trim().split("=");
            if (value[0] !== "filename") return "invalid-value";

            if (value[1].indexOf("%") >= 0) return "invalid-value";
            if (value[1].indexOf("/") >= 0) return "invalid-value";
            if (value[1].indexOf('\\') >= 0) return "invalid-value";

        }

        return "ok";

    };

    this.content_encoding = function(value, response) {

//        if (this.syntax.token.test(value)) return reasons["invalid-value"];
        if (value !== "gzip") return "non-gzip-encoding";
        return "ok";

    };

    this.content_length = function(value, response) {

        // Skipping regex check as the check is handled by isNaN()
        if (isNaN(value)) return "positive-integer-expected";
        value = parseInt(value);

        if (value < 0) return "positive-integer-expected";
        return "ok";

    }

    // XXX - no check for this header yet
    this.content_md5 = function(value, response) {
        return "ok";
    }

    this.content_range = function(value, response) {

        if (response["status"] !== "206" && response["status"] !== "416") return "invalid-status-for-method";
        return "ok";

    }

    // XXX - no check for this header yet
    this.content_transfer_encoding = function(value, response) {
        return "ok";
    }

    this.content_type = function(value, response) {

        value = value.split(";");
        if (value.length === 1) return "ok"

        value[0].trim()
        value[1].trim()

        if (value[0].indexOf("charset") === 0) value = value[0];
        else value = value[1];

        value = value.trim().split("=");

        if (value.length !== 2) return "syntax-error";
        if (value[0] !== "charset") return "syntax-error";

        var charset = value[1].trim();

        if (["utf-8", "utf-16", "iso-8859-1", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", 
                "iso-8859-6", "iso-8859-7", "iso-8859-8", "iso-8859-9", "iso-8859-10", "iso-8859-15", "iso-2022-jp",
                "iso-2022-jp-2", "iso-2022-jp-3", "iso-2022-kr", "us-ascii"].indexOf(charset) < 0) return "invalid-charset";

        return "ok";

    }

    this.date = function(value, response) {

        if (Date.parse(value) === null) return "invalid-date-format";
        return "ok";

    }

    this.etag = function(value, response) {
        return "ok";
    };

    this.expires = function(value, response) {

        if (Date.parse(value) === null) return "invalid-date-format";
        return "ok";

    };

    this.keep_alive = function(value, response) {

        var values = value.split(",");
        if (values.length !== 2) return "invalid-value";

        var value0 = values[0].split("=");
        var value1 = values[1].split("=");

        if (value0.length !== 2) return "invalid-value";
        if (value1.length !== 2) return "invalid-value";

        value0[0] = value0[0].trim();
        value1[0] = value1[0].trim();

        if (value0[0] !== "timeout" && value0[0] !== "max") return "invalid-value";
        if (value1[0] !== "timeout" && value1[0] !== "max") return "invalid-value";

        if (isNaN(value0[1]) || parseInt(value0[1]) < 1) return "positive-integer-expected";
        if (isNaN(value1[1]) || parseInt(value1[1]) < 1) return "positive-integer-expected";

        for (var header in response["headers"]) {

            if (header["name"] === "Connection") {

                if (header["value"].indexOf("Keep-Alive") < 0) return "missing-dependent-header";
                else return "ok";

            }
        }

        return "ok";

    };

    this.last_modified = function(value, response) {

        if (Date.parse(value) === null) return "invalid-date-format";
        return "ok";

    };

    // XXX need to implement this
    this.link = function(value, response) {
        return "ok";

    };


    this.location = function(value, response) {

        if ([201, 300, 301, 302, 303, 305, 307].indexOf(response["status"]) < 0) return "invalid-status-for-method";
        return "ok";

    };

    this.mime_version = function(value, response) {
        return "ok";
    };

    this.p3p = function(value, response) {
        return "ok";
    };

    this.pragma = function(value, response) {
        return "ok";
    };

    this.retry_after = function(value, response) {

        if (isNaN(value) && (Date.parse(value) === null)) return "invalid-value";
        if (parseInt(value) < 0) return "positive-integer-expected";
        return "ok";

    };

    this.server = function(value, response) {
        return "ok";
    };

    this.set_cookie = function(value, response) {
        return "ok";
    };

    this.tcn = function(value, response) {
        return "ok";
    };

    this.transfer_encoding = function(value, response) {

        if (value.indexOf(";") > 0) value = value[0].trim();
        if (["chunked", "compress", "deflate", "gzip", "identity"].indexOf(value) < 0) return "invalid-value";

        return "ok";

    };

    this.vary = function(value, response) {
        return "ok";
    };

    this.via = function(value, response) {
        return "ok";
    };


    return self;

}
