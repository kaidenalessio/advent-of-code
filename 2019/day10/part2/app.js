input = input.split(/\s/).filter(x=>x.length);

const EMPTY = '.';
const ASTEROID = '#';

const map = input.map((y) => {
	const x = [];
	for (let i = 0; i < y.length; i++) {
		x.push(y[i]);
	}
	return x;
});

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	set(x, y) {
		this.x = x;
		this.y = y;
	}
	add(p) {
		this.x += p.x;
		this.y += p.y;
		return this;
	}
	clone() {
		return new Point(this.x, this.y);
	}
	equals(p) {
		return this.x === p.x && this.y === p.y;
	}
	notEquals(x, y) {
		return this.x !== x || this.y !== y;
	}
	get mapValue() {
		return map[this.y][this.x];
	}
	static angleBetween(p1, p2) {
		return Math.atan2(p2.y-p1.y, p2.x-p1.x);
	}
	static polar(angle, length=1e-6) {
		return new Point(Math.cos(angle)*length, Math.sin(angle)*length);
	}
}

class Line {
	constructor(points=[]) {
		this.p = points;
	}
	intersectsPoint(p, epsilon=1e-6) {
		const angleBetween = Point.angleBetween(this.p[0], this.p[1]);
		const line = new Line([Point.polar(angleBetween-Math.PI*0.5, epsilon).add(p), Point.polar(angleBetween+Math.PI*0.5, epsilon).add(p)]);
		const s1 = {
			x: this.p[1].x - this.p[0].x,
			y: this.p[1].y - this.p[0].y
		};
		const s2 = {
			x: line.p[1].x - line.p[0].x,
			y: line.p[1].y - line.p[0].y
		};
		const s = (-s1.y * (this.p[0].x - line.p[0].x) + s1.x * (this.p[0].y - line.p[0].y)) / (-s2.x * s1.y + s1.x * s2.y);
		const t = (s2.x * (this.p[0].y - line.p[0].y) - s2.y * (this.p[0].x - line.p[0].x)) / (-s2.x * s1.y + s1.x * s2.y);
		return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
	}
}

class PointList {
	constructor(list) {
		this.list = list;
	}
	push(p) {
		this.list.push(p);
	}
	shift() {
		return this.list.shift();
	}
	includes(p) {
		for (const q of this.list) {
			if (q.equals(p)) return true;
		}
		return false;
	}
	get length() {
		return this.list.length;
	}
}

let now = performance.now();
console.log(`calculating best location... (${map.length * map[0].length} scans required)`);

const detectedList = [];

for (let i = 0; i < map.length; i++) {
	for (let j = 0; j < map[i].length; j++) {
		console.log('scanning...');

		const root = new Point(j, i);

		if (root.mapValue === ASTEROID) {

			const openset = new PointList([root.clone()]);
			const closedset = new PointList([]);

			const detected = [];

			const addNeighbour = (x, y) => {
				const n = new Point(x, y);
				if (!openset.includes(n) && !closedset.includes(n)) openset.push(n);
			};

			while (openset.length > 0) {

				const current = openset.shift();

				if (!current.equals(root) && current.mapValue === ASTEROID) {
					let blocked = false;
					for (const d of detected) {
						const line = new Line([current, root]);
						if (line.intersectsPoint(d)) {
							blocked = true;
							break;
						}
					}
					if (!blocked) detected.push(current.clone());
				}

				if (current.y > 0) addNeighbour(current.x, current.y - 1);
				if (current.x > 0) addNeighbour(current.x - 1, current.y);
				if (current.y < map.length - 1) addNeighbour(current.x, current.y + 1);
				if (current.x < map[i].length - 1) addNeighbour(current.x + 1, current.y);

				closedset.push(current.clone());
			}
			detectedList.push({ list: detected, x: j, y: i });
		}
	}
}

let bestLocation = new Point(-1, -1);
let mostDetected = Number.NEGATIVE_INFINITY;

for (const d of detectedList) {
	const detected = d.list.length;
	if (detected > mostDetected) {
		mostDetected = detected;
		bestLocation.set(d.x, d.y);
	}
}

console.log(`done! ${(~~(performance.now() - now) * 0.001).toFixed(4)}s`);
console.log(`best location (${bestLocation.x}, ${bestLocation.y})`, bestLocation);
console.log('most detected', mostDetected);

const vaporize = (options={}) => {
	const map = options.map;
	const laser = {
		length: options.laserLength,
		position: options.laserPosition,
		direction: options.laserDirection,
		directionIncrement: options.directionIncrement
	};
	const epsilon = options.epsilon || 1e-6;
	const result = options.result || [];
	const asteroids = [];
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (laser.position.notEquals(j, i) && map[i][j] === ASTEROID) {
				asteroids.push({ x: j, y: i });
			}
		}
	}
	console.log('asteroids to vaporize', asteroids.length);
	while (asteroids.length > 0) {
		const laserStart = laser.position;
		const laserEnd = Point.polar(laser.direction, laser.length).add(laser.position);
		const laserLine = new Line([laserStart, laserEnd]);
		for (let i = asteroids.length - 1; i >= 0; --i) {
			if (laserLine.intersectsPoint(asteroids[i], epsilon)) {
				console.log(`vaporized (${asteroids[i].x}, ${asteroids[i].y}), total: ${result.length+1}`);
				result.push(asteroids.splice(i, 1)[0]);
				break;
			}
		}
		laser.direction += laser.directionIncrement;
		if (result.length === options.stopAt) break;
	}
	return result;
};

now = performance.now();
console.log('vaporizing...');

Math.degtorad = (deg) => deg * Math.PI / 180;

const result = [];
vaporize({
	map: map,
	laserLength: 100000,
	laserPosition: bestLocation,
	laserDirection: Math.degtorad(-90),
	directionIncrement: Math.degtorad(0.5),
	stopAt: 200,
	epsilon: 0.1, // point radius
	result: result
});

let answer = result.pop();
answer = answer.x * 100 + answer.y;

console.log(`done! ${(~~(performance.now() - now) * 0.001).toFixed(4)}s`);
console.log('answer', answer);