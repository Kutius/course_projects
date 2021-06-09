but1y = 100;
but1_m = 4;
function changePos() {
	function the_but() {
		if (but1_m >= 4) {
			but1y--;
			if (but1y <= 0) but1_m = 1;
		}
		if (but1_m <= 2) {
			but1y++;
			if (but1y >= 100) but1_m = 4;
		}
		return but1y;
	}
	//document写法:
	document.getElementById("but1").style.top = the_but() + 300 + "px";
}
function start() {
	interval = setInterval(changePos, 30);
}
function stop() {
	clearInterval(interval);
}
start();
