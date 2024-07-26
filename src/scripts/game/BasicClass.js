import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class BasicClass {
    constructor() {}
     
    spriteFromStripeTexture(frame, texture) {
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

    spriteFromSheetTexture(x, y, texture) {
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

    spriteFromSheetTextureWithFrame(x, y, texture, frameSize) {
        const frameWidth = frameSize;
        const frameHeight = frameSize;
        const spriteSheetTexture  = App.res(texture);

        const frameTexture = new PIXI.Texture(
            spriteSheetTexture ,
            new PIXI.Rectangle(x + frameWidth, y + frameHeight, frameWidth, frameHeight)
        );
        const sprite = new PIXI.Sprite(frameTexture);
        return sprite; 
    }

    isCollision(x, y, map) {
        let arrayCollisions = [1, 2, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]  ;
        const mapX = Math.floor(x / App.config.TILE_SIZE_SMALL);  
        const mapY = Math.floor(y / App.config.TILE_SIZE_SMALL);
        this.tileValue = App.config[map][mapY][mapX];

        return arrayCollisions.includes(this.tileValue);
    }
}