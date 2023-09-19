# Wallet Watchers

## Usage
1. Start Docker
2. Run `make build run` to build and run the container.
3. Run `make stop` to stop the container.

## Usage (old but still works)
1. Start Docker
2. Build container using `docker build -t wallet-watchers .`
3. Run container using `docker run -dp 3000:3000 wallet-watchers`. Note that this will print out the the id of the container and run it in the background.
4. Navigate to `localhost:3000` in your browser to view the app.

You can stop the container using `docker stop <container id>` and restart it using `docker start <container id>`.