import * as mapa from './game.js';
import * as boxTank from './personajes/boxTank.js';
import * as heroes from './grupoHeroes.js';

var scene

export function preload()
{
	this.load.spritesheet('scyther','assets/images/Scyther.png', { frameWidth: 32, frameHeight: 16});
	scene = this;
}

export var scytherGroup;

export function create(allLayers)
{
	scytherGroup = scene.physics.add.group();
	//scene.physics.add.collider(scytherGroup, scytherGroup);
	scene.physics.add.collider(scytherGroup, allLayers);
}

export function createScyther(obj)
{
	var s = scytherGroup.create(obj.x, obj.y, 'scyther')
	s.inmovil = false;
	s.dano = 1;
	//s.setTexture('shapeshifter');
	//s.y -= 16;

	s.setDepth(4);
	s.vida = 8;

	s.detectionbox = scene.add.rectangle(s.x, s.y, 200, 200);
	scene.physics.add.existing(s.detectionbox, false);

	s.detectionbox.detectado = false;

	scene.physics.add.overlap(heroes.heroes, s.detectionbox, detectarJugador, null, scene);

	//s.setSize(20, 16)
	//s.setOffset(6, 14)
	//scene.physics.add.collider(s, scytherGroup);
}

export function detectarJugador(db, pj)
{
	db.detectado = true;
}

export function update()
{
	Phaser.Actions.Call(scytherGroup.getChildren(),function(s)
	{
		if(s.detectionbox.detectado && !s.transformado)
		{
			s.transformado = true;
			//s.play('shapeshifterTransform')
		}

		//console.log(s.anims.currentFrame.isLast)

		if(s.transformado == true && !s.inmovil && s.vida > 0)
		{
			//if(s.anims.currentFrame.isLast)
			{
				//s.play('shapeshifterWalk', true)
				s.move = true;
				//scene.physics.accelerateToObject(s, player)
				//scene.physics.moveToObject(s, player, 150);
				//scene.physics.moveTo(s, heroes.cabeza.x, heroes.cabeza.y+11, 150);
				//s.setVelocityY(100)
			}
		}
		else
		{
			s.setVelocityX(0)
			s.setVelocityY(0)
		}

		if(s.vida <= 0)
		{
			//s.play('shapeshifterWalk', false);
			s.detectionbox.destroy();
			s.setTexture('shapeshifterMuerto');
			s.setTint(0xaaaaaa)
			s.body.enable = false;
		}


		s.detectionbox.y = s.y;
		s.detectionbox.x = s.x;


	})
}

export function herir(obj, e) {
	if (!e.inmune) {
		//console.log(obj)
		e.detectionbox.detectado = true;
		if (obj.dano != null) {
			e.vida -= obj.dano;
		}else{e.vida --;}
		e.inmune = true;

		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				e.inmune = true;

				e.setAlpha(value % 2)

				if (value == 0) {
					e.setAlpha(1)
					e.inmune = false;
				}
			}
		});

		//console.log('hola');
	}
	if(obj.fragil)
	{
		obj.destroy()
	}
}