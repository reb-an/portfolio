/**
 * Class representant la scène du jeu qui charge les médias.
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene {

    constructor() {
        super("SceneChargement");
    }

    preload() {
        //Charger les images du jeu
        //this.load.setPath("medias/");
        
        this.load.image("bouton", "medias/img/bouton.svg");
        this.load.image("game_icon", "medias/img/game_icon2.png");
        this.load.image("commande_bulle", "medias/img/bubble.svg");
        this.load.image("fond_case", "medias/img/case_bg.svg");
        this.load.image("fond_commande_bulle", "medias/img/order_bg.svg");
        this.load.image("erreur", "medias/img/wrong.svg");
        this.load.image("boutonPrecedent", "medias/img/leftarr.svg");
        this.load.image("boutonSuivant", "medias/img/rightarr.svg");
        this.load.image("fond_lignes", "medias/img/lines.svg");

//        this.load.spritesheet("pleinEcranBtn", "medias/img/pleinEcranBtn.png", {
//            frameWidth: 64,
//            frameHeight: 64
//        });

        this.load.spritesheet("instructions", "medias/img/instructions0.png", {
            frameWidth: 415,
            frameHeight: 622
        });
        
        this.load.image("inst1",  "medias/img/inst1.png");
        this.load.image("inst2",  "medias/img/inst2.png");
        this.load.image("inst3",  "medias/img/inst3.png");
        this.load.image("inst4",  "medias/img/inst4.png");

        this.load.spritesheet("plat", "medias/img/Plats_000.png", {
            frameWidth: 56,
            frameHeight: 56
        }, 72);
        
        this.load.image("fond_commande", "medias/img/order_bg.svg");
  
        this.load.image("client_idle", "medias/img/idle_1.svg");
        this.load.image("client_good", "medias/img/good.svg");
        this.load.image("client_bad", "medias/img/bad.svg");
        this.load.image("client_failure", "medias/img/failure.svg");
        
        this.load.spritesheet("clientEmotion", "medias/img/clientEmotion.png", {
            frameWidth: 122,
            frameHeight: 248
        });

        //Charger les sons
        this.load.audio("musiqueJeu", ["medias/sons/Blue_Dot_Sessions_-_Pinky.mp3"]);
        this.load.audio("musiqueHorsJeu", ["medias/sons/Blue_Dot_Sessions_-_Highride.mp3"]);
        this.load.audio("sonClic", ["medias/sons/son_pop.wav"]);
        this.load.audio("ProchainEnsemble", ["medias/sons/cartoon_pop_distorted.wav", "medias/sons/cartoon_pop_distorted.flac"]);
        this.load.audio("EnsembleReussi", ["medias/sons/bell.wav"]);
        this.load.audio("JeuFini", ["medias/sons/upRising2.wav"]);
        this.load.audio("Perdu", ["medias/sons/upRising1.wav"]);
    }

    create() {
        this.scene.start("SceneIntro");
    }
}
