# 4row

Simple four-in-a-row game that implements a client/server design.

## How it works

The game is programmed with `Node.js` on the backend and `p5.js` on the frontend.
`Socket.IO` is used for communication between the client and the server.

When the user connects to the application, they will be able to look for a new game.
If the user decides to do so, they will wait in a room for another player to connect.
Once another player is found, the game will start.
While the game is on, each of the players will be able to leave, kicking the other player out of the room as well.
Once a player wins, each of the players can choose to play again or leave the room.

Inside a room, a counter will display the current win rate of each of the players.
The turn will be random for the first game and will alternate from then on.
The player's color cannot be chosen and is constant for a given room.

<img src="https://github.com/aitorperezzz/4row/blob/master/images/readme_image.png" alt="drawing" align="center" width="50%"/>

## Docker Compose

Copy or download [docker-compose.yml](docker-compose.yml) into a directory.
It uses the published image from GHCR.

From that directory, start the app or update it to the latest published image:

```sh
docker compose up -d --pull always
```

Open <http://localhost:8080>. To play with someone else, share
`http://<server-address>:8080`. Change the left side of `8080:8080` to use a
different host port. You only need the Compose file; cloning the repository
is optional.

Stop the app with `docker compose down`.

## Run locally

With Node.js 22 and npm installed, clone the repository and run:

```sh
npm ci
npm start
```

Open <http://localhost:8080>. Server logs go to the console and `server.log`.

## GitLab CI/CD

Every branch push builds with Buildah and publishes the commit SHA and `latest`
to the local GitLab registry. Only pushes to the default branch (`main` or
`master`) also publish `ghcr.io/aitorperezzz/4row:latest`. Tag pushes and merge
request pipelines do not publish images.

Set `GHCR_TOKEN` as a masked and hidden GitLab CI/CD variable, with expansion
disabled, using a GitHub classic token with `write:packages`. If the variable
is protected, protect the default branch too. After the first publication,
set the GitHub package to **Public** to allow pulls without authentication.
