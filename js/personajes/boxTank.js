//import { Phaser } from 'phaser'

//export default class extends Phaser.Scene {
	/*function constructor()
	{
		super(")
	}*/
//import * as mapa from './game.js';
import * as keys from '../keys.js';
import * as utilidades from '../utilidades.js';
import * as heroes from '../grupoHeroes.js';

//import playerSpawnPoint;

export function preload()
{
	this.load.image('tanque','assets/images/BoxTank+canon.png');
	this.load.image('tanqueFront','assets/images/BoxTank+canon-front.png');
	this.load.image('taladroBack','assets/images/BoxTank+canon-back.png');

	this.load.image('sombra_bala','assets/images/sombra_bala.png');
	this.load.image('bala','assets/images/bala.png');

	this.load.image('humo','assets/particles/humo.png');

	this.load.image('cursor','assets/images/cursor.png');

	this.load.spritesheet('bum','assets/images/bum.png', { frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('taladroDerecha','assets/images/taladroDerecha.png', { frameWidth: 40, frameHeight: 32});
	this.load.spritesheet('taladroAlante','assets/images/taladroAlante.png', { frameWidth: 32, frameHeight: 32});
	scene = this;
}

function createAnims()
{
	scene.anims.create({
		key: 'explosion',
		frames: scene.anims.generateFrameNumbers('bum'),
		frameRate: 20,
	});

	scene.anims.create({
		key: 'taladroDerechaAnim',
		frames: scene.anims.generateFrameNumbers('taladroDerecha'),
		frameRate: 50,
		repeat: -1
	});

	scene.anims.create({
		key: 'taladroAlanteAnim',
		frames: scene.anims.generateFrameNumbers('taladroAlante'),
		frameRate: 25,
		repeat: -1
	});
}

var playerVelocidadReal = 150;
var playerVelocidad = 150;
var balaVelocidad = 200;
var cursor

export var player
var emitterHumo
export var balas
var move

var spawnTemp = 0;
var spaceTiempoX = 0;
var spaceTiempoY = 0;

var balaTemp = 0;
var tiempoEntreBalas = 120;

var scene

var armasHeroicas

export function create(spawn, allLayers, grupo, arHe)
{
	armasHeroicas = arHe

	createAnims();

	player=grupo.create(spawn.x,spawn.y,'tanque').setDepth(5);
	player.name = "boxTank"
	player.heroe = true;
	player.setOrigin(0.5);
	player.setCircle(16, 0);
	player.inmune = false;
	player.inmovil = false;
	player.muerto = false;
	player.emitter = new Phaser.Events.EventEmitter();
	player.vida = 12;
	player.inmuneT = 0;
	emitterHumo = scene.add.particles('humo').setDepth(5);

	scene.physics.add.collider(player, allLayers);

	player.emitter = emitterHumo.createEmitter({
		alpha: { start: 1, end: 0 },
		scale: { start: 0.25, end: 1 },
		//tint: { start: 0xff945e, end: 0xff945e },
		speed: 5,
		accelerationY: -50,
		//accelerationx: 0,
		lifespan: { min: 1000, max: 1100 },
		//blendMode: 'ERASE',
		frequency: 100,
		//maxParticles: 10,
	});

	player.emitter.stop();
	player.emitter.setPosition(player.x, player.y);

	player.taladro = scene.add.rectangle(player.x, player.y, 8, 8);
	scene.physics.add.existing(player.taladro, false);

	balas = scene.physics.add.group();

	cursor = scene.add.image(0,0,'cursor').setDepth(20);
	cursor.setOrigin(0.5)

	cursor.pointer = keys.pointer;
}

export function update(cabeza)
{
	if(player == cabeza){ player.enCabeza = true}
	else{player.enCabeza = false}
	if(!player.muerto && !player.inmovil)
	{
		input()
		////console.log(boxTank.player.y)
	}
	updatebala();
	puntero();
}

export function generatebala()
{
	var b = balas.create(player.x, player.y,'sombra_bala').setAlpha(0.5);

	b.setDepth(15)

	b.setOrigin(0.5,0.5);

	b.setCircle(8, 8, 8);

	//b.body.onWorldBounds = true;

	b.directionAngle = Math.atan2(cursor.y - b.y-14, cursor.x - b.x)* 180/Math.PI;

	b.dir = new Phaser.Math.Vector2( Math.cos(b.directionAngle*Math.PI/180), Math.sin(b.directionAngle*Math.PI/180));
	b.dir.normalize();

	b.setVelocityX(balaVelocidad*b.dir.x);
	b.setVelocityY(balaVelocidad*b.dir.y);
  

	b.proyectil = scene.add.sprite(player.x, player.y,'bala').setDepth(16);

	b.proyectil.xInicial = b.proyectil.x;
	b.proyectil.yTemp = b.proyectil.y;


	//b.proyectil.verticeX = b.proyectil.xInicial - (b.proyectil.xInicial - cursor.x)/2;

	b.proyectil.trayecto = Math.sqrt(Math.pow(cursor.y - b.y,2) + Math.pow(cursor.x - b.x,2));
	////console.log(b.proyectil.trayecto);

	//b.proyectil.verticeY = b.proyectil.trayecto/6

	//b.proyectil.ObjetivoX = cursor.x;

	b.proyectil.verticeP = (cursor.x-b.proyectil.xInicial)/2

	b.proyectil.maxY = b.proyectil.verticeP/2
	////console.log(b.proyectil.verticeP)

	b.proyectil.tiempoVida = b.proyectil.trayecto / (balaVelocidad/60);

	b.proyectil.normalizado = Math.pow(b.proyectil.x-(b.proyectil.xInicial+b.proyectil.verticeP),2);

	//console.log(Math.pow(b.proyectil.x-(b.proyectil.xInicial+b.proyectil.verticeP),2))

	////console.log(balas.bala.getLength())

	/*this.tweens.addCounter({
		from: 0,
		to: 3,
		duration: 500,
		onUpdate: function (tween)
		{
		}
	});*/
}

export function updatebala()
{
	Phaser.Actions.Call(balas.getChildren(),function(b)
	{
		b.proyectil.x = b.x;

		//b.proyectil.y = b.proyectil.yTemp +(-1*Math.pow(b.proyectil.x-b.proyectil.xInicial,2)+(b.proyectil.x-b.proyectil.xInicial))

		var aux= Math.pow(b.proyectil.x-(b.proyectil.xInicial+b.proyectil.verticeP),2)
		//b.proyectil.parabolaY.normalize()
		var auxParabolaY = (aux/b.proyectil.normalizado-1)*b.proyectil.trayecto/2;

		b.proyectil.y = b.y + auxParabolaY;
		b.proyectil.setDepth(Math.floor(auxParabolaY/-2));
		b.proyectil.setScale(1+Math.floor(auxParabolaY)/-40);

		//console.log(Math.floor((b.proyectil.parabolaY/b.proyectil.normalizado-1)*b.proyectil.trayecto/2));

		b.proyectil.tiempoVida--;
		if (Math.floor(b.proyectil.tiempoVida) == -2)
		{
			b.proyectil.destroy();
			b.explosion = scene.physics.add.sprite(b.x, b.y, 'bum').setDepth(20);

			//elementosMapa.setTileIndexCallback(deadlyTiles, function(e) {e.destroy()}, scene.physics.add.overlap(b.explosion, elementosMapa));
			//if (overlap(b.explosion, elementosMapa)){b.explosion.destroy()}
			
			b.explosion.play('explosion');
			b.explosion.dano = 3;
			b.explosiontemp=30;
			b.setAlpha(0);

			armasHeroicas.unshift(b.explosion)
			//elementosMapa.setTileIndexCallback(huellasTiles, , scene.physics.add.overlap(b.explosion, elementosMapa));
		}

		b.explosiontemp--;
		if (b.explosiontemp == 0)
		{
			b.explosion.destroy();
			b.destroy();
		}
	});
}

export function input()
{
	playerVelocidad = playerVelocidadReal;

	if(player.enCabeza)
	{
		move = false;
		if(keys.Up.isDown){
			//player.setVelocityY(-playerVelocidad);
			player.vectorY=-1;
			//player.setTexture('tanqueFront');
			player.look = 'up';
		}
		else if(keys.Down.isDown){
			//player.setVelocityY(playerVelocidad);
			
			player.vectorY=1;
			
			player.look = 'down';	
		}
		else
		{
			//player.setVelocityY(0);
			player.vectorY=0;
		}
		
		
		if(keys.Left.isDown){
			//player.setVelocityX(-playerVelocidad);
			//player.animado++;
			player.vectorX=-1;
			player.flipX = true;
			
			player.look = 'left';
		}
		else if(keys.Right.isDown){
			//player.setVelocityX(playerVelocidad);
			player.vectorX=1;
			player.flipX = false;
			
			player.look = 'right';
		}
		else
		{
			//player.setVelocityX(0);
			player.vectorX=0;
		}
		
		if (keys.Hability.isDown)
		{
			//console.log('patata')
			playerVelocidad += 75;
		}
		
		balaTemp--;
		if (keys.pointer.isDown && balaTemp <= 0)
		{
			balaTemp = tiempoEntreBalas;
			generatebala()
			//console.log("sausage")
		}
		
		player.dir = new Phaser.Math.Vector2( player.vectorX, player.vectorY);
		player.dir.normalize();
		player.setVelocityX(playerVelocidad*player.dir.x);
		player.setVelocityY(playerVelocidad*player.dir.y);
		if(player.dir.x != 0 || player.dir.y != 0) {player.move = true;}
		else{player.move = false;}
	}
		
	playerAnims();
		

	

	player.inmuneT--;
	if(player.inmuneT <= 0)
	{
		player.inmune = false;
	}

	
	/*TGBalas--;

	if(FIRE.isDown && TGBalas <= 0){
		generateBala.call(this);
		TGBalas = tiempoEntreBalas;
	}*/
}

export function playerAnims()
{
	if(player.look == 'up')
	{

		if(keys.Hability.isDown && player.enCabeza)
		{
			player.stop();
			player.setTexture('taladroBack');
			player.emitter.on = true;
		}
		else
		{
			player.stop();
			player.setTexture('tanqueFront');
			player.emitter.stop();
		}
		player.setCircle(16, 0);

		player.taladro.x = player.x
		player.taladro.y = player.y - 16
		//console.log(player.emitter)
		player.emitter.setPosition(player.x, player.y + 4);
	}
	else if(player.look == 'down')
	{
		if (keys.Hability.isDown && player.enCabeza)
		{
			player.play('taladroAlanteAnim', true);
			player.emitter.on = true;
		}
		else
		{
			player.stop();
			player.setTexture('tanqueFront');
			player.emitter.stop();
		}

		player.taladro.x = player.x
		player.taladro.y = player.y + 16
		player.emitter.setPosition(player.x, player.y - 16);
		player.setCircle(16, 0);
	}
	else if(player.look == 'left')
	{
		if (keys.Hability.isDown && player.enCabeza)
		{
			player.play('taladroDerechaAnim', true);
			player.setCircle(16, 4);
			player.emitter.on = true;
		}
		else
		{
			player.stop();
			player.setTexture('tanque');
			player.setCircle(16, 0);
			player.emitter.stop();
		}

		player.taladro.x = player.x - 16
		player.taladro.y = player.y
		player.emitter.setPosition(player.x + 12, player.y);
	}
	else if(player.look == 'right')
	{
		if (keys.Hability.isDown && player.enCabeza)
		{
			player.play('taladroDerechaAnim', true);
			player.setCircle(16, 4);
			player.emitter.on = true;
		}
		else
		{
			player.stop();
			player.setTexture('tanque');
			player.setCircle(16, 0);
			player.emitter.stop();
		}

		player.taladro.x = player.x + 16
		player.taladro.y = player.y
		player.emitter.setPosition(player.x - 12, player.y);
	}
}

export function puntero()
{
	if (player.enCabeza) {
		if (keys.pointer.isDown)
		{
			cursor.setTint(0xff0000);
		}
		else
		{
			cursor.setTint(0xffffff);
		}
		cursor.setAlpha(1)
	}
	else
	{
		cursor.setAlpha(0)
	}
	//console.log(keys.pointer)
	cursor.x = player.x - scene.game.scale.width / 2 + keys.pointer.x;
	cursor.y = player.y - scene.game.scale.height / 2 + keys.pointer.y;
	//cursor.x = keys.pointer.x;
	//cursor.y = keys.pointer.y;
}

function destruirRocas(taladro,layer)
{
	//console.log('layer')
	if (keys.Hability.isDown && layer.properties.destructible == true && taladro == player.taladro && player.enCabeza)
	{
		layer.properties.vida--;
		scene.cameras.main.shake(100, 0.01);

		//console.log(layer)
		//layer.height++;
		//layer.pixelY++;
		//layer.setDepth(0)
		//boxTank.player.setTint(layer.tint);
		
		if(layer.properties.vida <= 0)
		{
			layer.properties.collides = false;
			layer.properties.destructible = false;

			//scene.add.sprite(layer.x*32 + layer.layer.x + 16, layer.y*32 + layer.layer.y + 16, 'tanque')
			//layer.y -= 1;collideDown
			utilidades.collisionSwitch(layer, false);
			layer.setAlpha(0);
			//console.log(layer)
			//scene.physics.world.enable(layer);
		}
	}
}

export function setDestructibles(capa, tiles)
{
	capa.setTileIndexCallback(tiles, destruirRocas, scene.physics.add.overlap(player.taladro, capa))
}
//}