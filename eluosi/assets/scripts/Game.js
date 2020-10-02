// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { name, BLOCK_ITEM_WIDTH, COMPONENT_BLOCK_CONTAINER, GAME_STATUS_END, GAME_STATUS_PAUSE, GAME_STATUS_START } from './constants';
import Model, { GRID_COL, GRID_ROW, GRID_ITEM_EMPTY } from './Model';

cc.Class({
    extends: cc.Component,

    properties: {
        // 方块精灵集合
        blocks: [cc.Prefab],
        currentBlock: {
            default: null,
            type: cc.Prefab,
        },
        nextBlock: {
            default: null,
            type: cc.Prefab,
        },
        point: {
            default: null,
            type: cc.Prefab,
        },
        overPoint: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 0.3;
        this.addEvent();
        // 窗口大小
        let windowSize = cc.view.getVisibleSize();
        const { width, height } = windowSize;

        // 起始点坐标
        this.originPoint = {
            x: -((BLOCK_ITEM_WIDTH * (GRID_COL - 1))) / 2,
            y: - height / 2 + BLOCK_ITEM_WIDTH / 2
        }
        // 实例化数据模型
        this.model = new Model(this.originPoint);

        // 当前正在控制的方块起始出现位置
        this.startPoint = {
            x: 0,
            y: this.originPoint.y + (BLOCK_ITEM_WIDTH * (GRID_ROW - 1))
        }
        this.endPoint = {
            x: 0,
            y: -height / 2
        }
        // console.log(this.point);

        // 背景网格绘制，调试使用
        this.model.listPos.forEach((item, indx) => {
            // if (indx > 0)return;
            // if (indx !== GRID_ROW - 1) return;
            item.forEach(({x, y}) => {
                const node = cc.instantiate(this.point);
                node.x = x;
                node.y = y;
                node.width = BLOCK_ITEM_WIDTH;
                node.height = BLOCK_ITEM_WIDTH;
                this.node.addChild(node);
            })
        })

        this.setCurrentBlock();

        this.lastDt = 0;
    },
    
    // 添加事件行为
    addEvent() {
        this.colIncreate = 0;
        // 按键按下事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, ( event ) => {
            console.log(event.keyCode)
            if(event.keyCode === 13) {
                if (this.model.getGameStatus() === GAME_STATUS_PAUSE) {
                    this.model.setGameStatus(GAME_STATUS_START);
                } else {
                    this.model.setGameStatus(GAME_STATUS_PAUSE);
                }
            }
            if(event.keyCode === 87) {
                const container = this.currentNode.getComponent(COMPONENT_BLOCK_CONTAINER);
                const coords = container.preRotate();
                const flag = this.checkCanPut(coords, this.model.list, 0, 0);
                if (flag) {
                    container.rotate();
                }
                // this.currentNode.setRotation(90);
                // this.node.removeChild(this.currentNode);
                // this.node.addChild(this.currentNode);
            }
            if (this.colIncreate === 0) {
                if (event.keyCode === 37) {
                    this.colIncreate = 1;
                } else if (event.keyCode === 39) {
                    this.colIncreate = -1;
                }
            }
            if (event.keyCode === 40) {
                this.speed = 0.1;
            }
        }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, ( event ) => {
            if (event.keyCode === 40) {
                this.speed = 0.3;
            }
        }, this);
    },

    setCurrentBlock() {
        // 获取起始点坐标
        const startCoord = this.model.getCoordStart();
        // 检查起始点是否可防止方块，若不能，则游戏结束
        if (this.model.list[startCoord.row][startCoord.col]) {
            // 游戏结束
            console.log('game over');
            return;
        }
        // 随机一个5以内的整数
        const index = Math.floor(Math.random() * 5);
        // const index = 0;
        // 取出该序号下的方块精灵
        this.currentBlock = this.blocks[index];
        // 实例化该精灵
        const node = cc.instantiate(this.currentBlock);
        // 保存该精灵实例引用
        this.currentNode = node;
        // 获取精灵的父容器实例
        const container = node.getComponent(COMPONENT_BLOCK_CONTAINER);
        container.setCoord(startCoord);
        const pos = this.model.getPositionStart();
        node.x = pos.x;
        node.y = pos.y;
        this.node.addChild(node);
    },
 
    start () {
    },

    clearLine() {
        const { list, listPos } = this.model;
        const downMap = {};
        list.forEach((item, row) => {
            const arr = item.find(it => it === GRID_ITEM_EMPTY);
            if (typeof arr === 'undefined') {
                item.forEach((it, col) => {
                    this.node.removeChild(it);
                    list[row][col] = GRID_ITEM_EMPTY;
                });
                for(let i = row + 1; i < GRID_ROW; i ++) {
                    downMap[i] = (downMap[i] || 0) + 1;
                }
            }
        })
   
        // console.log(downMap)
        Object.keys(downMap).forEach(row => {
            const colCount = downMap[row];
            list[row].forEach((it, col) => {
                if (it !== GRID_ITEM_EMPTY) {
                    const pos = listPos[row - colCount][col];
                    it.x = pos.x;
                    it.y = pos.y;
                    list[row - colCount][col] = it;
                    list[row][col] = GRID_ITEM_EMPTY;
                }
            })
        });
       
        // if (Object.keys(downMap).length > 0) {
        //     this.model.setGameStatus(GAME_STATUS_PAUSE)
        // }
        // this.model.gameOver();
    },

    checkCanPut(arr, grid, r, c = 0) {
        let result = true;
        arr.forEach(({row, col}) => {
            if (row- r < 0 || col - c < 0 || col - c >= GRID_COL) {
                result = false;
            } else if (grid[row - r] && grid[row - r][col - c]) {
                result = false;
            }
        });
        return result;
    },

    update (dt) {
        const { model, point } = this;
        if (model.getGameStatus() === GAME_STATUS_END) {
            alert('game over');
            return;
        }
        if (model.getGameStatus() === GAME_STATUS_PAUSE) {
            return;
        }
        this.lastDt += dt;
        // return;
        if (this.lastDt >= this.speed) {
            this.lastDt = 0;
            const node = this.currentNode;
            if (node) {
                const container = node.getComponent(COMPONENT_BLOCK_CONTAINER);
                // const lastCoords = container.getCoords();
                const moveCol = this.colIncreate;
                if(this.colIncreate !== 0) this.colIncreate = 0;
                const {col: lastCol} = container.move(1);
                // 获取移动后的点阵坐标
                const {row, col} = container.move(1, moveCol);
                const currentCoords = container.getCoords();
                // if (moveCol)

                // const putTag = this.checkCanPut(currentCoords, model.list, 1, moveCol);
                let moveTag = 1;
                if(row < 0) {
                    moveTag = 0;
                } else if (!this.checkCanPut(currentCoords, model.list, 1, moveCol)) {
                    if (!this.checkCanPut(currentCoords, model.list, 1, 0)) {
                        moveTag = 0;
                    } else {
                        moveTag = 2;
                    }
                }

                if (moveTag > 0) {
                    const pos = model.getPositionWithRowCol(row, moveTag === 2 ? lastCol : col);
                    node.x = pos.x;
                    node.y = pos.y;
                    container.setCoord({row, col: moveTag === 2 ? lastCol : col});
                } else {
                    currentCoords.forEach(({row, col}) => {
                        const node = cc.instantiate(this.overPoint);
                        const { list, listPos } = model;
                        if (list[row]) {
                            this.model.list[row][col] = node;
                            const pos = listPos[row][col];
                            node.x = pos.x;
                            node.y = pos.y;
                            node.width = BLOCK_ITEM_WIDTH;
                            node.height = BLOCK_ITEM_WIDTH;
                            this.node.addChild(node, 2);
                        }
                    });
                    this.node.removeChild(node);
                    this.clearLine();
                    this.setCurrentBlock();
                }
            }
        }

    },
});
