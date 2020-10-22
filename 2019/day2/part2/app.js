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

const desiredOutput = 19690720;
const getNounAndVerb = () => {
	for (let noun = 0; noun <= 99; noun++) {
		for (let verb = 0; verb <= 99; verb++) {
			input[1] = noun;
			input[2] = verb;
			const attempt = run(input);
			const tentativeOutput = attempt.output[0];
			if (tentativeOutput === desiredOutput) {
				return { noun, verb };
			}
		}
	}
};

const { noun, verb } = getNounAndVerb();
const output = 100 * noun + verb;

console.log(output);