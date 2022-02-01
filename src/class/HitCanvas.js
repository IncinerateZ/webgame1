export class HitCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.regions = {};
    }

    createRegion(id, paths, data = {}) {
        this.regions[this.randomColor()] = { paths: paths, id: id, data: data };
    }

    rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    randomColor() {
        return `rgb(${this.randomInt(256)}, ${this.randomInt(
            256,
        )}, ${this.randomInt(256)})`;
    }

    getRegion({ x = 0, y = 0 }) {
        let data = this.ctx.getImageData(x, y, 1, 1).data;
        let rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        return this.regions[rgb] || null;
    }

    clearRegions() {
        this.regions = {};
    }

    renderRegions() {
        for (let r of Object.keys(this.regions)) {
            let paths = this.regions[r].paths;
            this.ctx.beginPath();
            for (let i = 0; i < paths.length; i++) {
                if (i === 0) this.ctx.moveTo(paths[i].x, paths[i].y);
                this.ctx.lineTo(paths[i].x, paths[i].y);
            }
            this.ctx.lineTo(paths[0].x, paths[0].y);

            //render
            this.ctx.fillStyle = r;
            this.ctx.fill();
            this.ctx.fillStyle = '#000000';
            this.ctx.strokeStyle = r;
            this.ctx.stroke();
            this.ctx.strokeStyle = '#000000';
        }
    }
}
