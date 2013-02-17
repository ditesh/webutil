var system = require("system"),
    page = require('webpage').create();

page.onError = function(msg, trace) {
    console.log(JSON.stringify(trace));
};

page.onResourceRequested = function(res) {
    console.log("requested: " + JSON.stringify(res));
};

page.onResourceReceived = function(res) {
    console.log("received: " + JSON.stringify(res));
};

page.open(system.args[1], function (status) {
    console.log("done");
    phantom.exit();
});
