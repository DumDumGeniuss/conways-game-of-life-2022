import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Conway } from '../libs/Conway';

const conwayGame = new Conway(300);
let board: any;
setInterval(() => {
  board = conwayGame.evolve();
}, 1000);

type Player = {
  id: string;
  color: string;
};

const validatePlayer = (socket: Socket): Player => {
  const token = socket.handshake.auth.authorization;
  const secretKey = process.env.SECRET_KEY || '';
  return jwt.verify(token, secretKey) as Player;
};

export const conwayAuthenticator = (socket: Socket, next: any) => {
  try {
    validatePlayer(socket);
    next();
  } catch (e: any) {
    next(e);
  }
};

export const conwaySocketHandler = (nop: Socket) => {
  const player = validatePlayer(nop);
  conwayGame.addPlayer(player);
  nop.emit(
    'start',
    conwayGame.getPlayer(player.id),
    conwayGame.getPlayersMap(),
    conwayGame.getBoard()
  );
  nop.broadcast.emit('player_joind', conwayGame.getPlayer(player.id));

  const boradUpdator = setInterval(() => {
    nop.emit('update_board', board);
  }, 1000);

  nop.on('revive_cell', (x: number, y: number, playerId: string) => {
    const cell = conwayGame.makeCellAlive(x, y, playerId);
    nop.emit('revived_cell', cell);
    nop.broadcast.emit('revived_cell', cell);
  });

  nop.on('disconnect', () => {
    console.log('disconnected');
    clearInterval(boradUpdator);
  });
};

export {};
