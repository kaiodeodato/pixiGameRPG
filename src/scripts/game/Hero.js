import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { BasicClass } from "./BasicClass";

export class Hero extends BasicClass {
    constructor(bg, onLifeChange) {
        super();
        this.bg = bg;
        this.onLifeChange = onLifeChange;
        this.createSprite();
        this.setupMovement();
        this.activeKey = null;
        this.heldKeys = new Set();
        this.maxLife = App.config.hero.life;
        this.life = this.maxLife;
        this.damageCooldown = App.config.hero.damageCooldown;
        this.lastDamageTime = 0;
    }

    createSprite() {
        this.sprite = this.spriteFromStripeTexture(1, "hero_principal");
        this.sprite.x = App.config.hero.initial.position.x;
        this.sprite.y = App.config.hero.initial.position.y;
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

        if (event.key === 'ArrowLeft') {
            this.startAnimation(3, 5, -App.config.hero.speed, 0, "hero_principal", true, App.config.TILE_SIZE_SMALL, 0.1);
        } else if (event.key === 'ArrowRight') {
            this.startAnimation(6, 8, App.config.hero.speed, 0, "hero_principal", true, App.config.TILE_SIZE_SMALL, 0.1);
        } else if (event.key === 'ArrowUp') {
            this.startAnimation(9, 11, 0, -App.config.hero.speed, "hero_principal", true, App.config.TILE_SIZE_SMALL, 0.1);
        } else if (event.key === 'ArrowDown') {
            this.startAnimation(0, 2, 0, App.config.hero.speed, "hero_principal", true, App.config.TILE_SIZE_SMALL, 0.1);
        }
        this.activeKey = event.key;
    }

    onKeyUp(event) {
        let ArrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        this.heldKeys.delete(event.key);

        if (event.key === this.activeKey && ArrowKeys.includes(event.key)) {
            this.setStaticSpriteToCurrentFrame(this.activeKey);
            this.vx = 0;
            this.vy = 0;
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
            };
        
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
        };

    setStaticSpriteToCurrentFrame(direction) {
        const directionDict = {
            "ArrowDown": 1,
            "ArrowUp": 10,
            "ArrowLeft": 5,
            "ArrowRight": 7,
        };
        let currentFrame;

        if (this.sprite.currentFrame !== undefined && directionDict.hasOwnProperty(direction)) {
            currentFrame = directionDict[direction];
        } else {
            console.error("Direção inválida ou currentFrame não definido:", direction);
        }

        if (this.sprite) {
            const frameWidth = App.config.frameWidth;
            const frameHeight = App.config.frameHeight;
            const spriteSheetTexture = App.res("hero_principal");
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
    }

    takeDamage(amount) {
        const now = Date.now();
        
        if (now - this.lastDamageTime < this.damageCooldown) {
            return;
        }

        this.lastDamageTime = now;
    
        this.life -= amount;
        if (this.life < 0) {
            this.life = 0;
        }

       this.damageHit();
    
        if (this.onLifeChange) {
            this.onLifeChange();
        }
    }

    damageHit(){
        this.sprite.tint = 0xFF0000;
        setTimeout(() => { 
            this.sprite.tint = 0xFFFFFF;
        }, 200);
    }
    

    isCollidingWith(sprite) {
        return this.sprite.getBounds().intersects(sprite.getBounds());
    }

    checkIfWillMove(dt) {
        let proposedX = this.sprite.x + this.vx * dt;
        let proposedY = this.sprite.y + this.vy * dt;

        if (
            !this.bg.isCollision(proposedX - App.config.frameWidth / 2, proposedY, this.bg.map) &&
            !this.bg.isCollision(proposedX + App.config.frameWidth / 2, proposedY, this.bg.map)
        ) {
            this.sprite.x = proposedX;
        }

        if (
            !this.bg.isCollision(proposedX, proposedY - App.config.frameHeight / 2, this.bg.map) &&
            !this.bg.isCollision(proposedX, proposedY + App.config.frameHeight / 2, this.bg.map)
        ) {
            this.sprite.y = proposedY;
        }

        this.ChangeMap(proposedX, proposedY, this.bg.map)
    }

    ChangeMap(x, y, map) {
      let pointToMap1 = 22;
      let pointToMap2 = 23;
      let pointToMap3 = 24;
      let pointToMap4 = 25;

      const mapX = Math.floor(x / App.config.TILE_SIZE_SMALL);
      const mapY = Math.floor(y / App.config.TILE_SIZE_SMALL);
      this.tileValue = App.config[map][mapY] && App.config[map][mapY][mapX];
  
      if (this.tileValue === pointToMap2 && !this.hasChangedMap) {
        this.hasChangedMap = true;

        this.bg.mapChange("map1");

        const newPosition = App.config.hero["point1"].position;
        this.sprite.x = newPosition.x;
        this.sprite.y = newPosition.y;
      } 

      if (this.tileValue === pointToMap1 && !this.hasChangedMap) {
          this.hasChangedMap = true;
  
          this.bg.mapChange("map2");
  
          const newPosition = App.config.hero["point2"].position;
          this.sprite.x = newPosition.x;
          this.sprite.y = newPosition.y;
      }
    
      if (this.tileValue === pointToMap3 && !this.hasChangedMap) {
        this.hasChangedMap = true;

        this.bg.mapChange("map3");

        const newPosition = App.config.hero["point4"].position;
        this.sprite.x = newPosition.x;
        this.sprite.y = newPosition.y;
      } 
      if (this.tileValue === pointToMap4 && !this.hasChangedMap) {
        this.hasChangedMap = true;

        this.bg.mapChange("map1");

        const newPosition = App.config.hero["point5"].position;
        this.sprite.x = newPosition.x;
        this.sprite.y = newPosition.y;
      } 
      else if (this.tileValue !== pointToMap1) {
            this.hasChangedMap = false;
      }
  }

    update(dt) {
        this.checkIfWillMove(dt);
    }
}
