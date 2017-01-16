var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth-connect');
var walk = require('walk');

walker = walk.walk("public/sounds/gong", {followLinks: false});
var scanned = 0, toProbe = 0;
var startTime = new Date();
var soundFiles = [];
var imageFiles = [];

walker.on("file", function (root, fileStats, next) {
	var file = (root+'/'+fileStats.name).split('public/')[1];
	soundFiles.push(file);
	scanned++;
	next();
});

walker.on("end", function() {
	console.log("Scanned files: " + scanned);
	console.log("Done in: " + Math.round((new Date() - startTime) / 1000) + " seconds");
});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('numplay', { soundFiles: soundFiles });
});

var auth = basicAuth('songleader', 'testPass')
router.get('/songleader', auth, function(req, res) {
  res.render('songleader', { soundFiles: soundFiles });
});

module.exports = router;
