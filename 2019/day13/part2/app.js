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

const EMPTY = 0;
const WALL = 1;
const BLOCK = 2;
const PADDLE = 3;
const BALL = 4;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
canvas.width = 50 * tileSize;
canvas.height = 50 * tileSize;
document.body.appendChild(canvas);

input[0] = 2;
let com = {
	memory: input
};
const render = () => {
	com = run({
		program: com.memory,
		onInput() {
			return 0;
		}
	});
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let score = 0;
	let totalBlock = 0;
	for (let i = 0; i < com.outputs.length; i += 3) {
		const x = com.outputs[i];
		const y = com.outputs[i+1];
		const tile = com.outputs[i+2];
		if (x === -1 && y === 0) {
			if (tile > score) {
				score = tile;
			}
			continue;
		}
		ctx.beginPath();
		switch (tile) {
			case WALL:
				ctx.fillStyle = 'black';
				ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
				break;
			case BLOCK:
				ctx.fillStyle = 'red';
				ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
				totalBlock++;
				break;
			case PADDLE:
				ctx.fillStyle = 'blue';
				ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
				break;
			case BALL:
				ctx.fillStyle = 'green';
				ctx.arc((x + 0.5) * tileSize, (y + 0.5) * tileSize, tileSize * 0.5, 0, 2 * Math.PI);
				break;
			case EMPTY:
			default: break;
		}
		ctx.fill();
	}
	ctx.font = '18px sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillStyle = 'white';
	ctx.fillText(score, 2, 2);
	if (totalBlock === 0) {
		console.log(score);
		return;
	}
	window.requestAnimationFrame(render);
};

render();