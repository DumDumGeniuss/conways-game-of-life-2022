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

  constructor(g: ConwaysGame) {
    this.game = g;
    this.evolver = setInterval(() => {
      this.evolveConwaysGame();
    }, 1000);
  }

  getGame(): ConwaysGame {
    return this.game;
  }

  subscribe(player: Player, callback: Function) {
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
