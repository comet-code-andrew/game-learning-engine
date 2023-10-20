import { Direction } from "./Direction.js"
import { Player } from "./Player.js"
import GameScene from "./HelloWorldScene.js"

const Vector2 = Phaser.Math.Vector2

export class GridPhysics {

  #tileSizePixelsWalked = 0;
  #lastMovementIntent = Direction.NONE
  #movementDirection = Direction.NONE
  #speedPixelsPerSecond = GameScene.TILE_SIZE * 2;
  #movementDirectionVectors = {
    [Direction.UP]: Vector2.UP,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.RIGHT]: Vector2.RIGHT
  }

  constructor( player, tilemap ) {
    this.player = player
    this.tileMap = tilemap
  }

  isBlockingDirection(direction) {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  tilePosInDirection(direction) {
    return this.player
      .getTilePosition()
      .add(this.#movementDirectionVectors[direction]);
  }

  hasBlockingTile(pos) {
    if (this.hasNoTile(pos)) return true;
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
      return tile && tile.properties.collides;
    });
  }

  hasNoTile(pos) {
    return !this.tileMap.layers.some((layer) =>
      this.tileMap.hasTileAt(pos.x, pos.y, layer.name)
    );
  }

  // Our grid physics will move the player on the board according to its grid towards the given direction
  movePlayer(direction) {
    this.#lastMovementIntent = direction;
    // if(!this.isMoving()){
    //   this.startMoving(direction)
    // }
    if (this.isMoving()) return;
    if (this.isBlockingDirection(direction)) {
      this.player.stopAnimation(direction);
    } else {
      this.startMoving(direction);
    }
  }

  update(delta) {
    if (this.isMoving()){
      this.updatePlayerPosition(delta)
      this.#lastMovementIntent = Direction.NONE
    }
  }

  updatePlayerPosition(delta) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);

    if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
    } else if (this.shouldContinueMoving()) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
      this.updatePlayerTilePos();
    } else {
      this.movePlayerSprite(GameScene.TILE_SIZE - this.#tileSizePixelsWalked);
      this.stopMoving();
    }

  }

  updatePlayerTilePos() {
    this.player.setTilePosition(
      this.player
        .getTilePosition()
        .add(this.#movementDirectionVectors[this.#movementDirection])
    );
  }

  shouldContinueMoving() {
    // return this.#movementDirection == this.#lastMovementIntent;
    return (
      this.#movementDirection == this.#lastMovementIntent &&
      !this.isBlockingDirection(this.#lastMovementIntent)
    );
  }

  movePlayerSprite(pixelsToMove) {
    const directionVec = this.#movementDirectionVectors[
      this.#movementDirection
      ].clone();
    const movementDistance = directionVec.multiply(new Vector2(pixelsToMove));
    const newPlayerPos = this.player.getPosition().add(movementDistance);
    this.player.setPosition(newPlayerPos);
    this.#tileSizePixelsWalked += pixelsToMove;
    this.#tileSizePixelsWalked %= GameScene.TILE_SIZE;
  }

  willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate) {
    return (
      this.#tileSizePixelsWalked + pixelsToWalkThisUpdate >= GameScene.TILE_SIZE
    );
  }

  getPixelsToWalkThisUpdate(delta) {
    const deltaInSeconds = delta / 1000;
    return this.#speedPixelsPerSecond * deltaInSeconds
  }

  isMoving() {
    return this.#movementDirection != Direction.NONE;
  }

  startMoving(direction) {
    this.player.startAnimation(direction)
    this.#movementDirection = direction;
    this.updatePlayerTilePos();
  }

  stopMoving(){
    this.player.stopAnimation(this.#movementDirection);
    this.#movementDirection = Direction.NONE;
    // this.player.stopAnimation();
  }
}