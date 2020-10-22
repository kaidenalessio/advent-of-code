const ADD = 1;
const MULT = 2;
const HALT = 99;
const INPUT = 3;
const OUTPUT = 4;
const UNKNOWN = -1;
const POSITION = 0;
const IMMEDIATE = 1;

const ask = () => {
	return 1;
};

const run = (input) => {
	const memory = input.slice();
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

		switch (opcode) {
			case ADD: {
				const length = 3;
				const address = [];
				for (let j = 1; j <= length; j++) {
					switch (mode[j-1]) {
						case IMMEDIATE: address.push(i+j); break;
						default: address.push(memory[i+j]); break;
					}
				}
				memory[address[2]] = memory[address[0]] + memory[address[1]];
				i += length;
				break;
			}

			case MULT: {
				const length = 3;
				const address = [];
				for (let j = 1; j <= length; j++) {
					switch (mode[j-1]) {
						case IMMEDIATE: address.push(i+j); break;
						default: address.push(memory[i+j]); break;
					}
				}
				memory[address[2]] = memory[address[0]] * memory[address[1]];
				i += length;
				break;
			}

			case INPUT: {
				const length = 1;
				const address = [memory[i+1]];
				memory[address[0]] = ask();
				i += length;
				break;
			}

			case OUTPUT: {
				const length = 1;
				const address = [memory[i+1]];
				outputs.push(memory[address[0]]);
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

		i++;

		if (halt) {
			return { memory, outputs, haltCode };
		}
	}
};

const attempt = run(input);
const output = attempt.outputs[attempt.outputs.length - 1];

console.log('input', input);
console.log('attempt', attempt);
console.log('output', output);