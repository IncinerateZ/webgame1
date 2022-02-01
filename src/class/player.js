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
        let count = 1;

        //shadow
        let shadow = document.createElement('img');
        shadow.setAttribute('src', `${assetsPath}/entities/player/shadow.svg`);
        shadow.onload = () => {
            this.data.toRenderCount--;
        };
        this.data.images.shadow = shadow;

        for (let k of Object.keys(images)) {
            let v = images[k];
            let imgPath = '';
            if (typeof v === 'object' && !Array.isArray(v) && v !== null) {
                for (let k2 of Object.keys(v)) {
                    if (v[k2] !== null) {
                        imgPath = `${assetsPath}/entities/player/${k}/${k2}/${v[k2]}.svg`;
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
                    imgPath = `${assetsPath}/entities/player/${k}/${v}.svg`;
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
        let images = this.data.images;
        let world = this.ostore.world;
        if (this.data.toRenderCount > 0) {
            return this.attemptLoadImages();
        }
        ctx.beginPath();
        ctx.closePath();

        //draw playerLoc
        // ctx.arc(this.data.x, this.data.y, 5, 0, 2 * Math.PI);
        // ctx.fillStyle = '#00ff00';
        // ctx.fill();

        //draw shadow
        let shadowRatio = images.shadow.height / images.shadow.width;
        let shadowHeight = world.dY / 1.55;
        let shadowWidth = shadowHeight / shadowRatio;
        ctx.save();
        ctx.translate(this.data.x, this.data.y);
        if (!this.data.facingOrigin) ctx.scale(-1, 1);
        ctx.drawImage(
            images.shadow,
            -shadowWidth / 2,
            -shadowHeight / 2,
            shadowWidth,
            shadowHeight,
        );
        ctx.restore();

        //leg right
        let legShadowRatio = images.legs.right.width / images.shadow.width;
        let legRatio = images.legs.right.height / images.legs.right.width;
        let legWidth = shadowWidth * legShadowRatio;
        let legHeight = legWidth * legRatio;
        ctx.drawImage(
            images.legs.right,
            this.data.x + legWidth / 6,
            this.data.y - legHeight + 3,
            legWidth,
            legHeight,
        );

        //arm right
        let armShadowRatio = images.arms.right.width / images.shadow.width;
        let armRatio = images.arms.right.height / images.arms.right.width;
        let armWidth = shadowWidth * armShadowRatio;
        let armHeight = armWidth * armRatio;
        ctx.drawImage(
            images.arms.right,
            this.data.x + legWidth / 2,
            this.data.y - armHeight - legHeight + 6,
            armWidth,
            armHeight,
        );

        //body
        let bodyShadowRatio = images.body.width / images.shadow.width;
        let bodyRatio = images.body.height / images.body.width;
        let bodyWidth = shadowWidth * bodyShadowRatio;
        let bodyHeight = bodyWidth * bodyRatio;
        ctx.drawImage(
            images.body,
            this.data.x - bodyWidth / 2,
            this.data.y - legHeight - bodyHeight + 11,
            bodyWidth,
            bodyHeight,
        );

        //arm left
        ctx.drawImage(
            images.arms.left,
            this.data.x - armWidth - bodyWidth / 2 + armWidth / 3,
            this.data.y - armHeight - legHeight + 7,
            armWidth,
            armHeight,
        );

        //leg left
        ctx.drawImage(
            images.legs.left,
            this.data.x - (3 * legWidth) / 3.6,
            this.data.y - legHeight + 3,
            legWidth,
            legHeight,
        );

        //head
        let headShadowRatio = images.head.width / images.shadow.width;
        let headRatio = images.head.height / images.head.width;
        let headWidth = shadowWidth * headShadowRatio;
        let headHeight = headWidth * headRatio;
        ctx.drawImage(
            images.head,
            this.data.x - headWidth / 2,
            this.data.y - headHeight - bodyHeight - legHeight + 15,
            headWidth,
            headHeight,
        );

        //mouth
        let mouthShadowRatio = images.mouths.width / images.shadow.width;
        let mouthRatio = images.mouths.height / images.mouths.width;
        let mouthWidth = shadowWidth * mouthShadowRatio;
        let mouthHeight = mouthWidth * mouthRatio;
        ctx.drawImage(
            images.mouths,
            this.data.x - mouthWidth / 3,
            this.data.y - legHeight - bodyHeight + 2,
            mouthWidth,
            mouthHeight,
        );

        //nose
        let noseShadowRatio = images.nose.width / images.shadow.width;
        let noseRatio = images.nose.height / images.nose.width;
        let noseWidth = shadowWidth * noseShadowRatio;
        let noseHeight = noseWidth * noseRatio;
        ctx.drawImage(
            images.nose,
            this.data.x + noseWidth,
            this.data.y - legHeight - bodyHeight - noseHeight - mouthHeight,
            noseWidth,
            noseHeight,
        );

        //eyes
        let eyeShadowRatio = images.eyes.width / images.shadow.width;
        let eyeRatio = images.eyes.height / images.eyes.width;
        let eyeWidth = shadowWidth * eyeShadowRatio;
        let eyeHeight = eyeWidth * eyeRatio;
        ctx.drawImage(
            images.eyes,
            this.data.x - eyeWidth / 2 + noseWidth,
            this.data.y -
                eyeHeight -
                legHeight -
                bodyHeight -
                noseHeight -
                mouthHeight +
                2,
            eyeWidth,
            eyeHeight,
        );

        //hairs
        let hairShadowRatio = images.hairs.width / images.shadow.width;
        let hairRatio = images.hairs.height / images.hairs.width;
        let hairWidth = shadowWidth * hairShadowRatio;
        let hairHeight = hairWidth * hairRatio;
        ctx.drawImage(
            images.hairs,
            this.data.x - headWidth / 2,
            this.data.y - headHeight - bodyHeight - legHeight + 15,
            hairWidth,
            hairHeight,
        );
        ctx.restore();
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
