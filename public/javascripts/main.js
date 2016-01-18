function Team (teamname) {
	this.levelElementId = teamname+'_level'
	this.progressElementId = teamname+'_progress';
	this.xpElementId = teamname+'_xp'
	this.level = 1;
	this.progress = 0;
	document.getElementById(this.progressElementId).style.width = "0%";

	this.addXP = function(){
		playAudio(10);
		this.progress += Math.round((maxXP(this.level) - maxXP(this.level - 1)) * 0.05);
		if(this.progress >= maxXP(this.level)) {
			this.incrementLevel();
		}
		document.getElementById(this.progressElementId).style.width = (this.progress - maxXP(this.level - 1)) / (maxXP(this.level) - maxXP(this.level - 1)) * 100 + "%";
		document.getElementById(this.xpElementId).innerHTML = this.progress;
	}

	this.incrementLevel = function() {
		this.level++;
		playAudio(2);
		//levelup(20);
		document.getElementById(this.levelElementId).innerHTML = this.level;
	}
}

var good = new Team('good');
var evil = new Team('evil');

io = io.connect();

io.on('play', function(data) {
	console.log("Remote play: " + data);
	playAudio(data);
});

io.on('xp', function() {
	console.log("Remote increase XP");
	XPinc(good);
});

function maxXP(level) {
	return level*level*500;
}

function playAudio(category) {
	var clips = document.getElementsByName("audio" + category);
	var clip = Math.floor((Math.random() * clips.length));
	clips[clip].play();
}

function XPinc(team) {
	team.addXP();
}

function keydown(event) {
	if (event.keyCode >= 48 && event.keyCode <= 57) {
		playAudio(event.keyCode - 48);
	}
	if (event.keyCode == 43) {
		good.addXP();
	}
	if (event.keyCode == 45) {
		evil.addXP();
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

