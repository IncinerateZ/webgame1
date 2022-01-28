const blockSize = 45;

const assetsPath = './src/assets';

export class World {
    static dX = 0;
    static dY = 0;
    static origin = null;
    static width = 0;
    static _length = 0;
    static height = 0;
    static normalLength = 0;
    static normalHeight = 0;
    static blockSize = 45;
    static entrance = { i: 0, j: 0, k: 0 };
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
        entrance = { i: 0, j: 0, k: 0 },
    }) {
        this.width = width;
        this.length = length;
        this.height = height;
        this.entrance = entrance;

        World.dX = 1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
        World.dY = 1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));

        World.width = width;
        World.height = height;
        World._length = length;

        World.normalLength = (World._length + World.width) * World.dY;
        World.normalHeight = (World._length + World.width) * World.dX;

        World.entrance = entrance;

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

        this.origin = {
            x: 0,
            y: 0,
        };

        //on texture load
        if (this.floorImg)
            this.floorImg.onload = () => {
                this.floorLoaded = true;
                console.log(`${this.name} floor loaded`);
            };
        if (this.left_wallImg)
            this.left_wallImg.onload = () => {
                this.left_wallLoaded = true;
                console.log(`${this.name} left_wall loaded`);
            };
        if (this.right_wallImg)
            this.right_wallImg.onload = () => {
                this.right_wallLoaded = true;
                console.log(`${this.name} right_wall loaded`);
            };
    }

    static getBlockCenter({ i = 0, j = 0, k = 0 }) {
        if (
            i > World._length - 1 ||
            j > World.width - 1 ||
            k > World.height - 1 ||
            i < 0 ||
            j < 0 ||
            k < 0
        )
            return this.getBlockCenter({});
        let p = { ...this.origin };
        //traverse length
        p.x = p.x + i * World.dX;
        p.y = p.y + i * World.dY;
        //traverse width
        p.x = p.x - j * World.dX;
        p.y = p.y + j * World.dY;

        //add dY
        p.y = p.y + World.dY;

        return p;
    }

    render({ ctx = null, cameraOffsetX = 0, cameraOffsetY = 0 }) {
        this.origin = {
            x: ctx.width / 2,
            y: ctx.height / 3 - blockSize / 2,
        };

        let o = { ...this.origin };

        //draw textures
        //  floor
        if (this.floorLoaded) {
            ctx.save();
            ctx.translate(this.origin.x, this.origin.y);
            ctx.rotate((90 * Math.PI) / 180);
            ctx.drawImage(
                this.floorImg,
                0,
                -World.normalHeight / 2,
                World.dY * (this.length + this.width),
                World.dX * (this.width + this.length),
            );
            ctx.restore();
        }

        //  left wall
        if (this.left_wallLoaded) {
            ctx.save();
            ctx.translate(this.origin.x, this.origin.y);
            let wp = World.dX * this.length;
            ctx.drawImage(
                this.left_wallImg,
                -World.dX * this.width,
                -World.dY * this.length * 2,
                wp,
                1.732 * wp,
                // 2 * World.dY * this.height +
                //     wp * Math.tan((30 * Math.PI) / 180),
            );
            ctx.restore();
        }

        //  right wall
        if (this.right_wallLoaded) {
            ctx.save();
            ctx.translate(this.origin.x, this.origin.y);
            let wp = World.dX * this.length;
            ctx.drawImage(
                this.right_wallImg,
                -1,
                -2 * World.dY * World._length,
                wp,
                1.732 * wp,
                // 2 * World.dY * this.height +
                //     wp * Math.tan((30 * Math.PI) / 180),
            );
            ctx.restore();
        }

        //draw floor cells
        let l = 0;
        for (let w = 0; w < this.length; w++) {
            for (l = 0; l < this.width; l++) {
                //floorMesh
                let dX = 1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
                let dY = 1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));

                if (w === 0 && l === 0) {
                    World.dX = dX;
                    World.dY = dY;
                    World.origin = this.origin;
                }

                let x1 = o.x + l * blockSize * Math.cos(30 * (Math.PI / 180));
                let y1 = o.y + l * blockSize * Math.sin(30 * (Math.PI / 180));

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
                this.hc.createRegion(`${l}-${w}`, paths, {
                    center: { x: x1, y: y1 + dY },
                    type: 'world-surface',
                });
            }
            o.x = o.x - 1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
            o.y = o.y + 1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));
        }
    }
}
