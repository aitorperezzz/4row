# 4row
Simple four in a row game that implements server/client design.

## How it works
The game is programmed with `Node.js` at the backend and `p5.js` at the frontend.
`Socket.IO` is used for the communication between the client and the server.

When the user connects to the application, they will be able to look for a new game.
If the user decides to do so, they will wait in a room for another player to connect.
Once another player is found, the game will start.
While the game is on, each of the players will be able to leave, kicking the other player from the room as well.
Once a player wins, each of the players can choose to play again or leave the room.

Inside a room, a counter will display the current winrate of each of the players.
The turn will be random for the first game and will alternate from then on.
The color of the player cannot be chosen, and is constant for a given room.

<img src="https://github.com/aitorperezzz/4row/blob/master/images/readme_image.png" alt="drawing" align="center" width="50%"/>

## How to run it
Clone the repository on a Linux box and run:
* `npm install`
* `npm start`

The server will be available at the Linux box, on port 8080.

The logging server-side is done with the `winston` node package, and is outputted to the console and to a file.
This log has different levels of severity.
After running the application for a while, you can read the logs in a file called `server.log`.

To run the published image `ghcr.io/aitorperezzz/4row:latest`, use
`docker compose up -d --pull always`. The server is available on port 8080
by default. Change the host port in `docker-compose.yml` if needed.

## GitLab CI

Every push to any branch builds the image once with Buildah and publishes
`$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA` and `$CI_REGISTRY_IMAGE:latest`
to the local GitLab registry. A push to the default branch (`main` or `master`,
as configured in GitLab) also publishes
`ghcr.io/aitorperezzz/4row:latest`.
Tag pushes and merge request pipelines do not publish images.

Local `latest` follows the last successful publication from any branch, so
pushing a development branch can change the image pulled by local deployments.
GHCR `latest` follows the default branch only.

Configure `GHCR_TOKEN` in GitLab **Settings → CI/CD → Variables** using a
GitHub classic personal access token with `write:packages`. Set visibility to
**Masked and hidden**, disable variable expansion, and never commit the token.
You can define it once at the GitLab `homelab` group level for all six projects.
If the variable is **Protected**, the default branch must be protected too.
Other branches do not need the token.

Commit and push the pipeline changes to the default branch to publish the
first image. Set the package visibility to **Public** in GitHub Packages so
users can pull without logging in. GHCR always uses TLS verification;
`REGISTRY_TLS_VERIFY` only controls the local registry.

## Run the published image

Share `docker-compose.yml` with users; it pulls the published image and
does not require the source code or a local build:

```sh
docker compose up -d --pull always
```

Run the same command again to pull the current `latest` image and recreate the
container if the image changed.
