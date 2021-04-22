var config={
		type:Phaser.AUTO,
		width:400,
		height:300,
		pixelArt: true,
		physics:{
			default:'arcade',
			arcade:{
				debug: false,
				gravity:{y:0}
			}
		},
		scene:{
			preload:preload,
			create:create,
			update:update,
		},
		scale:{
			zoom: 2,
		},
};

game=new Phaser.Game(config);

function preload()
{
	this.load.image('labtiles','assets/mapa/Labspritesheet.png');
	this.load.image('terraintiles','assets/mapa/terrain.png');
	this.load.image('maniquiReal','assets/mapa/maniquiReal.png');
	this.load.tilemapTiledJSON('laboratorio', 'assets/mapa/lab.json');

	this.load.image('tanque','assets/images/BoxTank+canon.png');
	this.load.image('tanqueFront','assets/images/BoxTank+canon-front.png');
	this.load.image('taladroBack','assets/images/BoxTank+canon-back.png');
	this.load.image('sombra_bala','assets/images/sombra_bala.png');
	this.load.image('huellas','assets/images/huellas.png');
	this.load.image('bala','assets/images/bala.png');
	this.load.image('cursor','assets/images/cursor.png');
	this.load.image('shapeshifter','assets/images/maniqui.png');
	this.load.image('shapeshifterMuerto','assets/images/shapeShifterMuerto.png');

	this.load.image('humo','assets/particles/humo.png');
	this.load.image('polvo','assets/particles/polvo.png');

	this.load.spritesheet('bum','assets/images/bum.png', { frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('taladroDerecha','assets/images/taladroDerecha.png', { frameWidth: 40, frameHeight: 32});
	this.load.spritesheet('taladroAlante','assets/images/taladroAlante.png', { frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('shapeshifterSheet','assets/images/ShapeShifter.png', { frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('shapeshifterSheet2','assets/images/ShapeShifterWalk.png', { frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('SkullAG','assets/images/SkullAG.png', { frameWidth: 32, frameHeight: 48});
}

function create()
{
	playerVelocidadReal = 150;
	playerVelocidad = 150;
	balaVelocidad = 200;
	tiempoEntreSpawn = 60;
	tiempoEntreHuellas = 0;
	spawnTemp = 0;
	spaceTiempoX = 0;
	spaceTiempoY = 0;

	balaTemp = 0;
	tiempoEntreBalas = 120;

	scene = this;

	this.anims.create({
		key: 'explosion',
		frames: this.anims.generateFrameNumbers('bum'),
		frameRate: 20,
	});

	this.anims.create({
		key: 'taladroDerechaAnim',
		frames: this.anims.generateFrameNumbers('taladroDerecha'),
		frameRate: 50,
		repeat: -1
	});

	this.anims.create({
		key: 'taladroAlanteAnim',
		frames: this.anims.generateFrameNumbers('taladroAlante'),
		frameRate: 25,
		repeat: -1
	});

	this.anims.create({
		key: 'shapeshifterTransform',
		frames: this.anims.generateFrameNumbers('shapeshifterSheet'),
		frameRate: 25,
		repeat: 0
	});

	this.anims.create({
		key: 'shapeshifterWalk',
		frames: this.anims.generateFrameNumbers('shapeshifterSheet2'),
		frameRate: 25,
		repeat: 0
	});

	this.anims.create({
		key: 'SkullAGAnim',
		frames: this.anims.generateFrameNumbers('SkullAG'),
		frameRate: 4,
		repeat: -1
	});
	//console.log(config)
	//console.log(game)

	//muros = this.physics.add.group();

	const map = this.make.tilemap({key: 'laboratorio'});
	const tileset = map.addTilesetImage('Lab', 'labtiles');
	const tileset2 = map.addTilesetImage('terrain', 'terraintiles');
	const tileset3 = map.addTilesetImage('maniquiReal', 'maniquiReal');
	const allTilesets = [tileset, tileset2, tileset3];
	map.createLayer('Capa de patrones 1', allTilesets).setDepth(0);
	paredes = map.createLayer('Capa de patrones 2', allTilesets).setDepth(0);
	elementosMapa = map.createLayer('Capa de patrones 5', allTilesets).setDepth(0);
	elementosMapa2 = map.createLayer('Capa de patrones 6', allTilesets).setDepth(1);
	obstaculos1 = map.createLayer('Capa de patrones 3', allTilesets).setDepth(10);
	obstaculos2 = map.createLayer('Capa de patrones 4', allTilesets).setDepth(10);
	obstaculosManiqui = map.createLayer('maniquis', allTilesets).setDepth(10);

	allLayers = [paredes, obstaculos1, obstaculos2, obstaculosManiqui]
	
	playerTileSpawner = map.createFromObjects('Capa de Objetos 1');

	playerSpawnPoint = new Array();

	playerTileSpawner.forEach(obj => {
		this.physics.world.enable(obj);
		obj.setAlpha(0);

		obj.y+=32;

		playerSpawnPoint.unshift(obj);
	})

	/*rocaTiles = map.createFromObjects('Capa de Objetos 2');

	rocas = this.physics.add.group();

	rocaTiles.forEach(obj => {
		var r = rocas.create(obj.x, obj.y, '');
		obj.setAlpha(0);

		//obj.y+=32;
	})*/

	spawnID = playerSpawnPoint.length-1;

	paredes.setCollisionByProperty({ collides: true});
	obstaculos1.setCollisionByProperty({ collides: true});
	obstaculos2.setCollisionByProperty({ collides: true});
	obstaculosManiqui.setCollisionByProperty({ collides: true});
	//obstaculosManiqui -= 16;

	const debubGraphics = this.add.graphics().setAlpha(0.55);
	/*paredes.renderDebug(debubGraphics,{
		tileColor:null,
		collidingTileColor: new Phaser.Display.Color(243,134,48,255),
		faceColor: new Phaser.Display.Color(40,39,37,255)
	});*/

	/*obstaculos1.renderDebug(debubGraphics,{
		tileColor:null,
		collidingTileColor: new Phaser.Display.Color(243,134,48,255),
		faceColor: new Phaser.Display.Color(40,39,37,255)
	});*/

	/*obstaculos2.renderDebug(debubGraphics,{
		tileColor:null,
		collidingTileColor: new Phaser.Display.Color(243,134,48,255),
		faceColor: new Phaser.Display.Color(40,39,37,255)
	});*/

	/*const debugGraphics = this.add.graphics().setAlpha(0.7);

	paredes.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243,234,48,255),
		faceColor: new Phaser.Display.Color(40,39,37,255)
	})*/

	//suelo = map.getObjectLayer('Capa de Objetos 1');


	document.body.style.cursor = 'none';

	player=this.physics.add.sprite(playerSpawnPoint[spawnID].x,playerSpawnPoint[spawnID].y,'tanque').setDepth(5);
	player.setOrigin(0.5);
	player.setCircle(16, 0);
	player.inmune = false;
	player.inmovil = false;
	player.muerto = false;
	player.emitter = new Phaser.Events.EventEmitter();
	player.vida = 12;
	player.inmuneT = 0;
	emitterHumo = scene.add.particles('humo').setDepth(5);
	emitterPolvo = scene.add.particles('polvo').setDepth(1);

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

	arenaEmitter = emitterPolvo.createEmitter({
		alpha: { start: 1, end: 0 },
		scale: { start: 0.25, end: 0.75 },
		//tint: { start: 0xff945e, end: 0xff945e },
		speed: 75,

		angle: -90,
		gravityY: 300,
		//accelerationx: 0,
		lifespan: { min: 400, max: 500 },
		//blendMode: 'ERASE',
		frequency: 100,
		tint: 0xf6c998
		//maxParticles: 10,
	});
	arenaEmitter.setPosition(player.x, player.y).stop();

	player.emitter.stop();

	player.emitter.setPosition(player.x, player.y);

	player.taladro = this.add.rectangle(player.x, player.y, 8, 8);
	this.physics.add.existing(player.taladro, false);

	balas = this.physics.add.group();

	huellas = this.add.group();
	//balas.sombra = this.add.group();

	cursor = this.add.image(0,0,'cursor').setDepth(20);
	cursor.setOrigin(0.5)
	//cursor.setOrigin(0,0);
	//cursor.setScale(0.5)

	pointer = this.input.activePointer;
	console.log(pointer)

	cursor.pointer = pointer;

	/*this.input.on('pointerdown', function (pointer,localX,localY) {

		
	});*/
	//this.physics.add.overlap(player, , pisandoSuelo, null, this);

	this.cameras.main.startFollow(player);

	KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	SPACE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	//keyObj.on('down', function(event) { /* ... */ });
	//keyObj.on('up', function(event) { /* ... */ });
	//FIRE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	KeyP=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

	this.physics.add.collider(player, allLayers);

	deadlyTiles = elementosMapa.filterTiles(tile => tile.properties.deadly).map(x => x.index);

	elementosMapa.setTileIndexCallback(deadlyTiles, fallDeath, this.physics.add.overlap(player, elementosMapa));

	huellasTiles = elementosMapa.filterTiles(tile => tile.properties.huellas).map(x => x.index);

	elementosMapa.setTileIndexCallback(huellasTiles, createHuellas, this.physics.add.overlap(player, elementosMapa));
	//elementosMapa.setTileIndexCallback(huellasTiles, createHuellas, this.physics.add.overlap(player, elementosMapa))

	destructibleTiles1 = obstaculos1.filterTiles(tile => tile.properties.destructible).map(x => x.index);
	//destructibleTiles.unshift(obstaculos2.filterTiles(tile => tile.properties.destructible).map(x => x.index));
	destructibleTiles2 = obstaculos2.filterTiles(tile => tile.properties.destructible).map(x => x.index);
	destructibleTiles3 = obstaculosManiqui.filterTiles(tile => tile.properties.destructible).map(x => x.index);
	//console.log(destructibleTiles[1])

	obstaculos1.setTileIndexCallback(destructibleTiles1, destruirRocas, this.physics.add.overlap(player.taladro, obstaculos1))
	obstaculos2.setTileIndexCallback(destructibleTiles2, destruirRocas, this.physics.add.overlap(player.taladro, obstaculos2))
	obstaculosManiqui.setTileIndexCallback(destructibleTiles3, destruirRocas, this.physics.add.overlap(player.taladro, obstaculosManiqui))

	//casa = elementosMapa._events.addedtoscene.context.culledTiles;
	//console.log(casa[2])
	//console.log(elementosMapa._events.addedtoscene.context)

	npc = map.createFromObjects('Capa de Objetos 2');

	shapeShifterGroup = this.physics.add.group();
	scene.physics.add.collider(shapeShifterGroup, shapeShifterGroup);
	scene.physics.add.collider(shapeShifterGroup, allLayers);
	scene.physics.add.overlap(player, shapeShifterGroup, herirPersonaje, null, scene);

	npc.forEach(obj => {
		console.log(obj)
		if(obj.name == 'shapeshifter')
		{
			//shapeShifterGroup.add(obj)
			obj.setAlpha(0)
			createShapeshifter(obj);
		}
		if(obj.name == 'SkullAG')
		{
			//shapeShifterGroup.add(obj)
			//createShapeshifter(obj);
			skullAG = this.add.sprite(obj.x, obj.y-8, 'SkullAG').setDepth(5)
			skullAG.play('SkullAGAnim', true)
			obj.destroy()
		}
	})
	elementosMapa.setTileIndexCallback(deadlyTiles, fallDeath, this.physics.add.overlap(shapeShifterGroup, elementosMapa));

	//this.physics.add.overlap(player.taladro, shapeShifterGroup, herirPersonaje, null, this);
	text = this.add.text(10, 10, 'vida: ' + player.vida, { font: '16px Courier', fill: '#000000' }).setDepth(100)//;text.setText('vida: ' + player.vida, player.x, player.y);
	text.setScrollFactor(0)
}

function createShapeshifter(obj)
{
	s = shapeShifterGroup.create(obj.x, obj.y, 'shapeshifter')
	s.inmovil = false;
	//s.setTexture('shapeshifter');
	//s.y -= 16;
	s.piesY = -3;

	s.setDepth(4);

	s.setScale(1.5);

	s.setOrigin(0.5,0.9)
	s.vida = 2;

	s.detectionbox = scene.add.rectangle(s.x, s.y, 200, 200);
	scene.physics.add.existing(s.detectionbox, false);

	s.detectionbox.detectado = false;

	scene.physics.add.overlap(player, s.detectionbox, detectarJugador, null, scene);

	s.setSize(20, 16)
	s.setOffset(6, 14)
	//scene.physics.add.collider(s, shapeShifterGroup);
}

function herirPersonaje(obj, e)
{
	if(!e.inmune&& obj != player)
	{
		//console.log(obj)
		e.detectionbox.detectado = true;
		e.vida--;
		e.inmune = true;
		
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween)
			{
				var value = Math.floor(tween.getValue());

				e.inmune = true;

				e.setAlpha(value % 2)

				if(value == 0)
				{
					e.setAlpha(1)
					e.inmune = false;
				}
			}
		});
		//console.log('hola');
	}
	if(!obj.inmune && obj == player)
	{
		obj.vida--;
		obj.inmune = true;
		
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween)
			{
				var value = Math.floor(tween.getValue());

				//obj.inmune = true;

				obj.setAlpha(value % 2)

				if(value == 0)
				{
					obj.setAlpha(1)
					//obj.inmune = false;
				}
			}
		});
		obj.inmuneT = 90;
		//console.log('hola');
	}
}

function detectarJugador(pj, db)
{
	db.detectado = true;
}

function destruirRocas(taladro,layer)
{
	//console.log('layer')
	if(SPACE.isDown && layer.properties.destructible == true && taladro == player.taladro)
	{
		layer.properties.vida--;
		scene.cameras.main.shake(100, 0.01);

		console.log(layer)
		//layer.height++;
		//layer.pixelY++;
		//layer.setDepth(0)
		//player.setTint(layer.tint);
		
		if(layer.properties.vida <= 0)
		{
			layer.properties.collides = false;
			layer.properties.destructible = false;

			//scene.add.sprite(layer.x*32 + layer.layer.x + 16, layer.y*32 + layer.layer.y + 16, 'tanque')
			//layer.y -= 1;collideDown
			collisionSwitch(layer, false);
			layer.setAlpha(0);
			//console.log(layer)
			//scene.physics.world.enable(layer);
		}
	}
}

function collisionSwitch(obj, value)
{
	obj.collideDown = value;
	obj.collideLeft = value;
	obj.collideRight = value;
	obj.collideUp = value;
}

function createHuellas(obj,layer)
{
	//console.log(layer)
	//console.log(layer.index)
	//console.log(huellasTilesId.pop('6'))

	//layer.index
	/*if (layer.properties.huellas)
	{
		layer.properties.huellas=false
	}*/
	if (tiempoEntreHuellas <= 0 && obj.moviendose)
	{
		//obj.emitter.emit('bum', obj.x, obj.y);
		//tiempoEntreHuellas = 10;
		if(obj.piesY != null)
		{
			arenaEmitter.emitParticleAt(obj.x, obj.y+obj.piesY)
		}
		else{arenaEmitter.emitParticleAt(obj.x, obj.y+obj.height/2-obj.height/6)}
		
		/*var h = huellas.create(obj.x, obj.y,'huellas').setAlpha(0.25);
		h.setDepth(0)
		h.tiempoVida = 120;*/
	}
	//tiempoEntreHuellas--;
	//console.log(obj.tiempoEntreHuellas)
}

function updateHuellas()
{
	Phaser.Actions.Call(huellas.getChildren(),function(h)
	{
		h.tiempoVida--;
		if (h.tiempoVida <= 0)
		{
			h.destroy();
		}
	});
}

function fallDeath(pj, layer)
{
	if (!pj.inmovil)
	{
		//console.log('Deberias estar muerto')

		pj.inmovil = true;
		pj.inmune = true;
		player.emitter.stop();

		pj.setVelocityX(0);
		pj.setVelocityY(0);

		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 2000,
			onUpdate: function (tween)
			{
				var value255 = Math.floor(tween.getValue()/100 * 255);
				var value = Math.floor(tween.getValue());

				pj.setTint(Phaser.Display.Color.GetColor(value255, value255, value255));

				pj.angle = (100-value) * 5;

				pj.setScale(value * 0.01);
				//console.log(tween.getValue())

				if(value <= 0 && pj == player)
				{
					pj.x = playerSpawnPoint[spawnID].x;
					pj.y = playerSpawnPoint[spawnID].y;
					if (tween.getValue() <= 0)
					{
						pj.vida -= 2;
					}

					pj.angle = 0;

					pj.setTint(0xffffff)

					pj.setScale(1);

					pj.inmovil = false;
					pj.inmune = false;

				}
				else if(value == 0 && pj.detectionbox != null)
				{
					//pj.detectionbox = null;
					pj.detectionbox.destroy()
					pj.destroy()
				}
				else if(value == 0)
				{
					pj.destroy()
				}
			}
		});
	}
}

