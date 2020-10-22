const passwords = [];

for (let i = input.min; i < input.max; i++) {
	const password = ''+i;

	let hasDouble = false;
	let neverDecreases = true;

	for (let j = 1; j < password.length; j++) {
		const char = password[j];
		const prevChar = password[j-1];
		if (char === prevChar) hasDouble = true;
		if (+char < +prevChar) neverDecreases = false;
	}

	if (hasDouble && neverDecreases) {
		passwords.push(password);
	}
}

const output = passwords.length;

console.log(output);