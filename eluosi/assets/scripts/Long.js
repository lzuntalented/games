// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { BLOCK_ITEM_WIDTH, DIRECTION_TOP, DIRECTION_RIGHT, DIRECTION_BOTTOM, DIRECTION_LEFT } from "./constants";

const coordMap = {
    [DIRECTION_TOP]: [
        {
            row: 0,
            col: 0,
        },
        {
            row: -1,
            col: 0,
        },
        {
            row: -2,
            col: 0,
        },
        {
            row: -3,
            col: 0,
        }
    ],
    [DIRECTION_RIGHT]: [
        {
            row: 0,
            col: 0,
        },
        {
            row: 0,
            col: -1,
        },
        {
            row: 0,
            col: 1,
        },
        {
            row: 0,
            col: 2,
        }
    ],
    [DIRECTION_BOTTOM]: [
        {
            row: 0,
            col: 0,
        },
        {
            row: -1,
            col: 0,
        },
        {
            row: -2,
            col: 0,
        },
        {
            row: -3,
            col: 0,
        }
    ],
    [DIRECTION_LEFT]: [
        {
            row: 0,
            col: 0,
        },
        {
            row: 0,
            col: -1,
        },
        {
            row: 0,
            col: 1,
        },
        {
            row: 0,
            col: 2,
        }
    ],
}

cc.Class({
    extends: cc.Component,

    properties: {
        items: {
            default: [],
            type: [cc.Prefab]
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.resetSprites();
    },

    resetSprites(dir = DIRECTION_TOP) {
        const spirtes = this.node.children;
        const list = coordMap[dir];
        const arr = list.map(it => {
            const { row, col } = it;
            return {
                x: col * BLOCK_ITEM_WIDTH,
                y: row * BLOCK_ITEM_WIDTH
            }
        });
        spirtes.forEach((sp, i) => {
            const {x, y} = arr[i];
            sp.x = x;
            sp.y = y;
            sp.width = BLOCK_ITEM_WIDTH;
            sp.height = BLOCK_ITEM_WIDTH;
            // sp.anchorX = 0;
            // sp.anchorY = 0;
        });

        // if (dir === DIRECTION_TOP || dir === DIRECTION_BOTTOM) {
        //     this.node.width = BLOCK_ITEM_WIDTH * 3;
        //     this.node.height = BLOCK_ITEM_WIDTH * 2;
        // } else {
        //     this.node.width = BLOCK_ITEM_WIDTH * 2;
        //     this.node.height = BLOCK_ITEM_WIDTH * 3;
        // }
    },

    start () {

    },

    setCoord(coord) {
        console.log('long coord');
    },

    getCoords({row, col}, dir = DIRECTION_TOP) {
        const list = coordMap[dir];
        const result = list.map(it => {
            return {
                row: row + it.row,
                col: col + it.col,
            }
        })
        return result;
    }

    // update (dt) {},
});
