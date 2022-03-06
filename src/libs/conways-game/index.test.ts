import { ConwaysGame } from '.';

describe('ConwaysGame', () => {
  describe('construction', () => {
    it('Should init board on creation', () => {
      const c = new ConwaysGame(100);
      const expected = {
        live: false,
        color: '#000000',
        playerIds: [],
      };
      expect(c.getCell(99, 99)).toEqual(expected);
    });
  });
  describe('addPlayer', () => {
    it('Should add player', () => {
      const c = new ConwaysGame(1);
      const p = { id: '1234', color: '#123456' };
      c.addPlayer(p);

      expect(c.getPlayer(p.id)).toEqual(p);
    });
  });
  describe('removePlayer', () => {
    it('Should remove player', () => {
      const c = new ConwaysGame(1);
      const p = { id: '1234', color: '#123456' };
      c.addPlayer(p);
      c.removePlayer(p.id);

      expect(c.getPlayer(p.id)).toBeUndefined();
    });
  });
  describe('evolve', () => {
    it(`A revived cell's color should be the average color of the live neighbours.`, () => {
      const c = new ConwaysGame(3);
      const p1 = { id: '1', color: '#334455' };
      const p2 = { id: '2', color: '#aabbcc' };
      const p3 = { id: '3', color: '#ccddee' };
      c.addPlayer(p1);
      c.addPlayer(p2);
      c.addPlayer(p3);
      c.reviveCell(0, 0, p1.id);
      c.reviveCell(0, 1, p2.id);
      c.reviveCell(0, 2, p3.id);
      c.evolve();
      expect(c.getCell(1, 1).color).toEqual('#8e9fb0');
    });
    it(`A revived cell should know all parent ids.`, () => {
      const c = new ConwaysGame(3);
      const p1 = { id: '1', color: '#334455' };
      const p2 = { id: '2', color: '#aabbcc' };
      const p3 = { id: '3', color: '#ccddee' };
      c.addPlayer(p1);
      c.addPlayer(p2);
      c.addPlayer(p3);
      c.reviveCell(0, 0, p1.id);
      c.reviveCell(0, 1, p2.id);
      c.reviveCell(0, 2, p3.id);
      c.evolve();
      expect(c.getCell(1, 1).playerIds).toEqual(['1', '2', '3']);
    });
    describe('Class patterns', () => {
      it('Block Pattern', () => {
        const c = new ConwaysGame(4);
        const p = { id: '1234', color: '#112233' };
        c.addPlayer(p);
        c.reviveCell(1, 1, p.id);
        c.reviveCell(1, 2, p.id);
        c.reviveCell(2, 1, p.id);
        c.reviveCell(2, 2, p.id);
        c.evolve();
        const secondGeneration = c.getLiveMap();
        const blockPattern = [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ];

        expect(secondGeneration).toEqual(blockPattern);
      });
      it('Boat Pattern', () => {
        const c = new ConwaysGame(5);
        const p = { id: '1234', color: '#112233' };
        c.addPlayer(p);
        c.reviveCell(1, 1, p.id);
        c.reviveCell(1, 2, p.id);
        c.reviveCell(2, 1, p.id);
        c.reviveCell(2, 3, p.id);
        c.reviveCell(3, 2, p.id);
        c.evolve();
        const secondGeneration = c.getLiveMap();
        const boatPattern = [
          [0, 0, 0, 0, 0],
          [0, 1, 1, 0, 0],
          [0, 1, 0, 1, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 0, 0],
        ];

        expect(secondGeneration).toEqual(boatPattern);
      });
      it('Blink Pattern', () => {
        const c = new ConwaysGame(5);
        const p = { id: '1234', color: '#112233' };
        c.addPlayer(p);
        c.reviveCell(1, 2, p.id);
        c.reviveCell(2, 2, p.id);
        c.reviveCell(3, 2, p.id);
        c.evolve();
        c.evolve();
        c.evolve();
        const secondGeneration = c.getLiveMap();
        const blinkPattern = [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ];

        expect(secondGeneration).toEqual(blinkPattern);
      });
      it('Glider Pattern', () => {
        const c = new ConwaysGame(5);
        const p = { id: '1234', color: '#112233' };
        c.addPlayer(p);
        c.reviveCell(1, 1, p.id);
        c.reviveCell(2, 2, p.id);
        c.reviveCell(2, 3, p.id);
        c.reviveCell(3, 1, p.id);
        c.reviveCell(3, 2, p.id);
        c.evolve();
        const secondGeneration = c.getLiveMap();
        c.evolve();
        const thirdGeneration = c.getLiveMap();
        const gliderPatternOne = [
          [0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
        ];
        const gliderPatternTwo = [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 1, 0, 1, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 1, 0, 0],
        ];

        expect(secondGeneration).toEqual(gliderPatternOne);
        expect(thirdGeneration).toEqual(gliderPatternTwo);
      });
    });
  });
  describe('reviveCell', () => {
    it('Should not activate cell without player', () => {
      const c = new ConwaysGame(1);
      c.reviveCell(0, 0, 'Not exists');

      expect(c.getCell(0, 0).live).toBeFalsy();
    });
    it('Should not activate cell when position exceeds boarder', () => {
      const c = new ConwaysGame(1);
      const p = { id: '1234', color: '#112233' };
      c.reviveCell(5, 5, p.id);

      expect(c.getCell(0, 0).live).toBeFalsy();
    });
    it('Should activate cell', () => {
      const c = new ConwaysGame(1);
      const p = { id: '1234', color: '#112233' };
      c.addPlayer(p);
      c.reviveCell(0, 0, p.id);

      expect(c.getCell(0, 0).live).toBeTruthy();
    });
  });
  describe('killCell', () => {
    it('Should not kill the cell if you are not one of the parents of the cell.', () => {
      const c = new ConwaysGame(1);
      const p = { id: '1234', color: '#112233' };
      c.addPlayer(p);
      c.reviveCell(0, 0, p.id);
      c.killCell(0, 0, '4321');

      expect(c.getCell(0, 0).live).toBe(true);
    });
    it('Should kill the cell', () => {
      const c = new ConwaysGame(1);
      const p = { id: '1234', color: '#112233' };
      c.addPlayer(p);
      c.reviveCell(0, 0, p.id);
      c.killCell(0, 0, '1234');

      expect(c.getCell(0, 0).live).toBeFalsy();
    });
  });
});
