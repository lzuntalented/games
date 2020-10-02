import { BLOCK_ITEM_WIDTH, GAME_STATUS_START, GAME_STATUS_END } from "./constants";

// 网格行数
export const GRID_ROW = 20;
// 网格列数
export const GRID_COL = 15;

// 标记当前格子为空
export const GRID_ITEM_EMPTY = 0;
// 标记当前格子有东西，不可再放置
export const GRID_ITEM_CHOKE = 1;

export default class Model {
    constructor({ x, y }) {
        // 网格二位数组
        const list = [];
        // 创建网格二位数组，并填充空标志位
        for(let row = 0; row < GRID_ROW; row++) {
            const arr = [];
            for(let col = 0; col < GRID_COL; col++) {
                arr.push(GRID_ITEM_EMPTY);
            }
            list[row] = arr;
        }
        this.list = list;
        // this.list = new Array(GRID_ROW).fill(new Array(GRID_COL).fill(GRID_ITEM_EMPTY));
        
        // 网格各个格子的坐标表示
        this.listPos = this.list.map((it, row) => {
            return it.map((item, col) => {
                return {
                    x: x + col * BLOCK_ITEM_WIDTH,
                    y: y + row * BLOCK_ITEM_WIDTH,
                }
            });
        });

        // 标记当前游戏状态为开始
        this.gameStatus = GAME_STATUS_START;
    }

    getCoordStart() {
        const col = (GRID_COL / 2) | 0;
        const row = GRID_ROW - 1;
        return {row, col}
    }

    getPositionStart() {
        const {row, col} = this.getCoordStart();
        return this.listPos[row][col];
    }

    getPositionWithRowCol(row, col) {
        if (row > GRID_ROW || col > GRID_COL) return false;

        return this.listPos[row][col];
    }

    getGameStatus() {
        return this.gameStatus;
    }

    startGame() {
        
    }

    gameOver() {
        this.gameStatus = GAME_STATUS_END;
    }

    setGameStatus(status) {
        this.gameStatus = status;
    }
}