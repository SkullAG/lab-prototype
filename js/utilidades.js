export function collisionSwitch(obj, value)
{
	obj.collideDown = value;
	obj.collideLeft = value;
	obj.collideRight = value;
	obj.collideUp = value;
}

export function convertToProperties(obj)
{
	/*var num = 0// = obj.data.list.length

	while(obj.data.list[num] != undefined){num++}

	console.log(obj.data.list)
	//var cadena = String('')
	obj.properties = new Object

	for (var i = 0; i < num; i++)
	{
		var o = obj.data.list[i]
		
		eval('obj.properties.'+o.name+' = '+o.value+';')
	}

	//console.log(cadena)*/

	obj.properties = obj.data.list;
	//console.log(obj.properties)
}