import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Display {
    constructor(hero) {
        this.hero = hero;
        this.container = new PIXI.Container();
        this.sprites = [];
        this.createSprites();
        this.createPlayButton();
        this.musicResource = null;
    }

    createSprites() {
        this.createLifeHearts();
    }

    createLifeHearts() {
        this.clearHearts();
        for (let i = 0; i < this.hero.life; i++) {
            this.addSprite();
        }
    }

    updateLife() {
        this.createLifeHearts();
    }

    addSprite() {
        const sprite = this.spriteFromSheetTexture(7, 3, "objects2");
        if (sprite) {
            sprite.x = App.config.lifeStartX + this.sprites.length * App.config.lifeSpacing;
            sprite.y = App.config.lifeStartY;
            this.container.addChild(sprite);
            this.sprites.push(sprite);
        }
    }

    clearHearts() {
        for (let sprite of this.sprites) {
            this.container.removeChild(sprite);
        }
        this.sprites = [];
    }

    spriteFromSheetTexture(x, y, texture) {
        const frameWidth = App.config.frameWidth;
        const frameHeight = App.config.frameHeight;
        const spriteSheetTexture = App.res(texture);

        if (!spriteSheetTexture) {
            console.error(`Texture '${texture}' not found`);
            return null;
        }

        const frameTexture = new PIXI.Texture(
            spriteSheetTexture,
            new PIXI.Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight)
        );
        return new PIXI.Sprite(frameTexture);
    }

    createPlayButton() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Font Awesome 6 Free',
            fontSize: 30,
            fill: '#ffffff',
            align: 'center',
            fontWeight: '900'
        });

        const playButtonText = new PIXI.Text('\uf028', style);
        playButtonText.x = window.innerWidth - 60;
        playButtonText.y = 20;
        playButtonText.interactive = true;
        playButtonText.buttonMode = true;

        playButtonText.on('pointerdown', () => this.toggleMusic());

        this.container.addChild(playButtonText);
    }

    toggleMusic() {
        if (this.musicResource) {
            if (this.musicResource.paused) {
                this.musicResource.play().catch(e => {
                    console.error('Erro ao tocar a música:', e);
                });
            } else {
                this.musicResource.pause();
            }
        } else {
            const musicResource = App.loader.resources['Ring'];
            if (musicResource) {
                this.musicResource = new Audio(musicResource.url);
                this.musicResource.loop = true;
                this.musicResource.volume = 0.2;
                this.musicResource.play().catch(e => {
                    console.error('Erro ao tocar a música:', e);
                });
            } else {
                console.error('Recurso de música não encontrado');
            }
        }
    }

    update() {
    }
}
