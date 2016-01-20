function Team (teamname) {
	this.teamname = teamname;
	this.levelElementId = teamname+'_level';
	this.progressElementId = teamname+'_progress';
	this.xpElementId = teamname+'_xp';
	this.level = 1;
	this.progress = 0;
	this.fanfare = new Audio("sounds/fanfare/"+teamname+".ogg")
	document.getElementById(this.progressElementId).style.width = "0%";

	this.addXP = function(){
		this.progress += Math.round((maxXP(this.level) - maxXP(this.level - 1)) * 0.05);
		if(this.progress >= maxXP(this.level)) {
			this.incrementLevel();
		}
		document.getElementById(this.progressElementId).style.width = (this.progress - maxXP(this.level - 1)) / (maxXP(this.level) - maxXP(this.level - 1)) * 100 + "%";
		document.getElementById(this.xpElementId).innerHTML = this.progress;
		xpding.play();
	}

	this.incrementLevel = function() {
		this.level++;
		levelupbackground(this.teamname);
		document.getElementById(this.levelElementId).innerHTML = this.level;
		this.fanfare.play();
	}
}

var alliance = new Team('alliance');
var horde = new Team('horde');

var xpding = new Audio('sounds/xpding.ogg')
var gong = [];
// "sounds" is provided by the backend to the template, and the template provides it to us
sounds.forEach(function(thisArg) {
	gong.push(new Audio(thisArg));
});

io = io.connect();

io.on('play', function(data) {
	console.log("Remote play: " + data);
	playGong();
});

io.on('xp', function(data) {
	console.log("Remote increase XP for "+ data);
	switch (data) {
		case 'alliance':
			alliance.addXP();
			break;
		case 'horde':
			horde.addXP();
			break;
	}
});

function maxXP(level) {
	return level*level*500;
}

function playGong() {
	gong[Math.floor(Math.random() * gong.length)].play();
}

function keydown(event) {
	if (event.keyCode >= 48 && event.keyCode <= 57) {
		playGong();
	}
	if (event.keyCode == 43) {
		alliance.addXP();
	}
	if (event.keyCode == 45) {
		horde.addXP();
	}
	//console.log(event.keyCode);
}

function levelupbackground(teamname) {
	// number and names of image files is hard coded here so we
	// don't support arbitrarily changing/adding new image files
	var image = teamname + '/' + (Math.floor(Math.random()*6));
	document.body.style.backgroundImage = "url('/images/"+image+".jpg')";
	setTimeout(function() {document.body.style.backgroundImage = "url('/images/bg.jpg')"}, 10000);
}

