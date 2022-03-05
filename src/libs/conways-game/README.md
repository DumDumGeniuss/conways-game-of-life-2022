# ConwaysGame Class

Initialize a new Conways game with given size.

## constructor

```typescript
const game: ConwaysGame = new ConwaysGame(10);
```

## methods

### getSize

Will return the size of the board.

```typescript
type getSize = () => number;
```

### getCell

Get the cell in the given coordinate.

```typescript
type getCell = (x: number, y: number) => CleanCell;
```

### getBoard

Get the entire board.

```typescript
type getBoard = () => CleanBoard;
```

### getLiveMap

Get a live map of the baord.

```typescript
type getLiveMap = () => LiveMap;
```

Example

```json
[
  [0, 1, 0, 0]
  [0, 1, 0, 0]
  [0, 1, 0, 1]
  [0, 1, 1, 0]
]
```

### evolve

Evolve to get next genearation of the ecosystem.

```typescript
type evolve = () => CleanBoard;
```

### addPlayer

Add a player.

```typescript
type addPlayer = (player: Player) => void;
```

### getPlayers

Get all players in the game

```typescript
type getPlayers = () => Player[];
```

### getPlayer

Get the player with given id

```typescript
type getPlayer = (playerId: string) => Player;
```

### removePlayer

Remove player with given id from the game.

```typescript
type removePlayer = (playerId: string) => void;
```

### reviveCell

Revive the cell in the given coordinate.

```typescript
type reviveCell = (x: number, y: number, playerId: string) => CleanCell;
```
