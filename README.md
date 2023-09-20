# Wallet Watchers

## Usage
1. Start Docker
2. Run `make build run` to build and run the container. Website is viewable at `localhost:4000`.
3. Run `make stop` to stop the container. **YOU MUST DO THIS BEFORE RUNNING `make build run` AGAIN.**

## Development
1. Open VSCode and install the Docker extension.
2. Open the container in VSCode by clicking the Docker icon in the bottom left corner, selecting `Attach to Running Container`, and selecting `wallet-container`.
3. Make changes inside of the container. The website will automatically update when changes are saved. Your changes will also be saved locally.
4. When you are ready to commit/push your changes, you should do so outside of the container.
