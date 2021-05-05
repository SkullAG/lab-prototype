import * as boxTank from './personajes/boxTank.js';
import * as yasha from './personajes/yasha.js';
import * as glish from './personajes/glish.js';
import * as keys from './keys.js';

export function preload()
{
	scene = this;
	boxTank.preload.call(this);
	yasha.preload.call(this);
	glish.preload.call(this);
}

var scene;
var numCabeza = 0;
var espacioEntreHeroes;
export var heroes;
var numHeroes;
export var cabeza
var caminoTemp = new Array();
var fila = new Array();
export var armasHeroicas = new Array();
var move;
var tEntreCambio = 0;

export function create(spawn, allTiles, antorchas, conf)
{
	//el espacio entre elementos de la fila
	espacioEntreHeroes = 12;

	//el grupo de elementos de la fila
	heroes = scene.physics.add.group();

	yasha.create(spawn, allTiles, antorchas, conf, heroes, armasHeroicas);
  glish.create(spawn, allTiles, conf, heroes, armasHeroicas);
	boxTank.create(spawn, allTiles, heroes, armasHeroicas);


	numHeroes = heroes.getLength();
	//console.log(numHeroes);

	for (var i = 0; i < numHeroes; i++)
	{
		fila.unshift(heroes.getChildren()[i]);
	}

	//console.log(fila[0]);
	cabeza = fila[0];
	scene.cameras.main.startFollow(cabeza, true);

	//Crea una array de puntos, estos seran el camino que deben seguir
	caminoTemp = new Array();
	for (var i = 0; i < numHeroes * espacioEntreHeroes; i++)
	{
		caminoTemp[i] = new Phaser.Geom.Point(cabeza.x, cabeza.y);
	}


	//Hay que hacer una variable que copruebe si la cabeza esta en movimiento
	move = false;
}

export function update()
{
	boxTank.update(cabeza);
	glish.update(cabeza);
	yasha.update(cabeza);


	//se elimina el ultimo punto y se añade uno al principio
	if (fila[0].move == true)
	{
		var parte = caminoTemp.pop();
		parte.setTo(cabeza.x, cabeza.y);
		//console.log(parte)
		parte.look = cabeza.look
		caminoTemp.unshift(parte);
		//se le da a cada miembro del grupo su nueva posición
		for (var i = 1; i < numHeroes; i++)
		{
			var h = fila[i];
			h.x = (caminoTemp[(i)*espacioEntreHeroes]).x;
			h.y = (caminoTemp[(i)*espacioEntreHeroes]).y;
			h.setVelocityY(0);
			h.setVelocityX(0);
			h.look = caminoTemp[(i) * espacioEntreHeroes].look
		}
	}

	tEntreCambio--
	if(keys.P.isDown && tEntreCambio <= 0)
	{
		numCabeza++;
		numCabeza = numCabeza % numHeroes;
		//console.log(numCabeza)

		//cabeza = heroes.getChildren()[numCabeza]
		cambiarCabeza();
		tEntreCambio = 30;
	}
}

function cambiarCabeza()
{
	for(var i = 0; i < numHeroes-1; i++)
	{
		var personaje = fila.pop();
		fila.unshift(personaje);
	}

	cabeza = fila[0];
	scene.cameras.main.startFollow(cabeza, true);

	for (var i = 0; i < numHeroes; i++) {
		var h = fila[i];
		h.x = (caminoTemp[(i) * espacioEntreHeroes]).x;
		h.y = (caminoTemp[(i) * espacioEntreHeroes]).y;
	}

	/*for (var i = 1; i < numHeroes; i++) {
		heroes.getChildren()[i-1] = heroes.getChildren()[i]
	}*/
}

export function ponerEmitter()
{
	arenaEmitter.setPosition(boxTank.player.x, boxTank.player.y).stop();
}

export function herir(obj, e) {
	/*if (!e.inmune && obj != cabeza) {
		//console.log(obj)
		e.detectionbox.detectado = true;
		e.vida--;
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
	}*/
	if (!obj.inmune && obj == cabeza) {
		obj.vida -= e.dano;
		obj.inmune = true;

		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				//obj.inmune = true;

				obj.setAlpha(value % 2)

				if (value == 0) {
					obj.setAlpha(1)
					//obj.inmune = false;
				}
			}
		});
		obj.inmuneT = 90;
		//console.log('hola');
	}
}

export function reHacerFila()
{
	caminoTemp = new Array();
	for (var i = 0; i < numHeroes * espacioEntreHeroes; i++) {
		caminoTemp[i] = new Phaser.Geom.Point(cabeza.x, cabeza.y);
	}
}