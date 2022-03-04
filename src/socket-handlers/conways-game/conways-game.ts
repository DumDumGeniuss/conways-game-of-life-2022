import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ConwaysGame, CleanBoard } from '../../libs/conways-game';
import { ConwaysGameManager } from '../../libs/conways-game-manager';

const conwaysGameManager = new ConwaysGameManager(new ConwaysGame(10), 1000);

type User = {
  id: string;
  color: string;
};

const getUser = (socket: Socket): User => {
  const token = socket.handshake.auth.authorization;
  const secretKey = process.env.SECRET_KEY || '';
  return jwt.verify(token, secretKey) as User;
};

export const conwaysGameAuthenticator = (socket: Socket, next: any) => {
  try {
    socket.data.user = getUser(socket);
    next();
  } catch (e: any) {
    next(e);
  }
};

export const conwaysGameHandler = (nop: Socket) => {
  // Get the user data
  const player: User = nop.data.user;

  // Get the conways game object and add new player!
  const conwaysGame = conwaysGameManager.getGame();
  conwaysGame.addPlayer(player);

  // Tell client that we're started
  nop.emit(
    'game_started',
    conwaysGame.getPlayer(player.id),
    conwaysGame.getBoard()
  );

  // Tell other players we joined
  nop.broadcast.emit('player_joind', conwaysGame.getPlayer(player.id));

  // Subscribe borad chagnes after evolving
  conwaysGameManager.subscribe(player, (board: CleanBoard) => {
    nop.emit('board_updated', board);
  });

  // The player requests to revive a cell
  nop.on('revive_cell', (x: number, y: number, playerId: string) => {
    const cell = conwaysGame.makeCellAlive(x, y, playerId);
    if (!cell) {
      return;
    }
    nop.emit('cell_revived', x, y, cell);
    nop.broadcast.emit('cell_revived', x, y, cell);
  });

  // The player disconnects
  nop.on('disconnect', () => {
    conwaysGameManager.unsubscribe(player.id);
  });
};

export {};
