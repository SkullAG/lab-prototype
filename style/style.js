
function loadEvents()
{
	resize();

	//alert(document.getElementById("game")).margin)

	window.addEventListener('resize', resize)
	suffer()

	document.addEventListener('keydown', (e) => {
		if (!e.repeat && e.key == "+"){
			//console.log(`Key "${e.key}" pressed  [event: keydown]`);
			//console.log("+"+document.getElementById("gameBorder").style.width)
			zoom += 5;
			document.getElementById("gameBorder").style.width = zoom+"%";
			resize();
		}
		if (!e.repeat && e.key == "-"){
			//console.log(`Key "${e.key}" pressed  [event: keydown]`);
			//console.log("-")
			zoom -= 5;
			document.getElementById("gameBorder").style.width = zoom+"%";
			resize();
		}
	});
}

var zoom = 65;

function resize()
{
	var mystring = getComputedStyle(document.getElementById("game")).width;
	mystring = mystring.replace('px','');

	document.getElementById("zoomLog").innerText = zoom+'%';

	document.getElementById("gameBorder").style.height = (3/4*mystring) + "px";

	mystring = mystring/16

	//console.log(document.getElementById("gameBorder").style)
	document.getElementById("gameBorder").style.borderWidth = (5.5*mystring)+"px "+mystring+"px "+mystring+"px "+mystring+"px "
	
	//console.log(getComputedStyle(document.getElementById("page")).width + screen.width)
}//border-width = borderWidth
//document.getElementById("myBtn").style.height = "50px";
//resize

var asciiart

function suffer()
{
	var num = Math.floor(Math.random()*5)+1;
	console.log('sufferAscii: '+num)
	fetch('style/suffer'+num+'.txt')
	.then(response => response.text())
	.then(data => {
		// Do something with your data
		document.getElementById("asciiShit").innerHTML = data
		//console.log(data);
	});
}	