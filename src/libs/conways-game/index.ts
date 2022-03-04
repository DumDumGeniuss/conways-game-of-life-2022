type PlayerIdsMap = {
  [id: string]: true;
};

/**
 * Cell
 * @property {boolean} live Whether it's live or not.
 * @property {number} liveNbrsCount Count of adjacent neighbours.
 * @property {playerIdsMap} playerIdsMap Key is id, value is always true.
 */
type Cell = {
  live: boolean;
  liveNbrsCount: number;
  playerIdsMap: PlayerIdsMap;
};

type CleanCell = {
  live: boolean;
  color: string;
};
type Board = Cell[][];

export type CleanBoard = CleanCell[][];

export type Player = {
  id: string;
  color: string;
};

type PlayersMap = {
  [id: string]: Player;
};

/**
 * LiveNbrsCountMap
 * @property {Object} live All positions of live cells grouped by count of live adjacents.
 * @property {Object} dead All positions of dead cells grouped by count of live adjacents.
 */
type LiveNbrsCountMap = {
  /**
   * @property
   */
  live: {
    [count: number]: {
      [key: string]: [number, number];
    };
  };
  dead: {
    [count: number]: {
      [key: string]: [number, number];
    };
  };
};

/**
 * LiveMap
 *
 * A map telling you if each cell is live or dead.
 */
type LiveMap = (0 | 1)[][];

export class ConwaysGame {
  private playersMap: PlayersMap = {};
  private board: Board = [];
  private size = 0;
  private liveNbrsCountMap: LiveNbrsCountMap = {
    live: {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    },
    dead: {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    },
  };

  constructor(size: number) {
    this.size = size;
    this.createBoard(size);
  }

  private createBoard(size: number) {
    this.board = [];
    for (let i = 0; i < size; i += 1) {
      this.board.push([]);
      for (let j = 0; j < size; j += 1) {
        this.board[i].push({
          live: false,
          liveNbrsCount: 0,
          playerIdsMap: {},
        });
        this.liveNbrsCountMap.dead[0][`${i},${j}`] = [i, j];
      }
    }
  }

  private isOutsideBorder(x: number, y: number) {
    return x < 0 || x >= this.size || y < 0 || y >= this.size;
  }

  averageColor(colors: string[]) {
    const count = colors.length;
    let [r, g, b] = [0, 0, 0];
    colors.forEach((color) => {
      r += parseInt(color.substring(1, 3), 16);
      g += parseInt(color.substring(3, 5), 16);
      b += parseInt(color.substring(5, 7), 16);
    });
    const [outR, outG, outB] = [
      Math.round(r / count).toString(16),
      Math.round(g / count).toString(16),
      Math.round(b / count).toString(16),
    ];

    return `#${outR}${outG}${outB}`;
  }

  private processCell(cell: Cell): CleanCell {
    let color;
    const playerIds = Object.keys(cell.playerIdsMap);
    if (playerIds.length === 0) {
      color = '#000000';
    } else {
      const colors = playerIds.map((id) => this.playersMap[id].color);
      color = this.averageColor(colors);
    }
    return {
      live: cell.live,
      color,
    };
  }

  getCell(x: number, y: number): CleanCell {
    return this.processCell(this.board[x][y]);
  }

  getBoard(): CleanBoard {
    return this.board.map((cells) =>
      cells.map((cell) => this.processCell(cell))
    );
  }

  getLiveMap(): LiveMap {
    return this.board.map((cells) => cells.map((cell) => (cell.live ? 1 : 0)));
  }

  evolve() {
    const positionOfRevivingCells: [number, number][] = Object.keys(
      this.liveNbrsCountMap.dead[3]
    )
      .map((key) => this.liveNbrsCountMap.dead[3][key])
      .map(([x, y]) => [x, y]);

    const positionOfDyingCells: [number, number][] = [];
    for (let i = 0; i < 9; i += 1) {
      if (i === 2 || i === 3) {
        continue;
      }
      Object.keys(this.liveNbrsCountMap.live[i])
        .map((key) => this.liveNbrsCountMap.live[i][key])
        .forEach(([x, y]) => positionOfDyingCells.push([x, y]));
    }

    positionOfRevivingCells.forEach(([x, y]) => this.reviveCell(x, y));
    positionOfDyingCells.forEach(([x, y]) => this.killCell(x, y));

    return this.getBoard();
  }

  addPlayer(player: Player) {
    this.playersMap[player.id] = player;
  }

  getPlayersMap(): PlayersMap {
    return this.playersMap;
  }

