type Player = {
  ip: string;
  color: string;
};
type Action = {
  playerId: string;
};
type Cell = {
  alive: boolean;
  ownerIds: number[];
};
type GameMap = Cell[][];

class Conway {
  private players: Player[] = [];
  private actionQueue: Action[] = [];
  private map: GameMap = [];

  constructor(size: number) {
    this.initializeMap(size);
  }

  initializeMap(size: number) {
    this.map = [];
    for (let i = 0; i < size; i += 1) {
      this.map.push([]);
      for (let j = 0; j < size; j += 1) {
        this.map[i].push({ alive: false, ownerIds: [] });
      }
    }
  }

  getMap(): GameMap {
    return this.map;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  resetActions() {
    this.actionQueue = [];
  }

  addAction(action: Action) {
    this.actionQueue.push(action);
  }

  getActions(): Action[] {
    return this.actionQueue;
  }

  render() {}
}

export default Conway;
