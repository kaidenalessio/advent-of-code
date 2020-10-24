const POSITION = 0;
const IMMEDIATE = 1;
const RELATIVE = 2;

const ADD 			= 1;
const MULT 			= 2;
const INPUT 		= 3;
const OUTPUT 		= 4;
const JUMP_IF_TRUE 	= 5;
const JUMP_IF_FALSE = 6;
const LESS_THAN 	= 7;
const EQUALS 		= 8;
const ADD_RELATIVE 	= 9;

const HALT = 99;
const UNKNOWN = -1;
const HALT_OUTPUT = 98;

const run = (options={}) => {

	const onInput = options.onInput;

	let askCount = 0;
	const ask = () => {
		if (onInput) return onInput(askCount++);
		else return 1;
	};

	const memory = options.program.slice();
	const outputs = [];

	let relativeBase = options.relativeBase || 0;

	let i = options.i || 0;
	while (true) {
		let instruction, opcode, mode, halt, haltCode;

		if (i < memory.length) {
			instruction = memory[i].toString().split('');
			opcode = +instruction.splice(instruction.length - 2).join('');
			mode = instruction.reverse().map(x=>+x);
			instruction = memory[i];
		}

		let autoIncrease = true;

		const getAddress = (length) => {
			const address = [];
			for (let j = 1; j <= length; j++) {
				switch (mode[j-1]) {
					case RELATIVE: address.push(relativeBase + memory[i+j]); break;
					case IMMEDIATE: address.push(i+j); break;
					default: address.push(memory[i+j]); break;
				}
			}
			return address;
		};

		switch (opcode) {
			case ADD: {
				const length = 3;
				const address = getAddress(length);
				memory[address[2]] = memory[address[0]] + memory[address[1]];
				i += length;
				break;
			}

			case MULT: {
				const length = 3;
				const address = getAddress(length);
				memory[address[2]] = memory[address[0]] * memory[address[1]];
				i += length;
				break;
			}

			case INPUT: {
				const length = 1;
				const address = getAddress(length);
				memory[address[0]] = ask();
				i += length;
				break;
			}

			case OUTPUT: {
				const length = 1;
				const address = getAddress(length);
				outputs.push(memory[address[0]]);
				i += length;
				if (options.outputTarget) {
					if (outputs.length === options.outputTarget) {
						halt = true;
						haltCode = HALT_OUTPUT;
					}
				}
				break;
			}

			case JUMP_IF_TRUE: {
				const length = 2;
				const address = getAddress(length);
				if (memory[address[0]] !== 0) {
					i = memory[address[1]];
					autoIncrease = false;
				}
				else {
					i += length;
				}
				break;
			}

			case JUMP_IF_FALSE: {
				const length = 2;
				const address = getAddress(length);
				if (memory[address[0]] === 0) {
					i = memory[address[1]];
					autoIncrease = false;
				}
				else {
					i += length;
				}
				break;
			}

			case LESS_THAN: {
				const length = 3;
				const address = getAddress(length);
				memory[address[2]] = memory[address[0]] < memory[address[1]]? 1 : 0;
				i += length;
				break;
			}

			case EQUALS: {
				const length = 3;
				const address = getAddress(length);
				memory[address[2]] = memory[address[0]] === memory[address[1]]? 1 : 0;
				i += length;
				break;
			}

			case ADD_RELATIVE: {
				const length = 1;
				const address = getAddress(length);
				relativeBase += memory[address[0]];
				i += length;
				break;
			}

			case HALT:
				halt = true;
				haltCode = HALT;
				break;

			default:
				halt = true;
				haltCode = UNKNOWN;
				break;
		}

		if (autoIncrease) i++;

		if (halt) {
			return { i, memory, outputs, haltCode, relativeBase };
		}
	}
};

const BLACK = 0;
const WHITE = 1;

const robot = {
	TURN_LEFT: 0,
	TURN_RIGHT: 1,
	com: {
		i: 0,
		memory: input,
		outputs: [],
		haltCode: UNKNOWN,
		relativeBase: 0
	},
	x: 0,
	y: 0,
	paintings: [],
	direction: -90,
	paintBlack() {
		this.paintings.push({
			x: this.x,
			y: this.y,
			color: BLACK
		});
	},
	paintWhite() {
		this.paintings.push({
			x: this.x,
			y: this.y,
			color: WHITE
		});
	},
	normalizeDirection() {
		this.direction = this.direction % 360;
		if (this.direction > 180) this.direction -= 360;
		if (this.direction < -180) this.direction += 360;
	},
	turnLeft() {
		this.direction -= 90;
		this.normalizeDirection();
	},
	turnRight() {
		this.direction += 90;
		this.normalizeDirection();
	},
	getColor() {
		for (let i = this.paintings.length - 1; i >= 0; --i) {
			if (this.paintings[i].x === this.x && this.paintings[i].y === this.y) {
				return this.paintings[i].color;
			}
		}
		return BLACK;
	},
	paint(id) {
		switch (id) {
			case BLACK: this.paintBlack(); break;
			case WHITE: this.paintWhite(); break;
		}
	},
	turn(id) {
		switch (id) {
			case this.TURN_LEFT: this.turnLeft(); break;
			case this.TURN_RIGHT: this.turnRight(); break;
		}
	},
	moveForward() {
		const d = this.direction * Math.PI / 180;
		this.x += ~~Math.cos(d);
		this.y += ~~Math.sin(d);
	},
	step() {
		let input = this.getColor();
		this.com = run({
			onInput() { return input; },
			outputTarget: 2,
			i: this.com.i,
			program: this.com.memory,
			relativeBase: this.com.relativeBase
		});
		this.paint(this.com.outputs[0]);
		this.turn(this.com.outputs[1]);
		this.moveForward();
	}
};

while (robot.com.haltCode !== HALT) {
	robot.step();
}

const includes = (arr, p, keys) => {
	keys = keys || Object.keys(p);
	for (let i = arr.length - 1; i >= 0; --i) {
		let match = true;
		for (const key of keys) {
			if (arr[i][key] === undefined || p[key] === undefined || arr[i][key] !== p[key]) {
				match = false;
				continue;
			}
		}
		if (match) {
			return true;
		}
	}
	return false;
};

const panelsPainted = [];

for (const p of robot.paintings) {
	if (!includes(panelsPainted, p, ['x', 'y'])) {
		panelsPainted.push(p);
	}
}

console.log(panelsPainted.length);