  getPlayer(id: string): Player {
    return this.playersMap[id];
  }

  removePlayer(playerId: string): void {
    delete this.playersMap[playerId];
  }

  private updateLiveNbrsCountMap(options: {
    x: number;
    y: number;
    live: boolean;
    newLive: boolean;
    count: number;
    newCount: number;
  }) {
    const { x, y, live, count, newLive, newCount } = options;
    const status = live ? 'live' : 'dead';
    const newStatus = newLive ? 'live' : 'dead';
    const key = `${x},${y}`;
    delete this.liveNbrsCountMap[status][count][key];
    this.liveNbrsCountMap[newStatus][newCount][key] = [x, y];
  }

  private getLiveNbs(x: number, y: number): Cell[] {
    const liveNbs = [];
    for (let i = x - 1; i < x + 2; i += 1) {
      for (let j = y - 1; j < y + 2; j += 1) {
        if (this.isOutsideBorder(i, j)) {
          continue;
        }
        if (i === x && j === y) {
          continue;
        }
        if (this.board[i][j].live) {
          liveNbs.push(this.board[i][j]);
        }
      }
    }
    return liveNbs;
  }

  private addNbrsLiveNbrsCount(x: number, y: number) {
    let count;
    let live;
    for (let i = x - 1; i < x + 2; i += 1) {
      for (let j = y - 1; j < y + 2; j += 1) {
        if (this.isOutsideBorder(i, j)) {
          continue;
        }
        if (i === x && j === y) {
          continue;
        }
        count = this.board[i][j].liveNbrsCount;
        live = this.board[i][j].live;
        this.board[i][j].liveNbrsCount += 1;
        this.updateLiveNbrsCountMap({
          x: i,
          y: j,
          count,
          newCount: count + 1,
          live,
          newLive: live,
        });
      }
    }
  }

  private decreaseNbrsLiveNbrsCount(x: number, y: number) {
    let count;
    let live;
    for (let i = x - 1; i < x + 2; i += 1) {
      for (let j = y - 1; j < y + 2; j += 1) {
        if (this.isOutsideBorder(i, j)) {
          continue;
        }
        if (i === x && j === y) {
          continue;
        }
        count = this.board[i][j].liveNbrsCount;
        live = this.board[i][j].live;
        this.board[i][j].liveNbrsCount -= 1;
        this.updateLiveNbrsCountMap({
          x: i,
          y: j,
          count,
          newCount: count - 1,
          live,
          newLive: live,
        });
      }
    }
  }

  killCell(x: number, y: number) {
    if (this.isOutsideBorder(x, y)) {
      return;
    }
    if (!this.board[x][y].live) {
      return;
    }
    this.board[x][y].live = false;
    this.board[x][y].playerIdsMap = {};
    this.updateLiveNbrsCountMap({
      x,
      y,
      live: true,
      newLive: false,
      count: this.board[x][y].liveNbrsCount,
      newCount: this.board[x][y].liveNbrsCount,
    });
    this.decreaseNbrsLiveNbrsCount(x, y);
  }

  private reviveCell(x: number, y: number) {
    if (this.isOutsideBorder(x, y)) {
      return;
    }
    const deadCell = this.board[x][y];
    const liveNbs = this.getLiveNbs(x, y);
    deadCell.live = true;
    liveNbs.forEach((cell) => {
      deadCell.playerIdsMap = {
        ...deadCell.playerIdsMap,
        ...cell.playerIdsMap,
      };
    });
    this.updateLiveNbrsCountMap({
      x,
      y,
      live: false,
      newLive: true,
      count: this.board[x][y].liveNbrsCount,
      newCount: this.board[x][y].liveNbrsCount,
    });
    this.addNbrsLiveNbrsCount(x, y);
  }

  makeCellAlive(x: number, y: number, playerId: string): CleanCell | void {
    if (this.isOutsideBorder(x, y)) {
      return;
    }
    if (!this.playersMap[playerId]) {
      return;
    }
    if (this.board[x][y].live) {
      return;
    }
    this.board[x][y].live = true;
    this.board[x][y].playerIdsMap[playerId] = true;
    this.updateLiveNbrsCountMap({
      x,
      y,
      live: false,
      newLive: true,
      count: this.board[x][y].liveNbrsCount,
      newCount: this.board[x][y].liveNbrsCount,
    });
    this.addNbrsLiveNbrsCount(x, y);
    return this.processCell(this.board[x][y]);
  }
}

export default {};
