const assetsPath = './src/assets';

import Entity from './Entity.js';
import animations from '../assets/animations/player.js';
import { World } from './World.js';

export default class Player extends Entity {
    constructor({
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
        images = {
            arms: {
                left: 'basic',
                right: 'basic',
            },
            body: 'basic',
            eyes: 'basic',
            hairs: 'basic',
            head: 'basic',
            legs: {
                left: 'basic',
                right: 'basic',
            },
            mouths: 'basic',
            nose: 'basic',
        },
        ostore = null,
    }) {
        super({
            x: x,
            y: y,
            z: z,
            speed_x: speed_x,
            speed_y: speed_y,
            scale: scale,
            rotationRad: rotationRad,
            displayName: displayName,
            facingOrigin: facingOrigin,
            hc: hc, //hitcanvas
            animations: animations,
            ostore: ostore,
        });

        this.data.appearances = images;
        this.data.images = {
            arms: {
                left: null,
                right: null,
            },
            body: null,
            eyes: null,
            hairs: null,
            head: null,
            legs: {
                left: null,
                right: null,
            },
            mouths: null,
            nose: null,
        };
        this.data.toRenderCount = Number.MAX_SAFE_INTEGER;
        this.data.imageLoadAttempts = -1;
        this.data.tryLoadImages = null;
        this.attemptLoadImages();
    }

    imgLoad(images) {
        let count = 0;
        for (let k of Object.keys(images)) {
            let v = images[k];
            let imgPath = '';
            if (typeof v === 'object' && !Array.isArray(v) && v !== null) {
                for (let k2 of Object.keys(v)) {
                    if (v[k2] !== null) {
                        imgPath = `${assetsPath}/entities/player/${k}/${k2}/${v[k2]}.png`;
                        count++;

                        //init image
                        let e = document.createElement('img');
                        e.setAttribute('src', imgPath);
                        e.onload = () => this.data.toRenderCount--;
                        this.data.images[k][k2] = e;
                    }
                }
            } else {
                if (v !== null) {
                    imgPath = `${assetsPath}/entities/player/${k}/${v}.png`;
                    count++;

                    //init image
                    let e = document.createElement('img');
                    e.setAttribute('src', imgPath);
                    e.onload = () => this.data.toRenderCount--;
                    this.data.images[k] = e;
                }
            }
        }
        this.data.toRenderCount = count;

        this.setScale(1);

        let t = setInterval(() => {
            if (this.ostore.world.origin) {
                clearInterval(t);
                return this.forceTeleport(this.ostore.world.entrance);
            }
        }, 100);
    }

    attemptLoadImages() {
        if (this.data.imageLoadAttempts < 3 && !this.data.tryLoadImages) {
            if (this.data.imageLoadAttempts !== -1) {
                console.log(
                    `Missing ${this.data.toRenderCount} textures from ${this.data.displayName}`,
                );
            }
            this.imgLoad(this.data.appearances);
            this.data.imageLoadAttempts++;
            this.data.tryLoadImages = setTimeout(() => {
                this.data.tryLoadImages = null;
            }, 3000);
        }
    }

    render({ ctx = null }) {
        if (this.data.toRenderCount > 0) {
            return this.attemptLoadImages();
        }
        ctx.arc(this.data.x, this.data.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
        ctx.stroke();
    }

    forceTeleport({ i = 0, j = 0, k = 0 }) {
        let loc = this.ostore.world.getBlockCenter({ i: i, j: j, k: k });
        this.data.x = loc.x;
        this.data.y = loc.y;
    }

    async moveToBlock({ i = 0, j = 0, k = 0 }) {
        this.moveTo(this.ostore.world.getBlockCenter({ i: i, j: j, k: k }));
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
            }

            this.data.x += cX;
            this.data.y += cY;
        }, 15);
        this.data.movingTo = interval;
    }

    playAnimation(animation = '') {}

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
