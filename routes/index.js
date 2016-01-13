var express = require('express');
var router = express.Router();

var walk = require('walk');
var path = require('path');

walker = walk.walk("public/sounds", {followLinks: false});
var scanned = 0, toProbe = 0;
var startTime = new Date();
var files = [];
var keys = [];
walker.on("file", function (root, fileStats, next) {
	file = path.join(root, fileStats.name).split("public/sounds/")[1].split("/");
	upsert(file[0], file[1]);
	scanned++;
	next();
});
walker.on("end", function() {
	console.log("Scanned files: " + scanned);
	console.log("Done in: " + Math.round((new Date() - startTime) / 1000) + " seconds");
	keys.reverse();
});

function upsert(category, file) {
	if (!files[category]) {
		files[category] = [];
		keys.push(category);
	}
	files[category].push("/sounds/" + category + "/" + file);
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('numplay', { files: files, keys: keys });
});

router.get('/songleader', function(req, res) {
  res.render('songleader', { files: files, keys: keys });
});

module.exports = router;
