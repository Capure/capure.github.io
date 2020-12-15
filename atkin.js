onmessage = (e) => {
    const start = new Date().getTime();
    const result = benchmark();
	const stop = new Date().getTime();
	const time = stop - start;
    postMessage(JSON.stringify({
        result,
        time
    }));
}

const benchmark = (MAX = 1000000000) => {
	let buffer = new ArrayBuffer(MAX);
	let array = new Int8Array(buffer);
	const SQRT_MAX = Math.floor(Math.sqrt(MAX)) + 1;
	let sequence = [2, 4];
	let index = 0;
	let k1 = 0;
	let k = 0;
	let xUpper = Math.sqrt(MAX / 4) + 1;
	let x = 1;
	let y = 0;
	while (x < xUpper) {
		index = 0;
		k1 = 4 * x * x;
		y = 1;
		if (x % 3 == 0) {
			while (true) {
				k = k1 + y * y;
				if (k >= MAX) {
					break;
				}
				array[k] = !array[k];
				y += sequence[++index & 1];
			}
		} else {
			while (true) {
				k = k1 + y * y;
				if (k >= MAX) {
					break;
				}
				array[k] = !array[k];
				y += 2;
			}
		}
		x++;
	}
	xUpper = Math.sqrt(MAX / 3) + 1;
	x = 1;
	y = 0;
	while (x < xUpper) {
		index = 1;
		k1 = 3 * x * x;
		y = 2;
		while (true) {
			k = k1 + y * y;
			if (k >= MAX) {
				break;
			}
			array[k] = !array[k];
			y += sequence[++index & 1];
		}
		x += 2;
	}
	xUpper = Math.floor(Math.sqrt(MAX));
	x = 1;
	y = 0;
	while (x < xUpper) {
		k1 = 3 * x * x;
		if ((x & 1) == 0) {
			y = 1;
			index = 0;
		} else {
			y = 2;
			index = 1;
		}
		while (y < x) {
			k = k1 - y * y;
			if (k < MAX) {
				array[k] = !array[k];
			}
			y += sequence[++index & 1];
		}
		x++;
	}
	array[2] = true;
	array[3] = true;
	for (n = 5; n <= SQRT_MAX; n++) {
		if (array[n]) {
			n2 = n * n;
			for (k = n2; k < MAX; k += n2) {
				array[k] = false;
			}
		}
	}
	let counter = 0;
	for (let i = 0; i < MAX; i++) {
		if (array[i] == 1) {
			counter++;
		}
	}
	return counter;
};