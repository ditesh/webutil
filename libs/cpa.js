"use strict"

var fs = require("fs");

exports.analyze = function(serializedAssets, assets) {

    function fillArray(id, start, end, vals) {

        for (var i = start; i < end; i++) {

            if ((i in vals) === false) vals[i] = [];
            vals[i].push(id);

        }

        return vals;

    }
        
    var timeline = {},
        itimeline = {},
        parallel = {},
        newparallel = {};

    for (var i in serializedAssets) {

        var asset = assets[serializedAssets[i]];
        var url = asset["request"]["url"];
        var time = Math.round(asset["request"]["time"].getTime()/10)/100;
        
        if (timeline[time] === undefined) timeline[time] = [];
        timeline[time].push({
            asset: asset,
            "old-size": 0,
            "new-size": 0,
            "scale-factor": 0,
            "time-taken": 0,
        });

    }

    var prefix = "/tmp/webutil/";

    for (var i in timeline) {

        for (var j in timeline[i]) {

            var startres = timeline[i][j]["asset"]["start-response"];
            var req = timeline[i][j]["asset"]["request"];
            var endres = timeline[i][j]["asset"]["end-response"];
            var type = endres["contentType"];

            parallel = fillArray(req["id"], req["time"].getTime(), endres["time"].getTime(), parallel);

            if (type === null) continue;

            var components = helper.parseURL(endres["url"]);
            var filename = helper.basename(components["path"]).trim();

            if ("query" in components) filename += "?" + components["query"];
            filename = filename.trim();
            if (filename.length === 0) continue;

            if (type.match(/gif/) !== null) type = "gif";
            if (type.match(/png/) !== null) type = "png";
            else if (type.match(/jpeg/) !== null) type = "jpg";
            else if (type.match(/css/) !== null) type = "css";
            else if (type.match(/javascript/) !== null) type = "js";
            else continue;

            if (fs.exists(prefix + type + "/post/" + filename) === false) {

                helper.log("file doesn't exist");
                continue;

            }

            timeline[i][j]["old-size"] = fs.size(prefix + type + "/pre/" + filename);
            timeline[i][j]["new-size"] = fs.size(prefix + type + "/post/" + filename);
            timeline[i][j]["scale-factor"] = timeline[i][j]["new-size"] / timeline[i][j]["old-size"];

            if (timeline[i][j]["scale-factor"] < 1) {

                timeline[i][j]["time-taken"] = startres["time"].getTime() - req["time"].getTime();
                timeline[i][j]["new-time-taken"] = timeline[i][j]["time-taken"] * timeline[i][j]["scale-factor"];

            }

//            if ((req["time"].getTime() in parallel) === false) parallel[req["time"].getTime()] = [];
//            parallel[req["time"].getTime()].push(req["id"]);

        }
    }

    for (var i in timeline) {

        for (var j in timeline[i]) {

            var req = timeline[i][j]["asset"]["request"];
            var endres = timeline[i][j]["asset"]["end-response"];

            if (timeline[i][j]["scale-factor"] < 1) {

                newparallel = fillArray(req["id"], req["time"].getTime(), timeline[i][j]["new-time-taken"], newparallel);

            } else  {

                newparallel = fillArray(req["id"], req["time"].getTime(), endres["time"].getTime(), newparallel);

            }
        }
    }

    var gaps = helper.array_diff(Object.keys(parallel), Object.keys(newparallel));

    // Construct an array for milliseconds
    // For each millisecond, assign which resources are on it
    helper.log(Object.keys(parallel).length);
    helper.log(Object.keys(gaps).length);

};
