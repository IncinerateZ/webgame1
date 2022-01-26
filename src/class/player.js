export default class Player {
    constructor({
        img = null,
        x = 0,
        y = 0,
        z = 0,
        speed_x = 1,
        speed_y = 1,
        displayName = '',
        scale = 1,
        rotationRad = 0,
    }) {
        this.data = {
            img: img,
            x: x,
            y: y,
            z: z,
            speed_x: speed_x,
            speed_y: speed_y,
            displayName: displayName,
            scale: scale,
            rotationRad: rotationRad,
        };

        this.data.img.onload = () => {
            this.imgLoad();
        };
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.getCenter().x, this.getCenter().y);
        ctx.rotate(this.data.rotationRad);
        ctx.drawImage(
            this.data.img,
            -this.getRelativeCenter().x,
            -this.getRelativeCenter().y,
            this.data.img.width * this.data.scale,
            this.data.img.height * this.data.scale,
        );
        ctx.translate(0, 0);
        ctx.restore();
    }

    getRelativeCenter() {
        return { x: this.data.width / 2, y: this.data.height / 2 };
    }

    //absolute center
    getCenter() {
        let rel = this.getRelativeCenter();
        return { x: this.data.x + rel.x, y: this.data.y + rel.y };
    }

    imgLoad() {
        let playerdat = this.data;
        let playerImg = this.data.img;
        playerdat.width = playerImg.width;
        playerdat.height = playerImg.height;
        this.setScale(0.5);
    }

    async moveTo({ x = 0, y = 0 }) {
        clearInterval(this.data.movingTo);
        x -= this.data.width / 2;
        y -= this.data.height;
        let interval = setInterval(() => {
            let dX = x - this.data.x;
            let dY = y - this.data.y;

            let cX =
                Math.abs(dX) >= this.data.speed_x
                    ? this.data.speed_x / (dX / Math.abs(dX))
                    : 0;
            let cY =
                Math.abs(dY) >= this.data.speed_y
                    ? this.data.speed_y / (dY / Math.abs(dY))
                    : 0;

            if (
                Math.abs(dX) < this.data.speed_x &&
                Math.abs(dY) < this.data.speed_y
            ) {
                cX = dX;
                cY = dY;
                clearInterval(interval);
                console.log('finished moving');
                console.log(`x:${this.data.x} y:${this.data.y}`);
            }

            this.data.x += cX;
            this.data.y += cY;
        }, 15);
        this.data.movingTo = interval;
    }

    async rotateTo({ rad = 0 }) {
        let interval = setInterval(() => {
            if (
                rad - 0.01 <= this.data.rotationRad &&
                this.data.rotationRad <= rad + 0.01
            ) {
                console.log('finished rotating');
                clearInterval(interval);
                return;
            }
            this.data.rotationRad += 0.01;
            this.data.rotationRad = this.data.rotationRad % (2 * Math.PI);
        }, 15);
    }

    setScale(scale) {
        this.data.scale = scale;
        this.data.width = this.data.img.width * scale;
        this.data.height = this.data.img.height * scale;
    }
}
