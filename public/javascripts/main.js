function Team (teamname) {
	this.teamname = teamname;
	this.levelElementId = teamname+'_level';
	this.progressElementId = teamname+'_progress';
	this.xpElementId = teamname+'_xp';
	this.level = 1;
	this.progress = 0;
	this.fanfare = new Audio("sounds/fanfare/fanfare.ogg")
	this.hurts = new Audio("sounds/hurts.ogg")
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

	this.damage = function() {
		var damage = Math.round((maxXP(this.level) - maxXP(this.level - 1)) * 0.05);
		floorXP = maxXP(this.level - 1);
		if(this.progress - damage < floorXP) {
			this.progress = floorXP;
		} else {
			this.progress -= damage;
			document.getElementById(this.progressElementId).style.width = (this.progress - maxXP(this.level - 1)) / (maxXP(this.level) - maxXP(this.level - 1)) * 100 + "%";
			document.getElementById(this.xpElementId).innerHTML = this.progress;
		}
		this.hurts.play();
	}
}

function Thirst () {
	this.thirst = 40;
	this.barElementId = 'thirst_bar';
	this.thirstElementId = 'thirstlevel';
	this.gulp = new Audio('sounds/gulp.ogg'); // TODO
	document.getElementById(this.barElementId).style.width = this.thirst+"%";

	this.drink = function() {
		if((this.thirst + 20) > 100) {
			this.thirst = 100;
		} else {
			this.thirst += 20;
		}

		document.getElementById(this.barElementId).style.width = this.thirst+"%";
		document.getElementById(this.thirstElementId).innerHTML = this.thirst;
		this.gulp.play();
	}

	this.decrease = function() {
		if((this.thirst - 5) < 0) {
			this.thirst = 0;
			party.damage();
		} else {
			this.thirst -= 5;
		}

		document.getElementById(this.barElementId).style.width = this.thirst+"%";
		document.getElementById(this.thirstElementId).innerHTML = this.thirst;
	}
}

var party = new Team('party');
var thirst = new Thirst();

var xpding = new Audio('sounds/xpding.ogg');
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

io.on('drink', function(data) {
	console.log("Remote drink: " + data);
	thirst.drink();
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
		case 'party':
			party.addXP();
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
	var image = (Math.floor(Math.random()*6));
	document.body.style.backgroundImage = "url('/images/"+image+".gif')";
	setTimeout(function() {document.body.style.backgroundImage = "url('/images/bg.jpg')"}, 10000);
}

var thirstinterval = setInterval(function(){
	thirst.decrease();
}, 1500);
