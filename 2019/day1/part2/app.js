input = input.split(/\s/).filter(x=>+x).map(x=>+x);

let output = 0;

const calculate = (x) => {
	const y = ~~(x/3)-2;
	if (y <= 0) return;
	output += y;
	calculate(y);
};

for (const i of input) {
	calculate(i);
}

console.log(output);