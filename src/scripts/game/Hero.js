import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class Hero {
  constructor(atack) {
    this.atack = atack;
      this.createSprite();
      this.setupMovement();
      this.activeKey = null;
      this.heldKeys = new Set();
  }

  createSprite() {
      this.sprite = this.spriteFromStripeTexture(1, "hero_principal");
      this.sprite.x = App.config.hero.position.x;
      this.sprite.y = App.config.hero.position.y;
      this.sprite.anchor.set(0.5);
  }

  setupMovement() {
      this.vx = 0;
      this.vy = 0;

      window.addEventListener('keyup', this.onKeyUp.bind(this));
      window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onKeyDown(event) {
      this.heldKeys.add(event.key);
      if (this.activeKey) return;
      if (this.activeKey) return;

      if (event.key === 'ArrowLeft') {
          this.startAnimation(3, 5, -App.config.hero.speed, 0, "hero_principal");
          this.vx = -App.config.hero.speed;

      } else if (event.key === 'ArrowRight') {
          this.startAnimation(6, 8, App.config.hero.speed, 0, "hero_principal");
          this.vx = App.config.hero.speed;
      } else if (event.key === 'ArrowUp') {
          this.startAnimation(9, 11, 0, -App.config.hero.speed, "hero_principal");
          this.vy = -App.config.hero.speed;
      } else if (event.key === 'ArrowDown') {
          this.startAnimation(0, 2, 0, App.config.hero.speed, "hero_principal");
          this.vy = App.config.hero.speed;
      }
      this.activeKey = event.key;
  }

  onKeyUp(event) {
    let ArrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    this.heldKeys.delete(event.key);
    if (event.key === this.activeKey && ArrowKeys.includes(event.key)) {

        this.setStaticSpriteToCurrentFrame();
        this.vx = 0;
        this.vy = 0;
        this.activeKey = null;

        for (let key of this.heldKeys) {
            this.onKeyDown({ key });
            break;
        }
    }else{
      
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
  const frameWidth = App.config.frameWidth;
  const frameHeight = App.config.frameHeight;
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
  animatedSprite.animationSpeed = 0.1;
  animatedSprite.loop = true;
  animatedSprite.play();

  animatedSprite.x = this.sprite.x;
  animatedSprite.y = this.sprite.y;
  animatedSprite.anchor.set(0.5);

  this.sprite.parent.addChild(animatedSprite);
  this.sprite.parent.removeChild(this.sprite);
  this.sprite = animatedSprite;
};

setStaticSpriteToCurrentFrame() {
  const currentFrame = this.sprite.currentFrame !== undefined ? this.sprite.currentFrame : 0;

  if (this.sprite.textures && this.sprite.textures[currentFrame]) {
      const frameWidth = App.config.frameWidth;
      const frameHeight = App.config.frameHeight;
      const spriteSheetTexture = this.sprite.textures[currentFrame].baseTexture;
      const frameTexture = new PIXI.Texture(
          spriteSheetTexture,
          new PIXI.Rectangle(currentFrame * frameWidth, 0, frameWidth, frameHeight)
      );

      const staticSprite = new PIXI.Sprite(frameTexture);
      staticSprite.x = this.sprite.x;
      staticSprite.y = this.sprite.y;
      staticSprite.anchor.set(0.5);

      this.sprite.parent.addChild(staticSprite);
      this.sprite.parent.removeChild(this.sprite);
      this.sprite = staticSprite;
  } else {
      console.error('Invalid texture or frame:', currentFrame, this.sprite.textures);
  }
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
