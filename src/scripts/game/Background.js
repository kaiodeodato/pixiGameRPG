import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { BasicClass } from "./BasicClass";

export class Background extends BasicClass {
    constructor() {
        super();
        this.map = "map1";
        this.container = new PIXI.Container();
        this.createSprites(this.map);
        this.mapChangeListeners = [];
    }



    createSprites(map) {
        this.sprite = App.sprite(map);
        this.container.addChild(this.sprite);
        this.createCollisionMap(map);
    }

    createCollisionMap(map) {
        this.collisionContainer = new PIXI.Container();
        this.container.addChild(this.collisionContainer);
        const collisionMap = App.config[map];

        for (let y = 0; y < collisionMap.length; y++) {
            for (let x = 0; x < collisionMap[y].length; x++) {
                const value = collisionMap[y][x];

                let tileSprite;

                switch(value){
                    case 1:
                        tileSprite = this.spriteFromSheetTexture(0, 0, "cave");
                        break;
                    case 2:
                        tileSprite = App.sprite("tile");
                        tileSprite.alpha = 0; 
                        break;
                    case 3:
                        break;
                    case 4:
                        tileSprite = this.spriteFromSheetTexture(0, 0, "Inner");
                        break;
                    case 5:
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
                        break;
                    case 6:
                        tileSprite = this.AnimateAndReturnFromSheetTexture(0, 8, "waterAnim");
                        break;
                    case 7:
                        tileSprite = this.spriteFromStripeTexture(0, "waterAnim");
                        break;
                    case 8:
                        tileSprite = this.spriteFromSheetTexture(0, 1, "Inner");
                        break;
                    case 9:
                        tileSprite = this.spriteFromSheetTexture(10, 0, "cave");
                        break;
                    case 10:
                        tileSprite = this.spriteFromSheetTextureWithFrame(33, -160, "Overworld", 160);
                        tileSprite.anchor.set(0.5);
                        break;
                    case 11:
                        tileSprite = this.spriteFromSheetTexture(2, 17, "Overworld");
                        break;
                    case 12:
                        tileSprite = this.spriteFromSheetTexture(3, 17, "Overworld");
                        break;
                    case 13:
                        tileSprite = this.spriteFromSheetTexture(3, 18, "Overworld");
                        break;
                    case 14:
                        tileSprite = this.spriteFromSheetTexture(2, 18, "Overworld");
                        break;
                    case 15:
                        tileSprite = this.spriteFromSheetTexture(4, 17, "Overworld");
                        break;
                    case 16:
                        tileSprite = this.spriteFromSheetTexture(4, 18, "Overworld");
                        break;
                    case 17:
                        tileSprite = this.spriteFromSheetTexture(1, 19, "Overworld");
                        break;
                    case 18:
                        tileSprite = this.spriteFromSheetTexture(0, 19, "Overworld");
                        break;
                    case 19:
                        tileSprite = this.spriteFromSheetTexture(0, 17, "Overworld");
                        break;
                    case 20:
                        tileSprite = this.spriteFromSheetTexture(0, 18, "Overworld");
                        break;
                    case 22:
                        tileSprite = this.spriteFromSheetTexture(10, 0, "cave");
                        break;
                    case 23:
                        tileSprite = this.spriteFromSheetTexture(10, 0, "cave");
                        break;
                    case 25:
                        tileSprite = this.spriteFromSheetTexture(6, 7, "Inner");
                        break;
                    case 30:
                        tileSprite = this.spriteFromSheetTexture(9, 1, "cave");
                        break;
                    case 31:
                        tileSprite = this.spriteFromSheetTexture(8, 1, "cave");
                        break;
                        
                    default:
                        tileSprite = new PIXI.Sprite(App.res("tile"));
                        tileSprite.alpha = 0; 
                        break;
                }
            
                if (tileSprite) {
                    tileSprite.x = x * App.config.TILE_SIZE_SMALL;
                    tileSprite.y = y * App.config.TILE_SIZE_SMALL;
                    this.collisionContainer.addChild(tileSprite);
                }
            }
        }
    }
    
    AnimateAndReturnFromSheetTexture(inicialFrame, finalFrame, texture) {
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

    onMapChange(callback) {
        this.mapChangeListeners.push(callback);
    }

    mapChange(newMap) {
        if (newMap !== this.map) {
            this.container.removeChild(this.sprite);
            this.collisionContainer.removeChildren();

            this.map = newMap;
            this.createSprites(newMap);
            this.notifyMapChange();
        }
    }
  
    notifyMapChange() {
        for (const callback of this.mapChangeListeners) {
            callback();
        }
    }
    
    update(dt){
    }
}
