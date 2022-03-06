import { Socket } from 'socket.io';
import { ConwaysGame, CleanBoard } from '../../libs/conways-game';
import { ConwaysGameManager } from '../../libs/conways-game-manager';
import { validateToken, generateToken, User } from '../../utils/authenticate/';
import { generateHash, generateHexColor } from '../../utils/common/';

const conwaysGameManager = new ConwaysGameManager(new ConwaysGame(30), 2000);

enum SocketEventName {
  Logged = 'logged',
  GameStarted = 'game_started',
  PlayerJoined = 'player_joined',
  PlayerLeft = 'player_left',
  BoardUpdated = 'board_updated',
  CellUpdated = 'cell_updated',
  ReviveCell = 'revive_cell',
  KillCell = 'kill_cell',
  Disconnect = 'disconnect',
}

export const conwaysGameAuthenticator = (socket: Socket, next: any) => {
  try {
    socket.data.user = validateToken(socket.handshake.auth.authorization);
    socket.data.token = socket.handshake.auth.authorization;
    next();
  } catch (e: any) {
    const newUser = {
      id: generateHash(),
      color: generateHexColor(),
    };
    socket.data.user = newUser;
    socket.data.token = generateToken(newUser);
    next();
  }
};

const emitLoggedEvent = (nop: Socket, user: User, token: string) => {
  nop.emit(SocketEventName.Logged, user, token);
};

const emitGameStartedEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  nop.emit(
    SocketEventName.GameStarted,
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
  nop.broadcast.emit(
    SocketEventName.PlayerJoined,
    conwaysGame.getPlayer(playerId)
  );
};

const emitPlayerLeftEvent = (nop: Socket, playerId: string) => {
  nop.broadcast.emit(SocketEventName.PlayerLeft, playerId);
};

const emitCellUpatedEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  x: number,
  y: number
) => {
  nop.broadcast.emit(
    SocketEventName.CellUpdated,
    x,
    y,
    conwaysGame.getCell(x, y)
  );
};

const subscribePlayerForBoardUpdatedEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  conwaysGameManager.subscribe(
    conwaysGame.getPlayer(playerId),
    (board: CleanBoard) => {
      nop.emit(SocketEventName.BoardUpdated, board);
    }
  );
};

const handleReviveCellEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  nop.on(SocketEventName.ReviveCell, (x: number, y: number) => {
    conwaysGame.reviveCell(x, y, playerId);

    emitCellUpatedEvent(nop, conwaysGame, x, y);
  });
};

const handleKillCellEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  nop.on(SocketEventName.KillCell, (x: number, y: number) => {
    conwaysGame.killCell(x, y, playerId);

    emitCellUpatedEvent(nop, conwaysGame, x, y);
  });
};

const handleDisconnectEvent = (
  nop: Socket,
  conwaysGame: ConwaysGame,
  playerId: string
) => {
  // The player disconnects
  nop.on(SocketEventName.Disconnect, (reason) => {
    console.log(
      `Player with id of ${playerId} disconnected. Readon: ${reason}.`
    );
    conwaysGame.removePlayer(playerId);
    emitPlayerLeftEvent(nop, playerId);
    conwaysGameManager.unsubscribe(playerId);
  });
};

export const conwaysGameHandler = (nop: Socket) => {
  // Get the user data
  const player: User = nop.data.user;
  console.log(`Player with oid of ${player.id} connected.`);

  // Get the conways game object and add new player!
  const conwaysGame = conwaysGameManager.getGame();
  conwaysGame.addPlayer(player);
  emitLoggedEvent(nop, nop.data.user, nop.data.token);

  // Tell client that we're started
  emitGameStartedEvent(nop, conwaysGame, player.id);
  emitPlayerJoinedEvent(nop, conwaysGame, player.id);

  // Subscribe borad chagnes after evolving
  subscribePlayerForBoardUpdatedEvent(nop, conwaysGame, player.id);

  // Handle events from client
  handleReviveCellEvent(nop, conwaysGame, player.id);
  handleKillCellEvent(nop, conwaysGame, player.id);
  handleDisconnectEvent(nop, conwaysGame, player.id);
};

export {};
