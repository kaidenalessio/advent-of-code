let input = `
	<x=3, y=3, z=0>
	<x=4, y=-16, z=2>
	<x=-10, y=-6, z=5>
	<x=-3, y=0, z=-13>
`;

const extract = (x) => {
	const y = {};
	x = x.replace(/<|>|\s/g, '').split(',');
	for (const i of x) {
		const j = i.split('=');
		const key = j[0];
		const value = Number(j[1]);
		y[key] = value;
	}
	return y;
};

input = input.split(/\n/).filter(x=>x.length).map(extract);