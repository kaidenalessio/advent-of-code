const image = {
	w: 25,
	h: 6,
	layers: [],
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

let fewestDigit0 = Number.POSITIVE_INFINITY;
let fewestLayerIndex;
for (let i = image.layers.length - 1; i >= 0; --i) {
	const digit0 = image.countDigit(image.layers[i], 0);
	if (digit0 < fewestDigit0) {
		fewestDigit0 = digit0;
		fewestLayerIndex = i;
	}
}

const output = image.countDigit(image.layers[fewestLayerIndex], 1) * image.countDigit(image.layers[fewestLayerIndex], 2);
console.log(output);