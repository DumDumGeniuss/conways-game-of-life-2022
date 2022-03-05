# Conways Game of Life Server

This is our server-side app of the Conways Game of Life.

## Game Rules

1. Basic Conways Game of Life rules applied, check this [wiki page](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

2. When a cell revived, the color will be the **"average color of all colors of live neigbours"**.

3. The only thing user can do is to **"revive dead cells"**.

## Implementation

We have two classes **ConwaysGame** and **ConwaysGameManager** and one **conways-game** socket handler.

### ConwaysGame Class

A class that takes manages a Conways Game ecosystem, it does the following things:

1. Initialize a Conways game with given size. By default, all cells are dead cells.

2. Add or remove players from the game.

3. Generate next generation of cells.

4. Allow us to interface the ecosystem, e.g: Revive a cell with color from a player.

### ConwaysGameManager Class

A class the consumes a ConwaysGame instance and manage do the following things:

1. Provide ConwaysGame instace to a new player in a new socket session.

2. Periodically call **"evolve"** method of ConwaysGame instance, so our ConwaysGame don't have to do it by its own.

3. Subscribe players to the evolution of a ConwaysGame instance, so our clients can receive the event at nearly same time (though latency of internet is inevitable), to better synchronize the game processes of all clients.

### Conways Game Socket Handlers

This handler is in charge of manaing an entire socket seesion, it does:

1. Authenticate users.

2. Listening to events from client and update information in ConwaysGame instance.

3. Trigger events to clients whenever the game board is updated of when a new user joined.

## Development

### Install packages

```bash
yarn
```

### Develop

Develop with hot-reload enabled.

```bash
yarn dev
```

### Build

This will compile Typescript and generate Javascript in **/dist** folder.

```bash
yarn build
```

### Start Server

Build and start the server.

```bash
yarn start
```

### Unit Tests

Run all unit tests.

```bash
yarn test
```

Or build unit tests whiling watch it.

```bash
yarn test:watch
```

### Lint Checks

```bash
yarn lint
```

### Pre Commit Hook

Please make .husky/pre-commit executable

```bash
chmod +x .husky/pre-commit
```

## TODO LIST

### Logging system

We don't have a good logging system yet, will need to implement a mechanism to allow us to collect logs from servers and put them somewhere.

### Save Game Progress

Currenltly the game is saved in memory, which means when you restart the server, the game progress will lose.

So we have to save it in database, and impelment mechanisms to be able to restore the game progress while people join the previous game.

### Distrubuted Server

Our Conways game is currently managed by the ConwaysGame object, which means a gmae can only be hosted in one server.

If we have multiple servers, we have to either direct players to the server where their game is hosted or put the game in a cahce that can be accessed by all servers.

### Game Points

To make the game more interesting, I want to introduce points to the game, for instance, when your cell swallow other players' cells, you get points.
