"use strict"

exports.analyze = function(serializedAssets, assets) {

    var timeline = {};
    var itimeline = {};

    for (var i in serializedAssets) {

        var asset = assets[serializedAssets[i]];
        var url = asset["request"]["url"];
        var time = Math.round(asset["request"]["time"].getTime()/10)/100;
        
        if (timeline[time] === undefined) timeline[time] = [];
        timeline[time].push(url);

    }

//    helper.log(timeline);
};
