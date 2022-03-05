import { ConwaysGame, Player } from '../conways-game';

type Subscribers = {
  [playerId: string]: Function;
};

/**
 * ConwaysGameManager
 * Takes in cahrge of evolving the ConwaysGame and notify players when updated.
 */
export class ConwaysGameManager {
  private game: ConwaysGame;
  private evolver: NodeJS.Timer;
  private subscribers: Subscribers = {};

  constructor(g: ConwaysGame, duration: number) {
    this.game = g;
    this.evolver = setInterval(() => {
      this.evolveConwaysGame();
    }, duration);
  }

  private getSubscriberIds() {
    return Object.keys(this.subscribers);
  }

  getGame(): ConwaysGame {
    return this.game;
  }

  subscribe(player: Player, callback: Function) {
    delete this.subscribers[player.id];
    this.subscribers[player.id] = callback;
  }

  unsubscribe(playerId: string) {
    delete this.subscribers[playerId];
  }

  private evolveConwaysGame() {
    const newBoard = this.game.evolve();

    Object.keys(this.subscribers).forEach((playerId) => {
      this.subscribers[playerId](newBoard);
    });
  }

  destroy() {
    this.getSubscriberIds().forEach((s) => this.unsubscribe(s));
    clearInterval(this.evolver);
  }
}

export default {};
