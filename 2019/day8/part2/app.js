const image = {
	BLACK: 0,
	WHITE: 1,
	TRANSPARENT: 2,
	w: 25,
	h: 6,
	layers: [],
	createEmpty() {
		const layer = [];
		for (let i = 0; i < this.w; i++) {
			for (let j = 0; j < this.h; j++) {
				layer.push(this.TRANSPARENT);
			}
		}
		return layer;
	},
	createLayers(input) {
		let i = 0;
		let pointer = 0;
		while (pointer < input.length) {
			this.layers[i] = [];
			for (let y = 0; y < this.h; y++) {
				for (let x = 0; x < this.w; x++) {
					this.layers[i].push(Number(input[pointer++]));
				}
			}
			i++;
		}
	},
	countDigit(layer, digit) {
		let count = 0;
		for (let i = layer.length - 1; i >= 0; --i) {
			if (layer[i] === digit) {
				count++;
			}
		}
		return count;
	}
};

image.createLayers(input);

const finalLayer = image.createEmpty();

for (let i = image.layers.length - 1; i >= 0; --i) {
	const layer = image.layers[i];
	for (let j = layer.length - 1; j >= 0; j--) {
		const digit = layer[j];
		if (digit === image.BLACK || digit === image.WHITE) {
			finalLayer[j] = digit;
		}
	}
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const pixelRatio = 20;

canvas.width = image.w * pixelRatio;
canvas.height = image.h * pixelRatio;

const colors = ['#000', '#fff', '#fff0'];

for (let i = 0; i < finalLayer.length; i++) {
	const x = i % image.w;
	const y = ~~(i / image.w);
	ctx.fillStyle = colors[finalLayer[i]];
	ctx.fillRect(x * pixelRatio, y * pixelRatio, pixelRatio, pixelRatio);
}

document.body.style.backgroundColor = '#000';
document.body.appendChild(canvas);