import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class Atack {
    constructor() {
        this.createSprite();
        this.setupMovement();
        this.activeKey = null;
        this.direction = null; 
        this.heldKeys = new Set();
    }
  
    createSprite() {
        this.sprite = this.spriteFromStripeTexture(1, "hitDown");
        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        this.sprite.anchor.set(0.5);
    }
  
    setupMovement() {
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  
    onKeyDown(event) {
      this.heldKeys.add(event.key);
  
      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
          this.direction = event.key; // Atualiza a direção com a tecla de direção pressionada
      }
  
      if (event.code === 'Space') {
        if (this.direction === "ArrowLeft") {
            this.startAnimation(0, 8, -App.config.hero.speed, 0, "hitLeft");
        } else if (this.direction === "ArrowRight") {
            this.startAnimation(0, 8, App.config.hero.speed, 0, "hitRight");
        }  else if (this.direction === "ArrowUp") {
            this.startAnimation(0, 8, 0, App.config.hero.speed, "hitUp");
        }  else if (this.direction === "ArrowDown") {
            this.startAnimation(0, 8, 0, -App.config.hero.speed, "hitDown");
        }
  
        this.activeKey = event.key;
        }
    }   
    onKeyUp(event) {
      this.heldKeys.delete(event.key);
  
      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
          this.direction = null; 
      }
  
      if (event.key === this.activeKey) {
        this.activeKey = null;
  
        for (let key of this.heldKeys) {
          this.onKeyDown({ key });
          break;
        }
      } else {
        this.activeKey = null;
        for (let key of this.heldKeys) {
          this.onKeyDown({ key });
          break;
        }
      }
    }

startAnimation(initialFrame, finalFrame, vx, vy, texture) {
  this.vx = vx;
  this.vy = vy;
  this.replaceSpriteWithAnimation(initialFrame, finalFrame, texture);
}

replaceSpriteWithAnimation(initialFrame, finalFrame, texture) {
  const frameWidth = App.config.TILE_SIZE_BIG;
  const frameHeight = App.config.TILE_SIZE_BIG;
  const animTexture = App.res(texture);
  const frames = [];

  for (let i = initialFrame; i <= finalFrame; i++) {
      const frameTexture = new PIXI.Texture(
          animTexture,
          new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight)
      );
      frames.push(frameTexture);
  };

  const animatedSprite = new PIXI.AnimatedSprite(frames);
  animatedSprite.animationSpeed = 1;
  animatedSprite.loop = false;
  animatedSprite.play();

  animatedSprite.x = this.sprite.x;
  animatedSprite.y = this.sprite.y;
  animatedSprite.anchor.set(0.5);

  this.sprite.parent.addChild(animatedSprite);
  this.sprite.parent.removeChild(this.sprite);
  this.sprite = animatedSprite;
};

spriteFromStripeTexture(frame, texture) {
  const frameWidth = App.config.frameWidth;
  const frameHeight = App.config.frameHeight;
  const spriteSheetTexture = App.res(texture);

  const frameTexture = new PIXI.Texture(
      spriteSheetTexture,
      new PIXI.Rectangle(frame * frameWidth, 0, frameWidth, frameHeight)
  );
  return new PIXI.Sprite(frameTexture);
}

  update(dt) {

  };
}
