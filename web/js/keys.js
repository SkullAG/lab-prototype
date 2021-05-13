export var pointer
export var Up
export var Down
export var Left
export var Right
export var Hability
export var P

export function create(scene)
{
	pointer = scene.input.activePointer
	Up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	Down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	Left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	Right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	Hability = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	P = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
}