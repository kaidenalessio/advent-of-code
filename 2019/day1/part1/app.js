input = input.split(/\s/).filter(x=>+x).map(x=>+x);

let output = 0;

for (const i of input) {
	output += ~~(i/3)-2;
}

console.log(output);