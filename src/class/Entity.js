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
        ctx.save();
        ctx.translate(this.getCenter().x, this.getCenter().y);
        ctx.rotate(this.data.rotationRad);
        if (!this.data.facingOrigin) ctx.scale(-1, 1);

        //if (this.data.displayName === 'inferious77') {
        ctx.drawImage(
            this.data.img,
            (this.data.frame_i * this.data.img.width) / 3,
            this.data.frame_j / 3,
            this.data.img.width / 3,
            this.data.img.height,
            -this.getRelativeCenter().x / 3,
            -this.getRelativeCenter().y,
            (this.data.img.width * this.data.scale) / 3,
            this.data.img.height * this.data.scale,
        );
        // } else {
        //     ctx.drawImage(
        //         this.data.img,
        //         -this.getRelativeCenter().x,
        //         -this.getRelativeCenter().y,
        //         this.data.img.width * this.data.scale,
        //         this.data.img.height * this.data.scale,
        //     );
        // }
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
        this.data.width = this.data.img.width * scale;
        this.data.height = this.data.img.height * scale;
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
