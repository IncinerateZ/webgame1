const assetsPath = './src/assets';

import Entity from './Entity.js';
import animations from '../assets/animations/player.js';
import { World } from './World.js';

export default class Player extends Entity {
    constructor({
        imgName = null,
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
            imgName: imgName,
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
        });
    }

    imgLoad() {
        super.imgLoad();
        this.setScale(1);
        this.forceTeleport(World.entrance);
    }

    forceTeleport({ i = 0, j = 0, k = 0 }) {
        let loc = World.getBlockCenter({ i: i, j: j, k: k });
        this.data.x = loc.x;
        this.data.y = loc.y;
    }

    async moveToBlock({ i = 0, j = 0, k = 0 }) {
        this.moveTo(World.getBlockCenter({ i: i, j: j, k: k }));
    }

    async moveTo({ x = 0, y = 0 }) {
        clearInterval(this.data.movingTo);
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
                this.playAnimation('blink');
            }

            this.data.x += cX;
            this.data.y += cY;
        }, 15);
        this.data.movingTo = interval;
    }

    playAnimation(animation = '') {
        if (
            !this.data.animations[animation] ||
            this.data.animations[animation].length === 0
        )
            return;
        if (this.data.runningAnimation.length > 0) {
            for (let i of this.data.runningAnimation) {
                clearTimeout(i);
            }
            this.data.runningAnimation = [];
        }
        let keyframes = this.data.animations[animation];
        for (let k = 0; k < keyframes.length; k++) {
            this.data.runningAnimation.push(
                setTimeout(() => {
                    this.data.frame_i = keyframes[k].frame.x;
                    this.data.frame_j = keyframes[k].frame.y;
                    if (k === keyframes.length - 1) {
                        this.data.runningAnimation = [];
                        this.data.frame_i = 0;
                        this.data.frame_j = 0;
                    }
                }, keyframes[k].timeOffset),
            );
        }
    }

    async rotateTo({ rad = 0 }) {
        let interval = setInterval(() => {
            if (
                rad - 0.01 <= this.data.rotationRad &&
                this.data.rotationRad <= rad + 0.01
            ) {
                clearInterval(interval);
                return;
            }
            this.data.rotationRad += 0.01;
            this.data.rotationRad = this.data.rotationRad % (2 * Math.PI);
        }, 15);
    }
}
