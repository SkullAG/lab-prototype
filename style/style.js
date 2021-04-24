
function loadEvents()
{
	resize();

	//alert(document.getElementById("game")).margin)

	window.addEventListener('resize', resize)
	suffer()
}

function resize()
{
	var mystring = getComputedStyle(document.getElementById("game")).width;
	mystring = mystring.replace('px','');

	document.getElementById("gameBorder").style.height = (3/4*mystring) + "px";

	mystring = mystring/16

	//console.log(document.getElementById("gameBorder").style)
	document.getElementById("gameBorder").style.borderWidth = (5.5*mystring)+"px "+mystring+"px "+mystring+"px "+mystring+"px "
}//border-width = borderWidth
//document.getElementById("myBtn").style.height = "50px";
//resize

var asciiart

function suffer()
{
	fetch('style/suffer1.txt')
	.then(response => response.text())
	.then(data => {
		// Do something with your data
		document.getElementById("asciiShit").innerHTML = data
		//console.log(data);
	});
}