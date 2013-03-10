/* Liberally ripped from phpjs.org :-)
 */
exports.parseURL= function(str, component) {
    // http://kevin.vanzonneveld.net
    // +      original by: Steven Levithan (http://blog.stevenlevithan.com)
    // + reimplemented by: Brett Zamir (http://brett-zamir.me)
    // + input by: Lorenzo Pisani
    // + input by: Tony
    // + improved by: Brett Zamir (http://brett-zamir.me)
    // %          note: Based on http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    // %          note: blog post at http://blog.stevenlevithan.com/archives/parseuri
    // %          note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    // %          note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
    // %          note: a seriously malformed URL.
    // %          note: Besides function name, is essentially the same as parseUri as well as our allowing
    // %          note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
    // *     example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    // *     returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
    var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 
                        'relative', 'path', 'directory', 'file', 'query', 'fragment'],
        ini = (this.php_js && this.php_js.ini) || {},
        mode = (ini['phpjs.parse_url.mode'] && 
            ini['phpjs.parse_url.mode'].local_value) || 'php',
        parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

    var m = parser[mode].exec(str),
        uri = {},
        i = 14;
    while (i--) {
        if (m[i]) {
          uri[key[i]] = m[i];  
        }
    }

    if (component) {
        return uri[component.replace('PHP_URL_', '').toLowerCase()];
    }
    if (mode !== 'php') {
        var name = (ini['phpjs.parse_url.queryKey'] && 
                ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        uri[key[12]].replace(parser, function ($0, $1, $2) {
            if ($1) {uri[name][$1] = $2;}
        });
    }
    delete uri.source;
    return uri;
}

exports.log = function(data) {
    if (typeof data === "string") console.log(data)
    else console.log(JSON.stringify(data));
};

exports.createHAR = function(page, timings, data) {

    var url = page["url"],
        title = page["title"];
        onLoad = timings["on-load-time"],
        onContentLoad= timings["on-content-loaded-time"],
        startTime = timings["start-time"],
        assets = data["assets"],
        serializedAssets = data["serialized-assets"],
        entries = [];

    for (var i in serializedAssets) {

        var res = assets[serializedAssets[i]],
            req = res["request"],
            startres = res["start-response"];
            endres = res["end-response"],
            reqStartTime = req["time"].getTime(),
            resEndTime = endres["time"].getTime(),
            bodySize = 0,
            contentType = endres["contentType"] || "",
            resStartTime = reqStartTime;

        if (startres !== undefined) {
            
            bodySize = startres["bodySize"];
            resStartTime = startres["time"].getTime();

        }

        var cookies = getCookies(endres["headers"]);

        entries.push({
            "startedDateTime": req["time"].toISOString(),
            "time": resEndTime - reqStartTime,
            "request": {
                "method": req["method"],
                "url": req["url"],
                "httpVersion": "HTTP/1.1",
                "cookies": [],
                "headers": req["headers"],
                "queryString": [],
                "headersSize": -1,
                "bodySize": -1
            },
            "response": {
                "status": endres["status"],
                "statusText": endres["statusText"],
                "httpVersion": "HTTP/1.1",
                "cookies": cookies,
                "headers": endres["headers"],
                "redirectURL": "",
                "headersSize": -1,
                "bodySize": bodySize,
                "content": {
                    "size": bodySize,
                    "mimeType": contentType
                }
            },
            "cache": {},
            "timings": {
                "blocked": 0,
                "dns": -1,
                "connect": -1,
                "send": 0,
                "wait": resStartTime - reqStartTime,
                "receive": resEndTime - resStartTime,
                "ssl": -1
            },
            "pageref": "pageref"
        });
    }

    return {
        "log": {
            "version": "1.2",
            "creator": {
                "name": "webutil",
                "version": "1.0",
                "comment": "Available https://github.com/ditesh/webutil"
            },
            "pages": [
                {
                    "startedDateTime": startTime.toISOString(),
                    "id": "pageref",
                    "title": title,
                    "pageTimings": {
                        "onContentLoad": onContentLoad,
                        "onLoad": onLoad,
                    },
                }
            ],
            "entries": entries,
        }
    };

    // Adapted from https://github.com/danjordan/cookie-parser
    function getCookies(headers) {

        var retval = [],
            attributes = ['name', 'value', 'expires', 'path', 'domain', 'secure', 'httponly'];

        for (var i in headers) {

            var header = headers[i];
            if (header["name"].toLowerCase() !== "set-cookie") continue;

            // Hack for cookies with same header name
            header = header["value"].split("\n");

            for (var j in header) {

                var cookie = {};
                var params = header[j].split(';');

                params.forEach(function(param) {

                    param = param.trim().split('=');
                    var key = param[0];
                    var lckey = key.toLowerCase();
                    var value = true;

                    if (param.length === 2) value = param[1];

                    if (attributes.indexOf(lckey) > 0) {

                        if (lckey === 'expires') cookie[key] = new Date(value);
                        else if (lckey === 'httponly') cookie["httpOnly"] = true;
                        else cookie[key] = value;

                    } else {

                        cookie["name"] = key;
                        cookie["value"] = value;

                    }
                });

                retval.push(cookie);

            }
        }

        return retval;

    }
}
