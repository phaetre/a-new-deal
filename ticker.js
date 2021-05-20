export class Ticker {
	/*constructor(parent, stocks, resolution, delay, focus, width) {
		this.parent = parent;
		parent.children.push(this);*/
	constructor(stocks, resolution, delay, focus, width) {
		this.stocks = stocks;
		this.stockNames = Object.keys(stocks);
		this.resolution = resolution;
		this.width = width;
		this.delay = delay;
		this.data = {};
		for (let i of this.stockNames) {
			this.data[i] = [];
		}
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = width;
		this.canvas.height = width * (window.innerHeight / window.innerWidth);
		this.tempCanvas = document.createElement('canvas');
		this.tempctx = this.tempCanvas.getContext('2d');
		this.tempCanvas.width = this.canvas.width;
		this.tempCanvas.height = this.canvas.height;

		this.focusStock = this.data[focus];
		this.scale = Math.max(...this.focusStock) * 1.05;
		this.pixelScale = (width - 50) / resolution;
	}
	render(a) {
		if (a) {
			let offset = 50;
			this.ctx.strokeStyle = '#cccc00';
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			for (let i = this.focusStock.length - this.resolution; i < this.focusStock.length; i++) {
				this.ctx.lineTo(offset + (i + this.resolution - this.focusStock.length) * this.pixelScale, (this.canvas.height - (this.focusStock[i] || 0) * (this.canvas.height / this.scale)));
			}
			this.ctx.stroke();
		}
		else {
			return 0;
		}
	}
	tick(frames) {
		if (frames % this.delay == 0) {
			for (let i of this.stockNames) {
				this.stocks[i] += Math.random();
				this.data[i].push(this.stocks[i]);
				if (this.data[i].length > this.resolution) {
					this.data[i].shift();
				}
			}
			this.scale = Math.max(...this.focusStock) * 1.05;
			return true;
		}
		return 0;
	}
}
