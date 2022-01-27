export default class Entity {
    constructor({
        img = null,
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
    }) {
        this.data = {
            img: img,
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
        };

        this.data.img.onload = () => {
            console.log(`${this.data.displayName} img load`);
            this.imgLoad();
        };
    }

    render({ ctx = null }) {
        ctx.save();
        ctx.translate(this.getCenter().x, this.getCenter().y);
        ctx.rotate(this.data.rotationRad);
        if (!this.data.facingOrigin) ctx.scale(-1, 1);
        ctx.drawImage(
            this.data.img,
            -this.getRelativeCenter().x,
            -this.getRelativeCenter().y,
            this.data.img.width * this.data.scale,
            this.data.img.height * this.data.scale,
        );
        ctx.translate(0, 0);
        ctx.restore();
    }

    imgLoad() {
        let dat = this.data;
        let img = this.data.img;
        dat.width = img.width;
        dat.height = img.height;
        if (this.data.displayName === 'arrow') console.log('arrow load');
    }

    setScale(scale) {
        this.data.scale = scale;
        this.data.width = this.data.img.width * scale;
        this.data.height = this.data.img.height * scale;
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
