import Entity from './src/class/Entity.js';
import Player from './src/class/player.js';
import { World } from './src/class/World.js';
import { HitCanvas } from './src/class/HitCanvas.js';

const assetsPath = './src/assets';

//main loop
function loop() {
    window.game.update();
    requestAnimationFrame(loop);
}

function getCursorPosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x: x, y: y };
}

class Game {
    constructor({ id }) {
        //create display canvas
        this.container = document.getElementById(id);
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'game');
        this.canvas.width = 1000;
        this.canvas.height = 600;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.width = 1000;
        this.ctx.height = 600;

        //create hit region canvas
        this.hcanvas = document.createElement('canvas');
        this.hcanvas.setAttribute('id', 'game-hitreg');
        this.hcanvas.width = this.canvas.width;
        this.hcanvas.height = this.canvas.height;
        this.hcanvas.setAttribute(
            'style',
            'background-color: gray; opacity: 0; position: absolute',
        );

        this.hc = new HitCanvas(this.hcanvas);
        this.hcanvas.addEventListener('mouseup', (e) => {
            let pos = getCursorPosition(this.canvas, e);
            let x = Math.floor(pos.x);
            let y = Math.floor(pos.y);

            //click detection
            let region = this.hc.getRegion({ x: x, y: y });
            if (region) {
                if (region.data.type === 'world-surface') {
                    //move player
                    this.player.moveTo(region.data.center);
                }
            }
        });

        //render to page
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.hcanvas);

        //load player
        const playerImg = document.createElement('img');
        playerImg.setAttribute('src', `${assetsPath}/entities/player.png`);

        const w1 = new World({
            width: 8,
            length: 8,
            height: 10,
            floorImg: null,
            left_wallImg: null,
            right_wallImg: null,
            drawMesh: true,
            hc: this.hc,
        });

        this.world = w1;

        const player = new Player({
            img: playerImg,
            x: 450,
            y: 250,
            z: 1,
            displayName: 'IncinerateZ',
            speed_x: 7,
            speed_y: 7,
            facingOrigin: false,
        });

        const player2 = new Player({
            img: playerImg.cloneNode(),
            x: 450,
            y: 250,
            z: 1,
            displayName: 'inferious77',
            speed_x: 7,
            speed_y: 7,
            facingOrigin: false,
        });

        this.player = player;
        this.cameraOffsetX = 0;
        this.cameraOffsetY = 0;

        //render queue
        this.renderQueue = [this.world, player2, this.player];
    }

    render() {
        this.hc.clearRegions();
        for (let o of this.renderQueue) {
            o.render({
                ctx: this.ctx,
                cameraOffsetX: this.cameraOffsetX,
                cameraOffsetY: this.cameraOffsetY,
                hctx: this.hcanvas.getContext('2d'),
            });
        }
        this.hc.renderRegions();
    }

    update() {
        //clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hcanvas
            .getContext('2d')
            .clearRect(0, 0, this.hcanvas.width, this.hcanvas.height);
        this.render();
    }
}

window.onload = function () {
    window.game = new Game({ id: 'canvas-container' });
    loop();
};
