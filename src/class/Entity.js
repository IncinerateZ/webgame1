import { World } from './World.js';

const assetsPath = './src/assets';

export default class Entity {
    constructor({
        imgName = null,
        x = 0,
        y = 0,
        z = 0,
        speed_x = 0,
        speed_y = 0,
        scale = 1,
        rotationRad = 0,
        displayName = '',
        facingOrigin = true,
        hc = null,
        animations = {},
    }) {
        this.data = {
            img: null,
            imgName: imgName,
            imgLoaded: false,
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
            animations: animations,
            runningAnimation: [],
            frame_i: 0,
            frame_j: 0,
        };

        if (this.data.imgName) {
            this.data.img = document.createElement('img');
            this.data.img.setAttribute(
                'src',
                `${assetsPath}/entities/${imgName}.png`,
            );
        }

        if (this.data.img)
            this.data.img.onload = () => {
                console.log(`${this.data.displayName} img load`);
                this.data.imgLoaded = true;
                this.imgLoad();
            };
    }

    render({ ctx = null }) {
        let frameSize = this.data.animations._dat.frameSize;
        let entitySize = this.data.animations._dat.entity;
        ctx.save();
        ctx.translate(this.data.x, this.data.y);
        ctx.rotate(this.data.rotationRad);
        if (!this.data.facingOrigin) ctx.scale(-1, 1);
        let r = (this.data.scale * (World.dY * 6)) / frameSize.height;
        ctx.drawImage(
            this.data.img,
            this.data.frame_i * frameSize.width,
            this.data.frame_j * frameSize.height,
            frameSize.width,
            frameSize.height,
            (-frameSize.width * r) / 2,
            entitySize.dYBottom * r - r * frameSize.height,
            frameSize.width * r,
            this.data.scale * World.dY * 6,
        );
        ctx.translate(0, 0);
        ctx.restore();
    }

    imgLoad() {
        let dat = this.data;
        let img = this.data.img;
        dat.width = img.width;
        dat.height = img.height;
    }

    setScale(scale) {
        this.data.scale = scale;
        this.data.width = this.data.animations._dat.frameSize.width * scale;
        this.data.height = this.data.animations._dat.frameSize.height * scale;
    }

    getRelativeCenter() {
        return { x: this.data.width / 2, y: this.data.height / 2 };
    }

    //absolute center
    getCenter() {
        let rel = this.getRelativeCenter();
        return { x: this.data.x + rel.x, y: this.data.y + rel.y };
    }
}
