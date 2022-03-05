import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ConwaysGame, CleanBoard } from '../../libs/conways-game';
import { ConwaysGameManager } from '../../libs/conways-game-manager';

const conwaysGameManager = new ConwaysGameManager(new ConwaysGame(30), 2000);

type Player = {
  id: string;
  color: string;
};

const getUser = (socket: Socket): Player => {
  const token = socket.handshake.auth.authorization;
  const secretKey = process.env.SECRET_KEY || 'hello_world';
  return jwt.verify(token, secretKey) as Player;
};

export const conwaysGameAuthenticator = (socket: Socket, next: any) => {
  try {
    socket.data.user = getUser(socket);
    next();
  } catch (e: any) {
    console.error(e);
    next(e);
  }
};

const emitGameStartedEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  nop.emit(
    'game_started',
    conwaysGame.getSize(),
    conwaysGame.getPlayer(playerId),
    conwaysGame.getPlayers(),
    conwaysGame.getBoard()
  );
};
const emitPlayerJoinedEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  nop.broadcast.emit('player_joind', conwaysGame.getPlayer(playerId));
};

const subscribePlayerForBoardUpdatedEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  conwaysGameManager.subscribe(
    conwaysGame.getPlayer(playerId),
    (board: CleanBoard) => {
      nop.emit('board_updated', board);
    }
  );
};

const handleReviveCellEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  nop.on('revive_cell', (x: number, y: number) => {
    const cell = conwaysGame.reviveCell(x, y, playerId);
    if (!cell) {
      nop.emit('revive_cell_failed', x, y, conwaysGame.getCell(x, y));
    }
  });
};

const handleDisconnectEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  // The player disconnects
  nop.on('disconnect', (reason) => {
    console.log(
      `Player with id of ${playerId} disconnected. Readon: ${reason}.`
    );
    conwaysGame.removePlayer(playerId);
    conwaysGameManager.unsubscribe(playerId);
  });
};

export const conwaysGameHandler = (nop: Socket) => {
  // Get the user data
  const player: Player = nop.data.user;
  console.log(`Player with oid of ${player} connected.`);

  // Get the conways game object and add new player!
  const conwaysGame = conwaysGameManager.getGame();
  conwaysGame.addPlayer(player);

  // Tell client that we're started
  emitGameStartedEvent(nop, conwaysGame, player.id);
  emitPlayerJoinedEvent(nop, conwaysGame, player.id);

  // Subscribe borad chagnes after evolving
  subscribePlayerForBoardUpdatedEvent(nop, conwaysGame, player.id);

  // Handle events from client
  handleReviveCellEvent(nop, conwaysGame, player.id);
  handleDisconnectEvent(nop, conwaysGame, player.id);
};

export {};
