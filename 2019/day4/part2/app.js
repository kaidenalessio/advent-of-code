const passwords = [];

for (let i = input.min; i < input.max; i++) {
	const password = ''+i;

	let hasDouble = false;
	let neverDecreases = true;

	const largeGroup = [];

	for (let j = 1; j < password.length - 1; j++) {
		const char = password[j];
		if (!largeGroup.includes(char)) {
			const prevChar = password[j-1];
			const nextChar = password[j+1];
			if (char === prevChar && char === nextChar) {
				largeGroup.push(char);
			}
		}
	}

	for (let j = 1; j < password.length; j++) {
		const char = password[j];
		const prevChar = password[j-1];
		if (char === prevChar && !largeGroup.includes(char)) hasDouble = true;
		if (+char < +prevChar) neverDecreases = false;
	}

	if (hasDouble && neverDecreases) {
		passwords.push(password);
	}
}

const output = passwords.length;

console.log(output);