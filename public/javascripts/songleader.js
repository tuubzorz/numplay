io = io.connect()

function play() {
	console.log('Gong');
	io.emit('play');
}

function xp(team) {
	console.log("XP+");
	io.emit('xp', team);
}

function drink() {
	console.log("Drink");
	io.emit("drink");
}

