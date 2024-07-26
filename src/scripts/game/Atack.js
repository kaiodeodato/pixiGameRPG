import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { BasicClass } from "./BasicClass";

export class Atack extends BasicClass {
    constructor(bg, hero, enemies, fires) {
        super();
        this.bg = bg;
        this.hero = hero;
        this.enemies = enemies;
        this.fires = fires; // A referência direta ao objeto de fogo
        this.createSprite();
        this.setupMovement();
        this.activeKey = null;
        this.direction = "ArrowDown"; 
        this.heldKeys = new Set();
    }
  
    createSprite() {
        this.sprite = this.spriteFromStripeTexture(1, "hitDown");
        this.sprite.anchor.set(0.5);
    }
  
    setupMovement() {
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    updateMovement(){
        if (this.hero) {
          this.sprite.x = this.hero.sprite.x;
          this.sprite.y = this.hero.sprite.y;
      }
    }
  
    onKeyDown(event) {
        this.heldKeys.add(event.key);

        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
            this.direction = event.key; 
        }
  
        if (event.code === 'Space') {
            this.executeAttack();
            this.activeKey = event.key;
        }
    }   
  
    onKeyUp(event) {
        this.heldKeys.delete(event.key);
        this.activeKey = null;
    }

    executeAttack() {
        const attackGraphic = new PIXI.Graphics();
        attackGraphic.beginFill(0x000000);
        attackGraphic.drawRect(0, 0, 32, 32);
        attackGraphic.endFill();
        attackGraphic.alpha = 0;

        switch (this.direction) {
            case "ArrowLeft":
                attackGraphic.x = this.hero.sprite.x - 20;
                attackGraphic.y = this.hero.sprite.y;
                this.startAnimation(0, 8, -App.config.hero.speed, 0, "hitLeft", false, App.config.TILE_SIZE_BIG, 1);
                break;
            case "ArrowRight":
                attackGraphic.x = this.hero.sprite.x + 20;
                attackGraphic.y = this.hero.sprite.y;
                this.startAnimation(0, 8, App.config.hero.speed, 0, "hitRight", false, App.config.TILE_SIZE_BIG, 1);
                break;
            case "ArrowUp":
                attackGraphic.x = this.hero.sprite.x;
                attackGraphic.y = this.hero.sprite.y - 20;
                this.startAnimation(0, 8, 0, App.config.hero.speed, "hitUp", false, App.config.TILE_SIZE_BIG, 1);
                break;
            case "ArrowDown":
                attackGraphic.x = this.hero.sprite.x;
                attackGraphic.y = this.hero.sprite.y + 20;
                this.startAnimation(0, 8, 0, -App.config.hero.speed, "hitDown", false, App.config.TILE_SIZE_BIG, 1);
                break;
        }

        attackGraphic.pivot.set(16, 16);

        this.bg.container.addChild(attackGraphic);
        this.checkCollisionsWithEnemies(attackGraphic);
        this.checkCollisionsWithFires(attackGraphic);

        setTimeout(() => {
            this.bg.container.removeChild(attackGraphic);
        }, 200);
    }

    checkCollisionsWithEnemies(attackGraphic) {
        for (const enemy of this.enemies.sprites) {
            if (attackGraphic.getBounds().intersects(enemy.sprite.getBounds())) {
                enemy.takeDamage(0.5);
            }
        }
    }
    checkCollisionsWithFires(attackGraphic) {
      if (this.fires && this.fires.sprites) {
          this.fires.sprites.forEach(fire => {
              if (attackGraphic.getBounds().intersects(fire.getBounds())) {
                  this.fires.checkCollisionWithAttack(attackGraphic);
              }
          });
      }
  }

    startAnimation(initialFrame, finalFrame, vx, vy, texture, loop, tileSize, speed) {
        this.vx = vx;
        this.vy = vy;
        this.animationFromStripe(initialFrame, finalFrame, texture, loop, tileSize, speed);
    }

    animationFromStripe(initialFrame, finalFrame, texture, loop, tileSize, speed) {
        const frameWidth = tileSize;
        const frameHeight = tileSize;
        const animTexture = App.res(texture);
        const frames = [];
    
        for (let i = initialFrame; i <= finalFrame; i++) {
            const frameTexture = new PIXI.Texture(
                animTexture,
                new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight)
            );
            frames.push(frameTexture);
        }
    
        const animatedSprite = new PIXI.AnimatedSprite(frames);
        animatedSprite.animationSpeed = speed;
        animatedSprite.loop = loop;
        animatedSprite.play();
    
        animatedSprite.x = this.sprite.x;
        animatedSprite.y = this.sprite.y;
        animatedSprite.anchor.set(0.5);
    
        this.sprite.parent.addChild(animatedSprite);
        this.sprite.parent.removeChild(this.sprite);
        this.sprite = animatedSprite;
    }


    update() {
      this.updateMovement();
    }
}
