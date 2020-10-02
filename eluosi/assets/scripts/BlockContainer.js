// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { DIRECTION_TOP, DIRECTION_RIGHT, DIRECTION_BOTTOM, DIRECTION_LEFT } = require("./constants");

cc.Class({
    extends: cc.Component,

    properties: {
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
        this.dir = DIRECTION_TOP;
    },

    setPositon(row, col) {
        console.log(this.node.y, 'change')
    },

    setCoord(coord) {
        this.startCoord = coord;
        const component = this.node._components[1];
        this.coords = component.getCoords(coord, this.dir);
        component.resetSprites(this.dir);
    },

    getCoords() {
        return this.coords;
    },

    getStartCoord() {
        return this.startCoord;
    },

    start () {

    },

    preRotate() {
        const map = [DIRECTION_TOP, DIRECTION_RIGHT, DIRECTION_BOTTOM, DIRECTION_LEFT];
        let index = map.indexOf(this.dir) + 1;
        if (index > 3) {
            index = 0
        }
        const dir = map[index];
        const component = this.node._components[1];
        return component.getCoords(this.startCoord, dir);
    },

    rotate() {
        const map = [DIRECTION_TOP, DIRECTION_RIGHT, DIRECTION_BOTTOM, DIRECTION_LEFT];
        let index = map.indexOf(this.dir) + 1;
        if (index > 3) {
            index = 0
        }
        const dir = map[index];
        // const component = this.node._components[1];
        // const coords = component.getCoords(this.startCoord, this.dir);
        // const obj = coords.find(it )
        // if (!component.canChangeDir(this.startCoord, dir)) {
        //     return;
        // } 
        this.dir = dir;
        // this.node.setRotation(90 * index);
        this.setCoord(this.startCoord);
    },

    move (row, col = 0) {
        const result = {
            row: this.startCoord.row - row, 
            col: this.startCoord.col - col,
        }
        // this.setCoord({row, col});
        return result;
    }

    // update (dt) {},
});
