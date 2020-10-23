const POSITION = 0;
const IMMEDIATE = 1;

const ADD 			= 1;
const MULT 			= 2;
const INPUT 		= 3;
const OUTPUT 		= 4;
const JUMP_IF_TRUE 	= 5;
const JUMP_IF_FALSE = 6;
const LESS_THAN 	= 7;
const EQUALS 		= 8;

const HALT = 99;
const UNKNOWN = -1;

const run = (program, inputFn=()=>1) => {

	let askCount = 0;
	const ask = () => {
		return inputFn(askCount++);
	};

	const memory = program.slice();
	const outputs = [];

	let i = 0;
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
			return { memory, outputs, haltCode };
		}
	}
};

const mutations = (arr, muts=[], len=arr.length) => {
	if (len === 1) muts.push(arr.slice());
	for (let i = 0; i < len; i++) {
		mutations(arr, muts, len-1);
		len % 2? [arr[0], arr[len-1]] = [arr[len-1], arr[0]] : [arr[i], arr[len-1]] = [arr[len-1], arr[i]];
	}
	return muts;
};

const settings = mutations([5, 6, 7, 8, 9]);
const signals = [];

for (const setting of settings) {
	let program = input.slice();
	let signal = 0;
	let haltCode = [];

	while (true) {
		for (let i = 0; i < setting.length; i++) {
			const attempt = run(program, (j) => { return j > 0? signal : setting[i]; });
			program = attempt.memory;
			signal = attempt.outputs[attempt.outputs.length - 1];
			haltCode[i] = attempt.haltCode;
		}
		let halt = true;
		for (let i = 0; i < haltCode.length; i++) {
			if (haltCode[i] !== HALT) {
				halt = false;
			}
		}
		if (halt) break;
	}

	signals.push(signal);
}

let highestSignal = Number.NEGATIVE_INFINITY;

for (const signal of signals) {
	if (signal > highestSignal) {
		highestSignal = signal;
	}
}

console.log(highestSignal);