import * as utilidades from './utilidades.js';
import * as boxTank from './personajes/boxTank.js';

var portals = new Array();
var coolDown = 120
var scene
var tiempoActivo = 0;

export function preload()
{
	this.load.image('portalApagado','assets/images/portalApagado.png');
	this.load.spritesheet('portal','assets/images/portalAnim.png', { frameWidth: 32, frameHeight: 32});
	scene = this
}

export function createAnims()
{
	scene.anims.create({
		key: 'portalAnim',
		frames: scene.anims.generateFrameNumbers('portal'),
		frameRate: 1,

	});

}

export function create(capa)
{
	//var objects = map.createFromObjects(capa);

	capa.forEach(obj => {
		//console.log(obj)
		if(obj.name == 'portal')
		{
			//shapeShifterGroup.add(obj)

			obj.setTexture('portal')
			scene.physics.world.enable(obj);
			//console.log(obj)
			obj.setSize(4, 4)
			//obj.scale = 0.5
			obj.body.height = 4
			obj.body.width = 4

			obj.body.offset.x += 14
			obj.body.offset.y += 14
			//obj.body.transform.scaleX = 0.1
			//obj.setBodySize(4, 4)
			//obj = scene.add.rectangle(obj.x, obj.y, 8, 8);
			//obj.height =  4
			//obj.setCircle(2,0)
			createPortal(obj);
			//console.log(obj)
		}
	})

	createLinks(scene)

	return portals
}

function createPortal(obj)
{
	//obj.properties.destino = obj.data.
	utilidades.convertToProperties(obj)
	obj.coolDown = 0

	portals.unshift(obj)
}

export function collisionPortal(obj)
{
	scene.physics.add.overlap(obj, portals, teleport, teleportTimeout, scene);
}

function teleportTimeout()
{
	tiempoActivo++;

	if (tiempoActivo > 15)
	{
		tiempoActivo = 0
		return true
	}
	return true
}

function teleport(obj, entity)
{
	//console.log(obj.name);
	if (obj.coolDown <= 0 && tiempoActivo == 10)
	{
		//console.log(obj.x);
		//console.log(obj);
		obj.coolDown = coolDown
		obj.destino.coolDown = coolDown

		entity.x = obj.destino.x
		entity.y = obj.destino.y
		tiempoActivo = 0;

		/*scene.cameras.main.setLerp(0.1, 0.1);
		setTimeout(function(){
			scene.cameras.main.setLerp(1, 1);
		}, 2000)*/
	}
	//tiempoActivo += 2;

}

function createLinks()
{
	for (var i = 0; i < portals.length; i++) {
		var p = portals[i]
		
		p.linked=false;
		for (var e = 0; e < portals.length; e++)
		{
			var d = portals[e]
			if(p.properties.destino == d.properties.puerta)
			{
				p.destino=d
				p.linked=true;
			}
		}
		if(!p.linked)
		{
			p.destino=p
		}
		//console.log(p)
	}
}

export function update()
{
	for (var i = 0; i < portals.length; i++){
		portals[i].coolDown--
		//console.log(portals[i])
		if(portals[i].coolDown <= 0)
		{
			portals[i].play('portalAnim', true)
		}
		else
		{
			portals[i].play('portalAnim', false)
			portals[i].setTexture('portalApagado')
		}
	}
	//if(tiempoActivo > 0){tiempoActivo--;}
}