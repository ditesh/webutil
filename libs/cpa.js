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

var fs = require("fs");

// The overall strategy:
// 1. Construct an array for milliseconds
// 2. For each millisecond, assign which resources are on it
// 3. Compute the difference
exports.analyze = function(serializedAssets, assets) {

    function getSizes() {

        if (fs.exists(prefix + type + "/pre-processed/" + filename) === false) {

            timeline[i][j]["old-size"] = 1;
            timeline[i][j]["old-size-gzip"] = 1;

            timeline[i][j]["new-size"] = 1;
            timeline[i][j]["new-size-gzip"] = 1;
            timeline[i][j]["scale-factor"] = 1;
            timeline[i][j]["scale-factor-gzip"] = 1;
            return false;

        }

        timeline[i][j]["old-size"] = fs.size(prefix + type + "/pre-processed/" + filename);
        timeline[i][j]["old-size-gzip"] = fs.size(prefix + type + "/pre-processed-gzip/" + filename + ".gz");
        timeline[i][j]["new-size"] = fs.size(prefix + type + "/post-processed/" + filename);
        timeline[i][j]["new-size-gzip"] = fs.size(prefix + type + "/post-processed-gzip/" + filename + ".gz");
        timeline[i][j]["scale-factor"] = timeline[i][j]["new-size"] / timeline[i][j]["old-size"];
        timeline[i][j]["scale-factor-gzip"] = timeline[i][j]["new-size-gzip"] / timeline[i][j]["old-size-gzip"];

        return true;

    }

    function getTimes() {

        if (transferRate === 0) {

            var timeAsIs = timeline[i][j]["time-taken-as-is"];
            if (status === 301 || status === 302) {
                timeAsIs = 0;
            }
            timeline[i][j]["time-taken-decompressed"] = timeAsIs;
            timeline[i][j]["time-taken-compressed"] = timeAsIs;
            timeline[i][j]["new-time-taken-decompressed"] = timeAsIs;
            timeline[i][j]["new-time-taken-compressed"] = timeAsIs;
            timeline[i][j]["new-time-taken-as-is"] = timeAsIs;

            return;

        } else {

                timeline[i][j]["time-taken-decompressed"] = timeline[i][j]["old-size"] * transferRate;
                timeline[i][j]["time-taken-compressed"] = timeline[i][j]["old-size-gzip"] * transferRate;

                timeline[i][j]["new-time-taken-decompressed"] = timeline[i][j]["new-size"] * transferRate;
                timeline[i][j]["new-time-taken-compressed"] = timeline[i][j]["new-size-gzip"] * transferRate;


                if (compressed) timeline[i][j]["new-time-taken-as-is"] = timeline[i][j]["new-size-gzip"] * transferRate;
                else timeline[i][j]["new-time-taken-as-is"] = timeline[i][j]["new-size"] * transferRate;

        }
    }

    function fillArray(start, length, vals) {

        for (var i = start; i < start + length; i++) {

                if ((i in vals) === false) vals[i] = 0;
                vals[i] += 1;

            }

         return vals;

    }

    var timeline = {}, har={"as-is":{}, "as-is-decompressed":{}, "as-is-compressed": {}, "new-decompressed":{}, "new-compressed": {}, "new-as-is": {}};

    for (var i in serializedAssets) {

        var compressed = false;
        var asset = assets[serializedAssets[i]];
        asset["request"]["time"] = Date.parse(asset["request"]["time"]);
        asset["start-response"]["time"] = Date.parse(asset["start-response"]["time"]);
        asset["end-response"]["time"] = Date.parse(asset["end-response"]["time"]);

        var url = asset["request"]["url"];
        var time = Math.round(asset["request"]["time"]/10)/100;

        for (var i in asset["end-response"]["headers"]) {

            if (asset["end-response"]["headers"][i]["name"] === "Content-Encoding") {

                if (asset["end-response"]["headers"][i]["value"] === "gzip") compressed = true;
                break;

            }
        }

        if (timeline[time] === undefined) timeline[time] = [];
        timeline[time].push({
            asset: asset,
            compressed: compressed,
            "transfer-rate": 0,
            "old-size": 0,
            "old-size-gzip": 0,
            "new-size": 0,
            "new-size-gzip": 0,
            "scale-factor": 0,
            "scale-factor-gzip": 0,
            "time-taken-as-is": asset["end-response"]["time"] - asset["request"]["time"],
            "time-taken-decompressed": 0,
            "time-taken-compressed": 0,
            "new-time-taken-as-is": 0,
            "new-time-taken-decompressed": 0,
            "new-time-taken-compressed": 0
            });
    }

    var prefix = flags["asset-path"] + "/";
    var transferRate = 0;

    for (var i in timeline) {
        for (var j in timeline[i]) {

            transferRate = 0
            var startres = timeline[i][j]["asset"]["start-response"];
            var req = timeline[i][j]["asset"]["request"];
            var endres = timeline[i][j]["asset"]["end-response"];
            var type = endres["contentType"];
            var compressed = timeline[i][j]["compressed"];
            var id = req["id"];
            var reqTime = req["time"];
            var components = helper.parseURL(endres["url"]);
            var filename = helper.basename(components["path"]).trim();
            var status = endres["status"];

            if ("query" in components) filename += "?" + components["query"];
            filename = filename.trim();

            if (type !== null && filename.length > 0) {

                if (type.match(/gif/) !== null) type = "gif";
                else if (type.match(/png/) !== null) type = "png";
                else if (type.match(/jpeg/) !== null) type = "jpeg";
                else if (type.match(/css/) !== null) type = "css";
                else if (type.match(/javascript/) !== null) type = "javascript";
                else type = null;

                if (type !== null) {

                    if (fs.exists(prefix + type + "/post-processed/" + filename) === false) {

                        if (type === "gif" && fs.exists(prefix + type + "/post-processed/" + filename + ".png") === true)  filename = filename + ".png";
                        else type = null;

                    }

                    if (type !== null) {

                        if (getSizes()) {

                            if (compressed) transferRate = timeline[i][j]["time-taken-as-is"] / timeline[i][j]["old-size-gzip"];

                            else transferRate = timeline[i][j]["time-taken-as-is"] / timeline[i][j]["old-size"];

                        }
                    }
                }
            }

            timeline[i][j]["transfer-rate"] = transferRate;
            getTimes();

            har["as-is"] = fillArray(reqTime, timeline[i][j]["time-taken-as-is"], har["as-is"]);
            har["as-is-decompressed"] = fillArray(reqTime, timeline[i][j]["time-taken-decompressed"], har["as-is-decompressed"]);
            har["as-is-compressed"] = fillArray(reqTime, timeline[i][j]["time-taken-compressed"], har["as-is-compressed"]);

            har["new-as-is"] = fillArray(reqTime, timeline[i][j]["new-time-taken-as-is"], har["new-as-is"]);
            har["new-decompressed"] = fillArray(reqTime, timeline[i][j]["new-time-taken-decompressed"], har["new-decompressed"]);
            har["new-compressed"] = fillArray(reqTime, timeline[i][j]["new-time-taken-compressed"], har["new-compressed"]);

        
        }
    }

    var start = -1;
    var end = 0;

    for (var i in timeline) {

        for (var j in timeline[i]) {

            var asset = timeline[i][j]["asset"];

            var startTime = asset["request"]["time"];
            var endTime = asset["end-response"]["time"];

            if (start === -1 || startTime < start ) start = startTime;
            else if (end < endTime ) end = endTime;

        }
    }

    fs.write("/tmp/timeline.json", JSON.stringify(timeline));
    helper.log(Object.keys(har["as-is"]).length + " "
        + Object.keys(har["as-is-decompressed"]).length + " "
        + Object.keys(har["as-is-compressed"]).length + " "
        + Object.keys(har["new-as-is"]).length + " "
        + Object.keys(har["new-decompressed"]).length + " "
        + Object.keys(har["new-compressed"]).length);

};