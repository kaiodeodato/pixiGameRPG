import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { BasicClass } from "./BasicClass";

export class Enemy extends BasicClass {
    constructor(bg, hero, fires, x, y, texture,speed) {
        super();
        this.bg = bg;
        this.hero = hero;
        this.fires = fires;
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.speed = speed;
        this.health = 10;
        this.maxHealth = 10;

        this.directions = {
            up: [9, 11],
            down: [0, 2],
            left: [3, 5],
            right: [6, 8]
        };

        this.currentDirection = 'down';
        this.createSprite();
        this.setupMovement();
    }

    createSprite() {
        this.sprite = this.spriteFromStripeTexture(1, this.texture);  
        
        let positionStartX;
        let positionStartY;

        if (this.x === "?" && this.y === "?") {
            positionStartX = 500 + Math.round(Math.random() * 400);
            positionStartY = 500 + Math.round(Math.random() * 400);
        } else {
            positionStartX = this.x;
            positionStartY = this.y;
        }

        this.sprite.x = positionStartX;
        this.sprite.y = positionStartY;
        this.sprite.anchor.set(0.5);

        this.createHealthBar(); 
    }

    createHealthBar() {
        this.healthBar = new PIXI.Graphics();
        this.healthBar.beginFill(0xFF0000);
        this.healthBar.drawRoundedRect(0, 0, 32, 5, 10);
        this.healthBar.endFill();
        this.healthBar.x = this.sprite.x - 16;
        this.healthBar.y = this.sprite.y - 40;

        this.bg.container.addChild(this.healthBar);
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.beginFill(0xFF0000);
        const healthWidth = (this.health / this.maxHealth) * 32;
        this.healthBar.drawRoundedRect(0, 0, healthWidth, 5, 10);
        this.healthBar.endFill();

        this.healthBar.x = this.sprite.x - 16;
        this.healthBar.y = this.sprite.y - 40;
    }

    checkCollisionsWithFires(attackGraphic) {
        if (this.fires && this.fires.sprites) {
            this.fires.sprites.forEach(fire => {
                if (attackGraphic.getBounds().intersects(fire.getBounds())) {
                    // enemy apaga o fogo
                    // this.fires.checkCollisionWithAttack(attackGraphic);
                    
                    this.takeDamage(0.01);
                    this.damageHit();
                }
            });
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        this.damageHit()

        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
        } else {
            this.updateHealthBar();
        }
    }

    damageHit(){
        this.sprite.tint = 0xFF0000;
        setTimeout(() => {
            this.sprite.tint = 0xFFFFFF;
        }, 200);
    }

    destroy() {
        this.bg.container.removeChild(this.sprite);
        this.bg.container.removeChild(this.healthBar);
        if (this.onDestroy) {
            this.onDestroy();
        }
    }

    setupMovement() {
        this.vx = 0;
        this.vy = 0;
    }

    EnemyMoviment() {
        if (this.health <= 0) return;
        let dx = this.hero.sprite.x - this.sprite.x;
        let dy = this.hero.sprite.y - this.sprite.y;
        let newDirection = this.currentDirection;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                newDirection = 'right';
            } else {
                newDirection = 'left';
            }
        } else {
            if (dy > 0) {
                newDirection = 'down';
            } else {
                newDirection = 'up';
            }
        }
    
        if (newDirection !== this.currentDirection || !this.sprite.playing) {
            this.currentDirection = newDirection;
            const [initialFrame, finalFrame] = this.directions[newDirection];
            this.startAnimation(initialFrame, finalFrame, 0, 0, this.texture, true, App.config.TILE_SIZE_SMALL, 0.03);
        }
      
    }

    getDistance() {
        const dx = this.hero.sprite.x - this.sprite.x;
        const dy = this.hero.sprite.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance;
    }

    isCollidingWith(sprite) {
        return this.sprite.getBounds().intersects(sprite.getBounds());
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

      updatePosition(dt) {
        const hero = this.hero;
        const dx = hero.sprite.x - this.sprite.x;
        const dy = hero.sprite.y - this.sprite.y;
    
        this.vx = dx * this.speed * 0.001;
        this.vy = dy * this.speed * 0.001;
    
        let proposedX = this.sprite.x + this.vx * dt;
        let proposedY = this.sprite.y + this.vy * dt;
    
        if (!this.bg.isCollision(proposedX - App.config.frameWidth / 2, proposedY, this.bg.map) &&
            !this.bg.isCollision(proposedX + App.config.frameWidth / 2, proposedY, this.bg.map)) {
            this.sprite.x = proposedX;
        }
    
        if (!this.bg.isCollision(proposedX, proposedY - App.config.frameHeight / 2, this.bg.map) &&
            !this.bg.isCollision(proposedX, proposedY + App.config.frameHeight / 2, this.bg.map)) {
            this.sprite.y = proposedY;
        }
    }

    setStaticSpriteToCurrentFrame() {
        const directionDict = {
            "down": 1,
            "up": 10,
            "left": 5,
            "right": 7
        };
    
        if (directionDict.hasOwnProperty(this.currentDirection)) {
            const currentFrame = directionDict[this.currentDirection];
    
            if (this.sprite && currentFrame !== undefined) {
                const frameWidth = App.config.frameWidth;
                const frameHeight = App.config.frameHeight;
                const spriteSheetTexture = App.res(this.texture);
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
                console.error('Sprite ou frame inválido:', this.sprite, currentFrame);
            }
        } else {
            console.error("Direção inválida ou currentFrame não definido:", this.currentDirection);
        }
    }

    shouldSkipUpdate() {
        let distance = this.getDistance();
        return distance > 400 || this.health <= 0;
    }

    update(dt) {
        if (this.shouldSkipUpdate()) {
            if (this.sprite instanceof PIXI.AnimatedSprite) {
                this.setStaticSpriteToCurrentFrame();
            }
            return;
        }

        this.updatePosition(dt)
        this.EnemyMoviment();
        this.updateHealthBar();
        this.checkCollisionsWithFires(this.sprite);
    }
}
