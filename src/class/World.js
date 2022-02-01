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
        entrance = { i: 0, j: 0, k: 0 },
        ostore = null,
    }) {
        this.ostore = ostore;
        this.width = width;
        this.length = length;
        this.height = height;
        this.entrance = entrance;

        this.blockSize = 45;

        this.dX = 1 * (1 * this.blockSize * Math.cos(30 * (Math.PI / 180)));
        this.dY = 1 * (1 * this.blockSize * Math.sin(30 * (Math.PI / 180)));

        this.width = width;
        this.height = height;
        this._length = length;

        this.normalLength = (this._length + this.width) * this.dY;
        this.normalHeight = (this._length + this.width) * this.dX;

        this.entrance = entrance;

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

    getBlockCenter({ i = 0, j = 0, k = 0 }) {
        if (
            i > this.length - 1 ||
            j > this.width - 1 ||
            k > this.height - 1 ||
            i < 0 ||
            j < 0 ||
            k < 0
        )
            return this.getBlockCenter({});
        let p = { ...this.origin };

        //traverse length
        p.x = p.x + i * this.dX;
        p.y = p.y + i * this.dY;
        //traverse width
        p.x = p.x - j * this.dX;
        p.y = p.y + j * this.dY;

        //add dY
        p.y = p.y + this.dY;

        return p;
    }

    render({ ctx = null, cameraOffsetX = 0, cameraOffsetY = 0 }) {
        this.origin = {
            x: ctx.width / 2,
            y: ctx.height / 3 - this.blockSize / 2,
        };

        //World.origin = { ...this.origin };

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
                -this.normalHeight / 2,
                this.dY * (this.length + this.width),
                this.dX * (this.width + this.length),
            );
            ctx.restore();
        }

        //  left wall
        if (this.left_wallLoaded) {
            ctx.save();
            ctx.translate(this.origin.x, this.origin.y);
            let wp = this.dX * this.length;
            ctx.drawImage(
                this.left_wallImg,
                -this.dX * this.width,
                -this.dY * this.length * 2,
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
            let wp = this.dX * this.length;
            ctx.drawImage(
                this.right_wallImg,
                -1,
                -2 * this.dY * this._length,
                wp,
                1.732 * wp,
                // 2 * World.dY * this.height +
                //     wp * Math.tan((30 * Math.PI) / 180),
            );
            ctx.restore();
        }

        //draw floor cells
        let l = 0;
        ctx.beginPath();
        for (let w = 0; w < this.length; w++) {
            for (l = 0; l < this.width; l++) {
                //floorMesh
                let dX =
                    1 * (1 * this.blockSize * Math.cos(30 * (Math.PI / 180)));
                let dY =
                    1 * (1 * this.blockSize * Math.sin(30 * (Math.PI / 180)));

                if (w === 0 && l === 0) {
                    this.dX = dX;
                    this.dY = dY;
                    this.origin = this.origin;
                }

                let x1 =
                    o.x + l * this.blockSize * Math.cos(30 * (Math.PI / 180));
                let y1 =
                    o.y + l * this.blockSize * Math.sin(30 * (Math.PI / 180));

                if (this.drawMesh) {
                    //top
                    ctx.moveTo(x1 + 3, y1);
                    ctx.arc(x1, y1, 3, 0, Math.PI * 2);

                    //right
                    ctx.moveTo(x1 + dX + 3, y1 + dY);
                    ctx.arc(x1 + dX, y1 + dY, 3, 0, Math.PI * 2);

                    //bottom
                    ctx.moveTo(x1 + 3, y1 + dY * 2);
                    ctx.arc(x1, y1 + dY * 2, 3, 0, Math.PI * 2);

                    //left
                    ctx.moveTo(x1 - dX + 3, y1 + dY);
                    ctx.arc(x1 - dX, y1 + dY, 3, 0, Math.PI * 2);
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
            ctx.stroke();
            o.x =
                o.x - 1 * (1 * this.blockSize * Math.cos(30 * (Math.PI / 180)));
            o.y =
                o.y + 1 * (1 * this.blockSize * Math.sin(30 * (Math.PI / 180)));
        }
    }
}
