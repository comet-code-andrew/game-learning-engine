import GameScene from "./HelloWorldScene"
import { Direction } from "./Direction.js"

export class Player {
  constructor( sprite, tilePos) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;

    this.tilePos = tilePos
    this.sprite = sprite
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      this.tilePos.x * GameScene.TILE_SIZE + offsetX,
      this.tilePos.y * GameScene.TILE_SIZE + offsetY
    );
    this.sprite.setFrame(55);
  }

  getPosition() {
    return this.sprite.getBottomCenter();
  }

  setPosition(position){
    this.sprite.setPosition(position.x, position.y);
  }

  getTilePosition() {
    return this.tilePos.clone()
  }

  setTilePosition(tilePosition){
    this.tilePos = tilePosition.clone();
  }

  stopAnimation() {

    if (this.sprite.anims.currentAnim) {
      const standingFrame = this.sprite.anims.currentAnim.frames[1].frame.name;
      this.sprite.anims.stop();
      this.sprite.setFrame(standingFrame);
    }
  }

  startAnimation(direction) {
    this.sprite.anims.play(direction)
  }

}
