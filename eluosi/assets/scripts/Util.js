import { BLOCK_ITEM_WIDTH, BLOCK_TYPE_TIAN } from "./constants";

function createBlock(type, arr, color) {
    const result = [];
    arr.forEach((it, index) => {
        const { x, y } = it;
        const node = new cc.Node(type);
        const sprite = node.addComponent(cc.Sprite);
        color && (sprite.spriteFrame = color);
        node.x = x;
        node.y = y;
        result.push(node);
    });
    return result;
}

export function createTianBlock(color) {
    const arr = [
        {
            x: 0,
            y: 0,
        },
        {
            x: BLOCK_ITEM_WIDTH,
            y: 0,
        },
        {
            x: BLOCK_ITEM_WIDTH,
            y: 0,
        },
        {
            x: BLOCK_ITEM_WIDTH,
            y: BLOCK_ITEM_WIDTH,
        }
    ];
    return createBlock(BLOCK_TYPE_TIAN, arr, color);
}