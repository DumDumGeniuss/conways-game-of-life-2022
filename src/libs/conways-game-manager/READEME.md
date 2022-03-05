# ConwaysGameManager Class

Manage the lifecycle of the ConwaysGame class.

## constructor

On creationion, you need to inject a ConwaysGame instance and the duration between every two evolations.

```typescript
const game: ConwaysGameManager = new ConwaysGame(c: ConwaysGame, duration: number);
```

## methods

### getGame

Get the ConwaysGame

```typescript
type getGame = () => ConwaysGame;
```

### subscribe

Subscribe a player to the evolution events.

```typescript
type subscribe = (player: Player, callback: Function) => void;
```

### unsubscribe

Unsubscribe a player to the evolution events.

```typescript
type unsubscribe = (player: Player) => void;
```

### destroy

Unsubscribe all fans and clear the evolutaion timer.

```typescript
type destroy = () => void;
```
