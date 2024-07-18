import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Background {
    constructor(hero) {
        this.hero = hero;
        this.container = new PIXI.Container();
        this.createSprites();
        this.createCollisionMap();
    }

    createSprites() {
        this.sprite = App.sprite("map1");
        this.container.addChild(this.sprite);
    }

    createCollisionMap() {
        this.collisionContainer = new PIXI.Container();
        this.container.addChild(this.collisionContainer);
    
        const collisionMap = App.config.collisionMap;

        for (let y = 0; y < collisionMap.length; y++) {
            for (let x = 0; x < collisionMap[y].length; x++) {
                const value = collisionMap[y][x];
                let tileSprite;
    
                if (value === 1) {
                    tileSprite = this.SpriteFromSheetTexture(0, 0, "cave");
                } 
                else if (value === 2) {
                    tileSprite = App.sprite("tile");
                    tileSprite.alpha = 0; 
                } 
                else if (value === 4) {
                    tileSprite = new PIXI.Sprite(App.res("stone1"));
                    tileSprite.alpha = 1;
                } 
                else if (value === 5) {
                    const frames = [
                        App.res("water1"),
                        App.res("water2"),
                        App.res("water3"),
                        App.res("water4"),
                        App.res("water5"),
                        App.res("water6"),
                        App.res("water7"),
                        App.res("water8"),
                    ];
                    tileSprite = new PIXI.AnimatedSprite(frames);
                    tileSprite.animationSpeed = 0.1; 
                    tileSprite.play(); 
                }
                else if (value === 6) {
                    tileSprite = this.AnimateFromSheetTexture(0, 8, "waterAnim");
                }
                else if  (value === 7) {
                    tileSprite = this.SpriteFromStripeTexture(0, "waterAnim");
                }
                else if (value === 8) {
                    tileSprite = this.SpriteFromStripeTexture(0, "pit");
                }
                else if (value === 9) {
                    tileSprite = this.SpriteFromStripeTexture(1, "pit");
                }
                else if (value === 10) {
                    tileSprite = this.SpriteFromStripeTexture(2, "pit");
                }
                else if (value === 11) {
                    tileSprite = this.SpriteFromStripeTexture(3, "pit");
                }
                else {
                    tileSprite = new PIXI.Sprite(App.res("tile"));
                    tileSprite.alpha = 0; 
                }
                tileSprite.x = x * App.config.TILE_SIZE_SMALL;
                tileSprite.y = y * App.config.TILE_SIZE_SMALL;
    
                this.collisionContainer.addChild(tileSprite);
            }
        }
    }
    
    AnimateFromSheetTexture(inicialFrame, finalFrame, texture) {
        const frameWidth = App.config.frameWidth;
        const frameHeight = App.config.frameHeight;
        const waterAnimTexture = App.res(texture);
        const frames = [];
        
        for (let i = inicialFrame; i < finalFrame; i++) {
            const frameTexture = new PIXI.Texture(
                waterAnimTexture,
                new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight)
            );
            frames.push(frameTexture);
        }
        const tileSprite = new PIXI.AnimatedSprite(frames);
        tileSprite.animationSpeed = 0.1; 
        tileSprite.play(); 
        
        return tileSprite;
    }
    
    SpriteFromStripeTexture(frame, texture) {
        const frameWidth = App.config.frameWidth;
        const frameHeight = App.config.frameHeight;
        const spriteSheetTexture  = App.res(texture);

        const frameTexture = new PIXI.Texture(
            spriteSheetTexture ,
            new PIXI.Rectangle(frame * frameWidth, 0, frameWidth, frameHeight)
        );
        const sprite = new PIXI.Sprite(frameTexture);
        return sprite; 
    }

    SpriteFromSheetTexture(x, y, texture) {
        const frameWidth = App.config.frameWidth;
        const frameHeight = App.config.frameHeight;
        const spriteSheetTexture  = App.res(texture);

        const frameTexture = new PIXI.Texture(
            spriteSheetTexture ,
            new PIXI.Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight)
        );
        const sprite = new PIXI.Sprite(frameTexture);
        return sprite; 
    }

    isCollision(x, y) {
        let arrayCollisions = [1, 2, 8, 9, 10, 11];
        const mapX = Math.floor(x / App.config.TILE_SIZE_SMALL);
        const mapY = Math.floor(y / App.config.TILE_SIZE_SMALL);
        const tileValue = App.config.collisionMap[mapY] && App.config.collisionMap[mapY][mapX];

        return arrayCollisions.includes(tileValue);
    }

    update(dt) {
        let hero = this.hero;
        if (hero) {
            let proposedX = this.container.x - hero.vx * dt;
            let proposedY = this.container.y - hero.vy * dt;

            console.log(this.container.x, this.container.y)
            if(this.container.x < 328 && this.container.x > 324 && this.container.y < 426 && this.container.y > 422){
                console.log("tesouro")
            }

            const heroWidth = App.config.frameWidth;
            const heroHeight = App.config.frameHeight;

            if (!this.isCollision(
                    -proposedX + App.config.hero.position.x + heroWidth / 2,
                    -this.container.y + App.config.hero.position.y
                ) && 
                !this.isCollision(
                    -proposedX + App.config.hero.position.x - heroWidth / 2,
                    -this.container.y + App.config.hero.position.y
                )) {
                this.container.x = proposedX;
            }
    
            if (!this.isCollision(
                    -this.container.x + App.config.hero.position.x, 
                    -proposedY + App.config.hero.position.y + heroHeight / 2
                ) && 
                !this.isCollision(
                    -this.container.x + App.config.hero.position.x, 
                    -proposedY + App.config.hero.position.y - heroHeight / 2
                )) {
                this.container.y = proposedY;
            }
        }
    }
    
}
