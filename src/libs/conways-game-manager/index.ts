import { ConwaysGame, Player } from '../conways-game';

/**
 * ConwaysGameManager
 * Takes in cahrge of evolving the ConwaysGame and notify players when updated.
 */
export class ConwaysGameManager {
  private game: ConwaysGame;
  private evolver: NodeJS.Timer;
  private observers: {
    [playerId: string]: Function;
  } = {};

  constructor(g: ConwaysGame, duration: number) {
    this.game = g;
    this.evolver = setInterval(() => {
      this.evolveConwaysGame();
    }, duration);
  }

  getGame(): ConwaysGame {
    return this.game;
  }

  subscribe(player: Player, callback: Function) {
    delete this.observers[player.id];
    this.observers[player.id] = callback;
  }

  unsubscribe(playerId: string) {
    delete this.observers[playerId];
  }

  private evolveConwaysGame() {
    const newBoard = this.game.evolve();

    Object.keys(this.observers).forEach((playerId) => {
      this.observers[playerId](newBoard);
    });
  }

  destroy() {
    clearInterval(this.evolver);
  }
}

export default {};
