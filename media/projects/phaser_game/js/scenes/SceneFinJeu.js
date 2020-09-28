//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

import {
    CheckEcran
} from "../utils/CheckEcran.js";


/**
 * Class representant la scène du jeu comme tel
 */

export class SceneFinJeu extends Phaser.Scene {

	constructor() {
		super("SceneFinJeu");
        
	}
    
    init() {
        this.musiqueHorsJeu = this.sound.add("musiqueHorsJeu", {volume:0.2}, true); 
        this.musiqueHorsJeu.loop = true;
        this.grille = new GrilleMontage(this, 6, 12, 0xff0000);
    }


	create() {
        
        //Initialiser et jouer la musique
		
        this.musiqueHorsJeu.play();
        
        //Rect1
        let rect1;
        rect1 = this.add.graphics(10, 10);
        rect1.fillStyle("0xc9ac8f", 1);
        rect1.fillRect(0, 0, this.grille.largeurColonne*6, this.grille.hauteurLigne*5);
        rect1.setDepth(0);
        
        //Rect2
        let rect2;
        rect2 = this.add.graphics(10, 10);
        rect2.fillStyle("0xefefef", 1);
        rect2.fillRect(0, this.grille.hauteurLigne*5, this.grille.largeurColonne*6, this.grille.hauteurLigne*0.5);
        rect2.setDepth(0);
        
       
        //Taille et style du texte
//		let tailleTexte = Math.round(36 * GrilleMontage.ajusterRatioX());
  
		//Titre
		let tailleTexte = Math.round(64 * GrilleMontage.ajusterRatioX());

		let titreTxt = this.add.text(this.grille.largeurColonne*3, this.grille.hauteurLigne*3, "Fin du jeu!", {
			font: `normal ${tailleTexte*1.3}px tamuragaki`,
			color: "#FEF0C9",
			align: "center"
		});
        
		titreTxt.setOrigin(0.5, 0);

		//Vérification et enregistrement du meilleur score
		game.jeuRestaurant.meilleurScore = Math.max(game.jeuRestaurant.score, game.jeuRestaurant.meilleurScore);
		localStorage.setItem(game.jeuRestaurant.NOM_LOCAL_STORAGE, game.jeuRestaurant.meilleurScore);

        
        let scoreTxt = this.add.text(this.grille.largeurColonne*3, this.grille.hauteurLigne*5.8, "Score\n"+ game.jeuRestaurant.score + "\n\n", {
			font: `bold ${tailleTexte}px tamuragaki`,
			color: "#f2f2f2",
			align: "center"
		});
        scoreTxt.setOrigin(0.5, 0);
        
        let meilleurScoreTxt = this.add.text(this.grille.largeurColonne*3, this.grille.hauteurLigne*8, "Meilleur score: "+ game.jeuRestaurant.meilleurScore + "\n\n", {
			font: `normal ${tailleTexte*0.7}px tamuragaki`,
			color: "#f2f2f2",
			align: "center"
		});
        meilleurScoreTxt.setOrigin(0.5, 0);

		//Instancier le bouton, le dimensionner
		let btnRejouer, btnRetour;

		btnRejouer = this.add.image(this.grille.largeurColonne*4.5, this.grille.hauteurLigne*10.5, "bouton");
        btnRejouer.setScale(0.4)
        btnRejouer.setOrigin(0.5,0.5);
		//Animation du bouton
		this.tweens.add({
		    targets: btnRejouer,
		    angle: 360,
		    ease: 'Circ.easeOut',
		});

		//Aller à l'écran de jeu en cliquant sur le bouton
		btnRejouer.setInteractive();
		btnRejouer.once("pointerdown", (e)=>{this.choisirOption(e, "SceneJeu")} , this);
        
        btnRetour = this.add.text(this.grille.largeurColonne*1, this.grille.hauteurLigne*10, "Menu", {
			font: `normal ${tailleTexte*1.2}px tamuragaki`,
			color: "#f2f2f2",
			align: "center",
            fil:"#F4E7D4",
		});
        
        btnRetour.setInteractive();
        btnRetour.once("pointerdown", (e)=>{this.choisirOption(e, "SceneIntro")} , this);
        
	}

	choisirOption(pointer, choixScene) {
		//Aller à l'écran de jeu
        this.musiqueHorsJeu.destroy();
		this.scene.start(choixScene);
	}

}