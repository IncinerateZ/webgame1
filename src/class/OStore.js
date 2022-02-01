export default class OStore {
    constructor() {}

    setHitCanvas(hc = null) {
        this.hitCanvas = hc;
    }

    setCanvas(canvas = null) {
        this.canvas = canvas;
    }

    setPlayer(player = null) {
        this.player = player;
    }

    setWorld(world = null) {
        this.world = world;
    }
}
