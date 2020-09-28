//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

import {
    CheckEcran
} from "../utils/CheckEcran.js";


/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneIntro extends Phaser.Scene {

	constructor() {
		super("SceneIntro");
        this.infoTxt;
	}
    
    init() {
        this.infoTxt="";
        this.musiqueHorsJeu = this.sound.add("musiqueHorsJeu", {volume:0.2}, true); 
        this.musiqueHorsJeu.loop = true;
        this.grille = new GrilleMontage(this, 6, 12, 0xff0000);
    }
    
	create() {
        this.musiqueHorsJeu.play();
        this.grille = new GrilleMontage(this, 8, 12);
        let rect;
        rect = this.add.graphics(10, 10);
        rect.fillStyle("0xE8CBA9", 1);
        rect.fillRect(0, 0, this.grille.largeurColonne * 8, this.grille.hauteurLigne * 6)
        
        let rect2;
        rect2 = this.add.graphics(10, 10);
        rect2.fillStyle("0xffffff", 1);
        rect2.fillRect(0, this.grille.hauteurLigne*6, this.grille.largeurColonne * 8, this.grille.hauteurLigne * 1)
        
        let imageDeco;
        imageDeco = this.add.image(game.config.width / 2,this.grille.hauteurLigne*6, "game_icon");
        GrilleMontage.mettreEchelleHauteurJeu(imageDeco, 0.3);
//        imageDeco.setScale(0.01)
        
        
        
        
		//Titre
		let tailleTexte = Math.round(50 * GrilleMontage.ajusterRatioX());
        let textTxt= ["BUSPRO"];
		let styleTxt =  {
			font: `bold ${tailleTexte*3}px Tamuragaki`,
			color: "#F4E7D4",
			align: "center"
		};
        
        this.infoTxt = this.add.text(game.config.width / 2, this.grille.hauteurLigne*-1, textTxt[0], styleTxt);
        this.infoTxt.setOrigin(0.5, 0);
        this.tweens.add({
			targets: this.infoTxt,
			y: this.grille.hauteurLigne*2,
			duration: 1000,
			ease: 'Bounce.easeOut',
			callbackScope: this,
			onComplete: this.afficherBouton
		});
//        for (let i = 0; i < 5; i++){
//            this.infoTxt = this.add.text(game.config.width / 2, game.config.height, textTxt[i], styleTxt);
//            this.infoTxt.setOrigin(0.5, -3+-i);
//
//		//Animation du texte d'intro
//		this.tweens.add({
//			targets: this.infoTxt,
//			y: 0,
//			duration: 1000,
//			ease: 'Sine.easeInOut',
//            delay: 100*i,
//			callbackScope: this,
//			onComplete: this.afficherBouton
//		});
//        }
        
        
        
        //Gestion de l'orientation sur mobile
        if(!this.sys.game.device.os.desktop){
                    //Instancier un objet qui vérifiera et avertira des changements de rotation de l'écran
            let leCheckEcran = new CheckEcran(this);
            this.gererChangementOrientation(leCheckEcran.verifierRotation());
            //La scène écoute l'événement qui sera géré lors des changements d'orientation
            this.events.on("changementOrientation", this.gererChangementOrientation, this);
        }

	}

	afficherBouton() {
		//Instancier le bouton, le dimensionner
		let posX = game.config.width / 2,
			posY = game.config.height * 0.85,
			leBouton;

		leBouton = this.add.image(posX, posY, "bouton");
		GrilleMontage.mettreEchelleRatioX(leBouton);
		
		//Teindre le bouton
		//leBouton.setTint("#708090");
        leBouton.alpha = 0;
		//Animation du bouton
		this.tweens.add({
			targets: leBouton,
            delay:100,
            duration:400,
			alpha: 1,
			ease: 'Circ.easeOut',
		});

		//Aller à l'écran de jeu en cliquant sur le bouton
		leBouton.setInteractive();
		leBouton.once("pointerdown", this.allerEcranJeu, this);
	}
    /*
    animationFinIntro(){
		//Animation du texte d'intro
		this.tweens.add({
			targets: this.infoTxt,
			y: -5000,
			duration: 1000,
			ease: 'Sine.easeInOut',
			callbackScope: this,
			//onComplete: this.afficherBouton
		})
    }
    */
    gererChangementOrientation(bonneOrientation) {
        // console.log("gererChangementOrientation, correcte?", bonneOrientation);

        //Si l'écran n'est pas dans la bonne direction, on met le jeu et le son en pause
        //Et, on gère la balise HTML
        if (!bonneOrientation) {
            this.scene.pause(this);
            document.getElementById("orientation").style.display = "block";

        } else {
            this.scene.resume(this);
            document.getElementById("orientation").style.display = "none";
        }

    }

	allerEcranJeu() {
		//Aller à l'écran de jeu
		this.scene.start("SceneInstruction");
	}
}