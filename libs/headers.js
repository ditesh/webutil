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

exports.Headers = function() {

    var self = this;

    var syntax = {

        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        uri: /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
        token: /(?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?)/i,
        quoted_string: /(?:"(?:[ \t\x21\x23-\x5B\x5D-\x7E]|\\[ \t\x21-\x7E])*")/i,
        parameter: /(?:(?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?)(?:\s*=\s*(?:(?:[!#\$%&\'\*\+\-\.\^_`|~A-Za-z0-9]+?)|(?:"(?:[ \t\x21\x23-\x5B\x5D-\x7E]|\\[ \t\x21-\x7E])*")))?)/i

    };

    var reasons = {
        "invalid-status-for-method": "Invalid HTTP response status code for method",
        "positive-integer-expected": "Invalid value (positive integer expected)",
        "invalid-language-code": "Invalid language code",
        "invalid-date-format": "Invalid date format",
        "invalid-date": "Invalid date",
        "invalid-uri": "Invalid URI format",
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
            else if ((name in self) === false) retval[name] = false;
            else retval[name] = self[name](value, response);

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

        value = value.split(",");
        var methods = ["get", "post", "delete", "options", "head", "put", "trace", "connect"];
        
        for (var v in value) {

            v = value[v].trim();
            if (methods.indexOf(v) < 0) return "invalid-value";

        }

        return "ok";

    };

    this.access_control_allow_headers = function(value, response) {
        return "ok";
    };

    this.access_control_allow_credentials = function(value, response) {

        if (value !== "true" && value !== "false") return "invalid-value";
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

    // Should check language codes
    this.content_language = function(value, response) {
        
        value = value.split(",");

        for (var v in value) {

            if (value[v].length === 1 && value[v][0].length !== 2) return "invalid-language-code";
            else {

                v = value[v].split("-");
                if (v[0].trim().length !== 2) return "invalid-language-code";

            }
        }

        return "ok";

    };

    this.content_length = function(value, response) {

        // Skipping regex check as the check is handled by isNaN()
        if (isNaN(value)) return "positive-integer-expected";
        value = parseInt(value);

        if (value < 0) return "positive-integer-expected";
        return "ok";

    };

    this.content_location = function(value, response) {

        if (syntax.uri.test(value) === false) return "invalid-uri";
        return "ok";

    };

    // @example Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
    // @ref http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
    this.content_md5 = function(value, response) {

        if (value.length !== 24) return "invalid-value";
        return "ok";

    };

    this.content_range = function(value, response) {

        if (response["status"] !== "206" && response["status"] !== "416") return "invalid-status-for-method";
        return "ok";

    };

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
        else if (value[1].indexOf("charset") === 0) value = value[1];
        else return "ok";

        value = value.trim().split("=");

        if (value.length !== 2) return "invalid-value";
        if (value[0] !== "charset") return "invalid-value";

        var charset = value[1].trim();

        if (["utf-8", "utf-16", "iso-8859-1", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", 
                "iso-8859-6", "iso-8859-7", "iso-8859-8", "iso-8859-9", "iso-8859-10", "iso-8859-15",
                "iso-2022-jp", "iso-2022-jp-2", "iso-2022-jp-3", "iso-2022-kr", "us-ascii", "gbk",
                "euc-kr", "euc-jp", "gb2312"].indexOf(charset) < 0) return "invalid-charset";

        return "ok";

    }

    this.date = function(value, response) {

        var value = Date.parse(value);
        if (value === null) return "invalid-date-format";
        if (value > Date.now()) return "invalid-date";

        return "ok";

    }

    this.etag = function(value, response) {
        return "ok";
    };

    this.expires = function(value, response) {

        if (Date.parse(value) === null) return "invalid-date-format";
        return "ok";

    };

    this.from = function(value, response) {

        if (syntax.email.test(value) === false) return "invalid-value";
        return "ok";

    };

    this.keep_alive = function(value, response) {

        var values = value.split(",");
        if (values.length > 2) return "invalid-value";

        if (values.length <= 2) {

            var value0 = values[0].split("=");

            if (value0.length !== 2) return "invalid-value";
            value0[0] = value0[0].trim();

            if (value0[0] !== "timeout" && value0[0] !== "max") return "invalid-value";
            if (isNaN(value0[1]) || parseInt(value0[1]) < 1) return "positive-integer-expected";

        }

        if (values.length === 2) {

            var value1 = values[1].split("=");
            if (value1.length !== 2) return "invalid-value";

            value1[0] = value1[0].trim();

            if (value1[0] !== "timeout" && value1[0] !== "max") return "invalid-value";
            if (isNaN(value1[1]) || parseInt(value1[1]) < 1) return "positive-integer-expected";

        }

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
        if (value > Date.now()) return "invalid-date";
        return "ok";

    };

    // @example: Link: </feed>; rel="alternate"
    // @ref: http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
    this.link = function(value, response) {

        value = value.split(";");
        if (value.length !== 2) return "invalid-value";
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

    // Strict-Transport-Security: max-age=expireTime [; includeSubdomains]
    // https://developer.mozilla.org/en-US/docs/Security/HTTP_Strict_Transport_Securit
    this.strict_transport_security = function(value, response) {

        value = value.split(";");

        if (value.length <= 2) {

            value = value[0].split("=");

            if (value.length !== 2) return "invalid-value";
            if (value[0].trim() !== "max-age") return "invalid-value";
            if (isNaN(value[1].trim())) return "positive-integer-expected";

        } else return "invalid-value";

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
