import { conwaysGameAuthenticator } from '.';

describe('socket-handlers/conways-game', () => {
  describe('conwaysGameAuthenticator', () => {
    it('Should put user in socket object', () => {
      const nextMockup = jest.fn();
      const socket: any = {
        data: {},
        handshake: {
          auth: {
            authorization:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3OTgzNTQ3MDA0MSIsImNvbG9yIjoiIzEyMzQ1NiIsImlhdCI6MTY0NjM4NDg3N30.fCWHQbtXDMssgkuu4J1ZwW-DbyXPbFr9WqYfgz-Aerk',
          },
        },
      };
      conwaysGameAuthenticator(socket, nextMockup);

      expect(nextMockup.mock.calls.length).toBe(1);
      expect(socket.data.user.id).toBe('079835470041');
    });
    it('Should generate new user', () => {
      const nextMockup = jest.fn();
      const socket: any = {
        data: {},
        handshake: {
          auth: {
            authorization: null,
          },
        },
      };
      conwaysGameAuthenticator(socket, nextMockup);
      expect(socket.data.user).not.toBeUndefined();
    });
  });
});
