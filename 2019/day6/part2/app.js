input = input.split(/\s/).filter(x=>x.length);

class Node {
	constructor(data) {
		this.data = data;
		this.orbit = null;
	}
}

const nodes = {};

for (const i of input) {
	const j = i.split(')');
	if (nodes[j[0]] === undefined) {
		nodes[j[0]] = new Node(j[0]);
	}
	if (nodes[j[1]] === undefined) {
		nodes[j[1]] = new Node(j[1]);
	}
	nodes[j[1]].orbit = nodes[j[0]];
}

const countOrbit = (node) => {
	let count = 0;
	let current = node;
	while (current.orbit !== null) {
		current = current.orbit;
		count++;
	}
	return count;
};

const getOrbit = (node) => {
	let orbits = [];
	let current = node;
	while (current.orbit !== null) {
		current = current.orbit;
		orbits.push(current);
	}
	return orbits;
};

const countOrbitalTransfer = (nodeFrom, nodeTo) => {
	const fromOrbit = getOrbit(nodeFrom);
	const toOrbit = getOrbit(nodeTo);
	for (let i = 0; i < fromOrbit.length; i++) {
		for (let j = 0; j < toOrbit.length; j++) {
			if (fromOrbit[i] === toOrbit[j]) {
				return i + j;
			}
		}
	}
	return -1;
};

const output = countOrbitalTransfer(nodes['YOU'], nodes['SAN']);

console.log(output);