export class Loader {
    constructor(loader, config) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }

    preload() {
        for (const asset of this.config.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            
            // Detecta o tipo de arquivo pela extensão
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1 || asset.key.indexOf(".jpeg") !== -1) {
                this.loader.add(key, asset.data.default);
            } else if (asset.key.indexOf(".mp3") !== -1) {
                this.loader.add(key, asset.data.default);
            }
        }

        return new Promise(resolve => {
            this.loader.load((loader, resources) => {
                this.resources = resources;
                resolve();
            });
        });
    }
}