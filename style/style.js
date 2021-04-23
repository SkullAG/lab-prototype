
function loadEvents()
{
	var mystring = getComputedStyle(document.getElementById("game")).width;
	mystring = mystring.replace('px','');

	document.getElementById("gameBorder").style.height = (3/4*mystring) + "px";

	alert(document.getElementById("game")).margin)

	window.addEventListener('resize', resize)
}

function resize()
{
	var mystring = getComputedStyle(document.getElementById("game")).width;
	mystring = mystring.replace('px','');

	document.getElementById("gameBorder").style.height = (3/4*mystring) + "px";
}
//document.getElementById("myBtn").style.height = "50px";
//resize