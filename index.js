import Player from './src/class/player.js';

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
        //create canvas
        this.container = document.getElementById(id);
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'game');
        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.canvas.addEventListener('mouseup', (e) => {
            let pos = getCursorPosition(this.canvas, e);
            let x = Math.floor(pos.x);
            let y = Math.floor(pos.y);

            //move player
            this.player.moveTo({ x: x, y: y });
            this.player.rotateTo({ rad: Math.PI });
        });

        //canvas context
        this.ctx = this.canvas.getContext('2d');

        //render to page
        this.container.appendChild(this.canvas);

        //load player
        const playerImg = document.createElement('img');
        playerImg.setAttribute('src', './src/assets/entities/player.png');

        const player = new Player({
            img: playerImg,
            x: 450,
            y: 250,
            z: 1,
            displayName: 'IncinerateZ',
            speed_x: 7,
            speed_y: 7,
        });

        this.player = player;

        //render queue
        this.renderQueue = [this.player];
    }

    render() {
        for (let o of this.renderQueue) {
            o.render(this.ctx);
        }
    }

    update() {
        //clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.render();
    }
}

window.onload = function () {
    window.game = new Game({ id: 'canvas-container' });
    loop();
};
