const animations = {
    blink: [
        { frame: { x: 1, y: 0 }, timeOffset: 0 },
        { frame: { x: 2, y: 0 }, timeOffset: 50 },
        { frame: { x: 1, y: 0 }, timeOffset: 100 },
        { frame: { x: 0, y: 0 }, timeOffset: 150 },
    ],
    double_blink: [
        { frame: { x: 1, y: 0 }, timeOffset: 0 },
        { frame: { x: 2, y: 0 }, timeOffset: 50 },
        { frame: { x: 1, y: 0 }, timeOffset: 100 },
        { frame: { x: 0, y: 0 }, timeOffset: 150 },
        { frame: { x: 2, y: 0 }, timeOffset: 200 },
        { frame: { x: 0, y: 0 }, timeOffset: 250 },
    ],
    '': [],
};

export default animations;
