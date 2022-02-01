import { World } from './World.js';

const assetsPath = './src/assets';

export default class Entity {
    constructor({
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
        ostore = nulls,
    }) {
        this.data = {
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
        this.ostore = ostore;
    }

    render({ ctx = null }) {}

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
