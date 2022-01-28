const animations = {
    _dat: {
        size: {
            width: 1600,
            height: 1600,
        },
        frameSize: {
            width: 400,
            height: 400,
        },
        entity: {
            width: 79,
            height: 318,
            dYBottom: 41,
        },
    },
    blink: [
        { frame: { x: 1, y: 0 }, timeOffset: 0, dYBottom: 0 },
        { frame: { x: 2, y: 0 }, timeOffset: 50, dYBottom: 0 },
        { frame: { x: 1, y: 0 }, timeOffset: 100, dYBottom: 0 },
        { frame: { x: 0, y: 0 }, timeOffset: 150, dYBottom: 0 },
    ],
    double_blink: [
        { frame: { x: 1, y: 0 }, timeOffset: 0, dYBottom: 0 },
        { frame: { x: 2, y: 0 }, timeOffset: 50, dYBottom: 0 },
        { frame: { x: 1, y: 0 }, timeOffset: 100, dYBottom: 0 },
        { frame: { x: 0, y: 0 }, timeOffset: 150, dYBottom: 0 },
        { frame: { x: 2, y: 0 }, timeOffset: 200, dYBottom: 0 },
        { frame: { x: 0, y: 0 }, timeOffset: 250, dYBottom: 0 },
    ],
    '': [],
};

export default animations;
