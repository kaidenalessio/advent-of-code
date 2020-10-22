const UP = 'U';
const LEFT = 'L';
const DOWN = 'D';
const RIGHT = 'R';

const CENTRAL_PORT_X = 0;
const CENTRAL_PORT_Y = 0;

const manhattanDistance = (x1, y1, x2, y2) => Math.abs(x2-x1) + Math.abs(y2-y1);

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Line {
	constructor(points=[]) {
		this.p = points;
	}
	addPoint(x, y) {
		this.p.push(new Point(x, y));
	}
	intersects(line) {

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

		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			return new Point(this.p[0].x + (t * s1.x), this.p[0].y + (t * s1.y));
		}
		
		return null;
	}
}

const trace = (input) => {

	const lines = [];

	let traceX = CENTRAL_PORT_X;
	let traceY = CENTRAL_PORT_Y;

	for (const i of input) {

		const direction = i[0];
		const distance = +i.substr(1);

		const line = new Line();

		line.addPoint(traceX, traceY);

		switch (direction) {
			case UP:
				traceY += distance;
				break;

			case LEFT:
				traceX -= distance;
				break;

			case DOWN:
				traceY -= distance;
				break;

			case RIGHT:
				traceX += distance;
				break;

			default:
				break;
		}

		line.addPoint(traceX, traceY);

		lines.push(line);
	}

	return lines;
};

const wire1 = trace(input[0]);
const wire2 = trace(input[1]);

const intersectsPoints = [];

for (const line1 of wire1) {
	for (const line2 of wire2) {
		const p = line1.intersects(line2);
		if (p instanceof Point) {
			intersectsPoints.push(p);
		}
	}
}

let closestDistance = Number.POSITIVE_INFINITY;

for (const p of intersectsPoints) {
	const distance = manhattanDistance(CENTRAL_PORT_X, CENTRAL_PORT_Y, p.x, p.y);
	if (distance > 0 && distance < closestDistance) {
		closestDistance = distance;
	}
}

console.log(closestDistance);