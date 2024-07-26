import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { BasicClass } from "./BasicClass";

export class Fires extends BasicClass {
    constructor(bg, hero) {
        super();
        this.bg = bg;
        this.hero = hero;
        this.sprites = [];
        this.createSprites();

        this.bg.onMapChange(() => {
            this.handleMapChange();
        });
    }

    handleMapChange() {
        this.clearSprites();
        this.createSprites();
    }

    createSprites() {
        this.clearSprites(); 
        if (this.bg.map === 'map1') {
            for (const point of App.config.locationFires) {
                this.createSingleSprite(...point);
            }
        } else if (this.bg.map === 'map2') {
            for (let i = 0; i < 7; i++) {
                this.createSingleSprite();
            }
        } else if (this.bg.map === 'map3') {
            for (let i = 0; i < 0; i++) {
                this.createSingleSprite();
            }
        }
    }

    createSingleSprite( x, y ) {
        const fireSprite = this.animationFromStripe(0, 3, "fire_stripe", true, App.config.TILE_SIZE_SMALL, 0.1);
        // let [x, y] = this.getRandomPosition();
        fireSprite.x = x;
        fireSprite.y = y;
        fireSprite.anchor.set(0.5);
        this.bg.container.addChild(fireSprite);
        this.sprites.push(fireSprite);
    }

    getRandomPosition() {
        const minX = 200;
        const maxX = 600;
        const minY = 200;
        const maxY = 600;

        let x, y;
        let isValidPosition = false;

        while (!isValidPosition) {
            x = Math.random() * (maxX - minX) + minX;
            y = Math.random() * (maxY - minY) + minY;

            isValidPosition = !this.bg.isCollision(x - App.config.TILE_SIZE_SMALL / 2, y, this.bg.map) &&
                              !this.bg.isCollision(x + App.config.TILE_SIZE_SMALL / 2, y, this.bg.map) &&
                              !this.bg.isCollision(x, y - App.config.TILE_SIZE_SMALL / 2, this.bg.map) &&
                              !this.bg.isCollision(x, y + App.config.TILE_SIZE_SMALL / 2, this.bg.map);
        }

        return [x, y];
    }

    animationFromStripe(initialFrame, finalFrame, texture, loop, tileSize, speed) {
        const frameWidth = tileSize;
        const frameHeight = tileSize;
        const animTexture = App.res(texture);

        if (!animTexture) {
            console.error("Texture não encontrada:", texture);
            return;
        }

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
      
        return animatedSprite;
    }

    destroy(sprite) {
        this.bg.container.removeChild(sprite);
    }

    clearSprites() {
        for (const sprite of this.sprites) {
            this.destroy(sprite);
        }
        this.sprites = [];
    }

    isCollidingWith(sprite) {
        return this.sprites.some(fire => fire.getBounds().intersects(sprite.getBounds()));
    }

    checkCollisionWithAttack(attackSprite) {
        let collisionDetected = false;
        this.sprites = this.sprites.filter(fire => {
            if (fire.getBounds().intersects(attackSprite.getBounds())) {
                this.bg.container.removeChild(fire);
                return false;
            }
            return true;
        });
        return collisionDetected;
    }

    update(dt) {

    }
}
