class Vec3 {
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	static checkArgs(x, y, z) {
		if (typeof x === 'object') {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		return [x, y, z];
	}
	add(x, y, z) {
		[x, y, z] = Vec3.checkArgs(x, y, z);
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}
	sub(x, y, z) {
		[x, y, z] = Vec3.checkArgs(x, y, z);
		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	}
	reset() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		return this;
	}
	get xyz() {
		return this.x + this.y + this.z;
	}
	get abs() {
		return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
	}
	get sign() {
		return new Vec3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.z));
	}
	static add(a, b) {
		return Vec3.fromObject(a).add(b);
	}
	static sub(a, b) {
		return Vec3.fromObject(a).sub(b);
	}
	static get zero() {
		return new Vec3();
	}
	static fromObject(o) {
		return new Vec3(o.x, o.y, o.z);
	}
}

class Moon {
	constructor(position) {
		this.position = position;
		this.velocity = Vec3.zero;
		this.gravity = Vec3.zero;
	}
	get kinetic() {
		return this.velocity.abs.xyz;
	}
	get potential() {
		return this.position.abs.xyz;
	}
	get totalEnergy() {
		return this.kinetic * this.potential;
	}
	calculateGravity(moons) {
		this.gravity.reset();
		for (const moon of moons) {
			if (moon !== this) {
				this.gravity.add(Vec3.sub(moon.position, this.position).sign);
			}
		}
	}
	applyGravity() {
		this.velocity.add(this.gravity);
	}
	applyVelocity() {
		this.position.add(this.velocity);
	}
	static createMoons(positionList) {
		const h = [];
		for (const i of positionList) {
			h.push(new Moon(Vec3.fromObject(i)));
		}
		return h;
	}
}

const moons = Moon.createMoons(input);
const step = () => {
	for (const moon of moons) {
		moon.calculateGravity(moons);
	}
	for (const moon of moons) {
		moon.applyGravity();
		moon.applyVelocity();
	}
};

let i = 1000;
while (i-- > 0) {
	step();
}

let totalEnergy = 0;
for (const moon of moons) {
	totalEnergy += moon.totalEnergy;
}

console.log(totalEnergy);