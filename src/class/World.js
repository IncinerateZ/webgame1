const blockSize = 50;

export class World {
    constructor({
        width,
        length,
        height,
        floorImg = null,
        left_wallImg = null,
        right_wallImg = null,
        drawMesh = false,
        hc = null,
    }) {
        this.width = width;
        this.length = length;
        this.height = height;

        this.floorImg = floorImg;
        this.left_wallImg = left_wallImg;
        this.right_wallImg = right_wallImg;

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
    }

    render({ ctx = null, cameraOffsetX = 0, cameraOffsetY = 0 }) {
        console.log('world render');
        let origin = {
            x: ctx.width / 2,
            y: ctx.height / 3 - blockSize,
        };
        if (this.drawMesh) {
            ctx.beginPath();
            ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2);
            //ctx.moveTo(origin.x, origin.y);
            let l = 0;
            for (let w = 0; w < this.length; w++) {
                for (l = 0; l < this.width; l++) {
                    //floorMesh
                    let dX =
                        1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
                    let dY =
                        1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));
                    //top
                    ctx.beginPath();
                    let x1 =
                        origin.x +
                        l * blockSize * Math.cos(30 * (Math.PI / 180));
                    let y1 =
                        origin.y +
                        l * blockSize * Math.sin(30 * (Math.PI / 180));
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
                    origin.x -
                    1 * (1 * blockSize * Math.cos(30 * (Math.PI / 180)));
                origin.y =
                    origin.y +
                    1 * (1 * blockSize * Math.sin(30 * (Math.PI / 180)));
            }
        }
    }
}
