io = io.connect()

function play(sound) {
	console.log(sound);
	io.emit('play', sound)
}

function xp() {
	console.log("XP+");
	io.emit('xp')
}