function update()
{
	if(!player.muerto && !player.inmovil)
	{
		input.call(this);
		////console.log(player.y)
	}

	//tiempoEntreHuellas--;

	updateHuellas();
	updatebala();
	puntero();
	updateShapeshifter()

	if (tiempoEntreHuellas <= 0)
	{
		tiempoEntreHuellas = 5;
	}
	tiempoEntreHuellas--;

	//console.log(pointer.event.button)
	text.setText('vida: ' + player.vida, player.x, player.y);
	playerVelocidad = playerVelocidadReal;
}

function puntero()
{
	if (pointer.isDown)
	{
		cursor.setTint(0xff0000);
	}
	else
	{
		cursor.setTint(0xffffff);
	}
	cursor.x = player.x - config.width / 2 + pointer.x;
	cursor.y = player.y - config.height / 2 + pointer.y;
}

function input()
{
	move = false;
	if(KeyW.isDown){
		//player.setVelocityY(-playerVelocidad);
		player.vectorY=-1;
		//player.setTexture('tanqueFront');
		player.look = 'up';
	}
	else if(KeyS.isDown){
		//player.setVelocityY(playerVelocidad);

		player.vectorY=1;

		player.look = 'down';	
	}
	else
	{
		//player.setVelocityY(0);
		player.vectorY=0;
	}

	if (SPACE.isDown)
	{
		//console.log('patata')
		playerVelocidad += 75;
	}

	if(KeyA.isDown){
		//player.setVelocityX(-playerVelocidad);
		//player.animado++;
		player.vectorX=-1;
		player.flipX = true;

		player.look = 'left';
	}
	else if(KeyD.isDown){
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

	playerAnims();

	spawnTemp--;
	if (KeyP.isDown && spawnTemp <= 0)
	{
		spawnTemp = tiempoEntreSpawn;
		spawnID--;
		if(spawnID < 0)
		{
			spawnID = playerSpawnPoint.length-1;
		}

		player.x = playerSpawnPoint[spawnID].x;
		player.y = playerSpawnPoint[spawnID].y;
	}

	balaTemp--;
	if (pointer.isDown && balaTemp <= 0)
	{
		balaTemp = tiempoEntreBalas;
		generatebala()
		//console.log("sausage")
	}

	player.dir = new Phaser.Math.Vector2( player.vectorX, player.vectorY);
	player.dir.normalize();
	player.setVelocityX(playerVelocidad*player.dir.x);
	player.setVelocityY(playerVelocidad*player.dir.y);

	if(player.dir.x != 0 || player.dir.y != 0) {player.moviendose = true;}
	else{player.moviendose = false;}
	

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

function playerAnims()
{
	if(player.look == 'up')
	{

		if(SPACE.isDown)
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
		if(SPACE.isDown)
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
		if(SPACE.isDown)
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
		if(SPACE.isDown)
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
	/*if (SPACE.isDown)
	{
		
		if (spaceTiempoX==0)
		{
			player.play('taladroDerechaAnim')
			player.setCircle(16, 4);
		}
		spaceTiempoX++;
		//console.log(spaceTiempo)
	}
	else
	{
		spaceTiempoX = 0;
		player.stop()
		player.setTexture('tanque');
		player.setCircle(16, 0);
	}*/
}

function pisandoSuelo()
{
	//console.log("patata!!");
}

function generatebala()
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

function updatebala()
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
			b.explosiontemp=30;
			b.setAlpha(0);
			scene.physics.add.overlap(b.explosion, shapeShifterGroup, herirPersonaje, null, scene);
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

function updateShapeshifter(s)
{
	Phaser.Actions.Call(shapeShifterGroup.getChildren(),function(s)
	{
		if(s.detectionbox.detectado && !s.transformado)
		{
			s.transformado = true;
			s.play('shapeshifterTransform')
		}

		//console.log(s.anims.currentFrame.isLast)

		if(s.transformado == true && !s.inmovil && s.vida > 0)
		{
			if(s.anims.currentFrame.isLast)
			{
				s.play('shapeshifterWalk', true)
				s.moviendose = true;
				//scene.physics.accelerateToObject(s, player)
				//scene.physics.moveToObject(s, player, 150);
				scene.physics.moveTo(s, player.x, player.y+11, 150);
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
			s.play('shapeshifterWalk', false);
			s.detectionbox.destroy();
			s.setTexture('shapeshifterMuerto');
			s.setTint(0xaaaaaa)
			s.body.enable = false;
		}


		s.detectionbox.y = s.y;
		s.detectionbox.x = s.x;


	})
}