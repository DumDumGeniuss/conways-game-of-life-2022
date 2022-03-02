import { Socket } from 'socket.io';
import Conway from '../libs/Conway';

const conwayGame = new Conway(10);

export default (nop: Socket) => {
  console.log(`User with id of ${nop.id} connected`);

  const mapPublisher = setInterval(() => {
    nop.emit('updateMap', conwayGame.getMap());
  }, 1000);

  nop.on('disconnect', () => {
    console.log(`User with id of ${nop.id} disconnected`);
    clearInterval(mapPublisher);
  });
};
