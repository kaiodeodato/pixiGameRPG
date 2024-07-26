import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";

class Application {
    run(config) {
        this.config = config;

        this.app = new PIXI.Application({ 
            width: window.innerWidth, 
            height: window.innerHeight, 
            transparent: true 
        });
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());
    }

    res(key) {
        return this.loader.resources[key].texture;
    }

    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    start() {
        this.app.stage.removeChildren();
        
        this.scene = new this.config["startScene"]();
        this.app.stage.addChild(this.scene.container);
    }
}

export const App = new Application();
