document.getElementById("progress").style.width = "0%";
var level = 1, progress = 0;

io = io.connect();

io.on('play', function(data) {
	console.log("Remote play: " + data);
	playAudio(data);
});

io.on('xp', function() {
	console.log("Remote increase XP");
	XPinc();
});

function playAudio(category) {
	var clips = document.getElementsByName("audio" + category);
	var clip = Math.floor((Math.random() * clips.length));
	clips[clip].play();
}

function maxXP(level) {
	return level*level*500;
}

function addXP(level) {
	playAudio(10);
	return Math.round((maxXP(level) - maxXP(level - 1)) * 0.01);
}
function XPinc() {
	progress += addXP(level);
	if (progress >= maxXP(level)) {
		level++;
		playAudio(2);
		levelup(20);
		setNintendo(level);
		document.getElementById("level").innerHTML = level;
	}
	document.getElementById("progress").style.width = (progress - maxXP(level - 1)) / (maxXP(level) - maxXP(level - 1)) * 100 + "%";
	document.getElementById("xp").innerHTML = progress;
}

function keydown(event) {
	if (event.keyCode >= 48 && event.keyCode <= 57) {
		playAudio(event.keyCode - 48);
	}
	if (event.keyCode == 43) {
		XPinc();
	}
	//console.log(event.keyCode);
}

function levelup(blink) {
	if (blink % 2 == 0)
		document.body.style.background = "silver";
	else
		document.body.style.background = "black";

	if (blink > 0)
		setTimeout(function() {levelup(--blink)}, 250);
	else
		document.body.style.background = "black";
}

function setNintendo(level) {
	if (level < 18)
	//if (level < 15)
		document.getElementById("nintendo").className = "nintendo" + level;
}
