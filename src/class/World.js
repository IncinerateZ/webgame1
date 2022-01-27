const blockSize = 45;

const assetsPath = './src/assets';

export class World {
    constructor({
        width,
        length,
        height,
        floorName = null,
        left_wallName = null,
        right_wallName = null,
        drawMesh = false,
        hc = null,
        name = '',
    }) {
        this.width = width;
        this.length = length;
        this.height = height;
        this.name = name;

        this.floorImg = floorName ? document.createElement('img') : null;
        if (this.floorImg)
            this.floorImg.setAttribute(
                'src',
                `${assetsPath}/textures/${floorName}.png`,
            );
        this.floorLoaded = false;

        this.left_wallImg = left_wallName
            ? document.createElement('img')
            : null;
        if (this.left_wallImg)
            this.left_wallImg.setAttribute(
                'src',
                `${assetsPath}/textures/${left_wallName}.png`,
            );
        this.left_wallLoaded = false;

        this.right_wallImg = right_wallName
            ? document.createElement('img')
            : null;
        if (this.right_wallImg)
            this.right_wallImg.setAttribute(
                'src',
                `${assetsPath}/textures/${right_wallName}.png`,
            );
        this.right_wallLoaded = false;

        this.hc = hc;
        this.drawMesh = drawMesh;

        //init block dat
        this.blockDat = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            this.blockDat[y] = new Array(this.length);
            for (let x = 0; x < this.length; x++) {
                this.blockDat[y][x] = new Array(this.width);
                for (let z = 0; z < this.width; z++) {
                    this.blockDat[y][x][z] = null;
                }
            }
        }

        //on texture load
        if (this.floorImg)
            this.floorImg.onload = () => {
                this.floorLoaded = true;
                console.log(`${this.name} floor rendered`);
            };
        if (this.left_wallImg)
            this.left_wallImg.onload = () => {
                this.left_wallLoaded = true;
                console.log(`${this.name} left_wall rendered`);
            };
        if (this.right_wallImg)
            this.right_wallImg.onload = () => {
                this.right_wallLoaded = true;
                console.log(`${this.name} right_wall rendered`);
            };
    }

    render({ ctx = null, cameraOffsetX = 0, cameraOffsetY = 0 }) {
        console.log(`${this.name} render`);
        let origin = {
            x: ctx.width / 2,
            y: ctx.height / 3 - blockSize / 2,
        };

        //draw textures
        if (this.floorLoaded) {
            ctx.save();
            ctx.translate(origin.x, origin.y);
            ctx.rotate((90 * Math.PI) / 180);
            ctx.drawImage(this.floorImg, /*230*/ -2, -this.floorImg.height / 2);
            ctx.restore();
        }
        //draw floor cells
        let l = 0;
        for (let w = 0; w < this.length; w++) {
            for (l = 0; l < this.width; l++) {
                //floorMesh
                let dX = 1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
                let dY = 1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));

                let x1 =
                    origin.x + l * blockSize * Math.cos(30 * (Math.PI / 180));
                let y1 =
                    origin.y + l * blockSize * Math.sin(30 * (Math.PI / 180));

                //top
                if (this.drawMesh) {
                    ctx.beginPath();
                    ctx.arc(x1, y1, 3, 0, Math.PI * 2);
                    ctx.stroke();
                    //right
                    ctx.beginPath();
                    ctx.arc(x1 + dX, y1 + dY, 3, 0, Math.PI * 2);
                    ctx.stroke();
                    //bottom
                    ctx.beginPath();
                    ctx.arc(x1, y1 + dY * 2, 3, 0, Math.PI * 2);
                    ctx.stroke();
                    //left
                    ctx.beginPath();
                    ctx.arc(x1 - dX, y1 + dY, 3, 0, Math.PI * 2);
                    ctx.stroke();
                }

                let paths = [
                    { x: x1, y: y1 }, //top
                    { x: x1 + dX, y: y1 + dY }, //right
                    { x: x1, y: y1 + dY * 2 }, //bottom
                    { x: x1 - dX, y: y1 + dY }, //left
                ];
                //console.log(l + ' ' + w);
                this.hc.createRegion(`${l}-${w}`, paths, {
                    center: { x: x1, y: y1 + dY },
                    type: 'world-surface',
                });
            }
            origin.x =
                origin.x - 1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
            origin.y =
                origin.y + 1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));
        }
    }
}
