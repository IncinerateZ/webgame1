import Entity from './Entity.js';

export default class Player extends Entity {
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
        facingOrigin = true,
        hc = null,
    }) {
        super({
            img: img,
            x: x,
            y: y,
            z: z,
            speed_x: speed_x,
            speed_y: speed_y,
            scale: scale,
            rotationRad: rotationRad,
            displayName: displayName,
            facingOrigin: facingOrigin,
            hc: hc,
        });
    }

    imgLoad() {
        super.imgLoad();
        this.setScale(0.5);
    }

    async moveTo({ x = 0, y = 0 }) {
        clearInterval(this.data.movingTo);
        x -= this.data.width / 2;
        y -= this.data.height;
        let interval = setInterval(() => {
            let dX = x - this.data.x;
            let dY = y - this.data.y;
            this.data.facingOrigin = dX > 0 ? true : false;

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
}
