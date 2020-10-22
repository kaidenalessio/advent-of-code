const ADD = 1;
const MULT = 2;
const HALT = 99;
const UNKNOWN = -1;

const run = (input) => {

	const memory = input.slice();

	let i = 0; // instruction pointer

	while (true) {

		let halt;
		let haltCode;

		const instruction = memory[i];

		switch (instruction) {
			case ADD: {
				const j = [memory[i+1], memory[i+2], memory[i+3]]; // parameters

				// execute instruction
				memory[j[2]] = memory[j[0]] + memory[j[1]];

				// After an instruction finishes, instruction pointer
				// increases by the number of values in the instruction
				i += 1 + j.length;

				break;
			}

			case MULT: {
				const j = [memory[i+1], memory[i+2], memory[i+3]];

				memory[j[2]] = memory[j[0]] * memory[j[1]];

				i += 1 + j.length;

				break;
			}

			case HALT:
				halt = true;
				haltCode = HALT;

				i += 1;

				break;

			default:
				halt = true;
				haltCode = UNKNOWN;

				i += 1;

				break;
		}

		if (halt) {
			return {
				output: memory,
				haltCode: haltCode
			};
		}
	}
};

input[1] = 12;
input[2] = 2;

const attempt = run(input);

const output = attempt.output;

console.log(output[0]);
console.log(attempt.haltCode);