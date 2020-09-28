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

export class SceneInstruction extends Phaser.Scene {

    constructor() {
        super("SceneInstruction");
    }

    create() {
        this.grille = new GrilleMontage(this, 8, 12);
        let rect;
        rect = this.add.graphics(10, 10);
        rect.fillStyle("0xD9ECD0", 1);
        rect.fillRect(0, 0, this.grille.largeurColonne * 8, this.grille.hauteurLigne * 12);
        
        //Chargement des sons
        this.sonClic = this.sound.add("sonClic", {
            volume: 0.3
        });
        this.sonProchainEnsemble = this.sound.add("ProchainEnsemble", {
            volume: 0.3
        });
        
        this.page = this.add.image(this.grille.largeurColonne * 4, this.grille.hauteurLigne * 5, "inst1");
        this.page.setOrigin(0.5, 0.5);
        this.grille.mettreEchelleDimensionMaximale(this.page, 5);

        //Pages d'insstruction
        this.pageActuelle = 0;

        //Titre
        let tailleTexte = Math.round(64 * GrilleMontage.ajusterRatioX());

        let titreTxt = this.add.text(game.config.width / 2, this.grille.hauteurLigne, "Instructions", {
            font: `bold ${tailleTexte}px Tamuragaki`,
            color: "#6D392E",
            align: "center"
        });
        titreTxt.setOrigin(0.5, 1);

        //Texte
        tailleTexte = Math.round(36 * GrilleMontage.ajusterRatioX());

        //Instancier le bouton, le dimensionner
        let posX = this.grille.largeurColonne * 4,
            posY = this.grille.hauteurLigne * 11,
            leBouton,
            boutonSuivant,
            boutonPrecedent;

        this.leBouton = this.add.image(posX, posY, "bouton");
        this.grille.mettreEchelleDimensionMaximale(this.leBouton, 1.3)

        //Teindre le bouton
        this.leBouton.setTint("0x6D392E");

        //Animation du bouton
        this.tweens.add({
            targets: this.leBouton,
            angle: 360,
            ease: 'Circ.easeOut',
        });

        //Aller à l'écran de jeu en cliquant sur le bouton
        this.leBouton.setInteractive();
        this.leBouton.once("pointerdown", this.jouer, this);


        //BOUTON SUIVANT
        this.boutonSuivant = this.add.image(this.grille.largeurColonne * 7, this.grille.hauteurLigne * 11, "boutonSuivant").setScale(0.3);;
        this.boutonSuivant.name = "Suivant";
        this.boutonSuivant.setInteractive();
        this.boutonSuivant.on('pointerdown', this.changerPage, this.boutonSuivant);


        //BOUTON PRECEDENT
        this.boutonPrecedent = this.add.image(this.grille.largeurColonne * 1, this.grille.hauteurLigne * 11, "boutonPrecedent").setScale(0.3);
        
        this.boutonPrecedent.name = "Precedent";
        this.boutonPrecedent.setInteractive();
        this.boutonPrecedent.on('pointerdown', this.changerPage, this.boutonPrecedent);
        this.boutonPrecedent.alpha = 0;
        
        //ANIMATION DES DEUX BOUTONS
        this.tweens.add({
            targets: [this.boutonPrecedent, this.boutonSuivant],
            y: this.boutonPrecedent.y - 10,
            duration: 500,
            ease: 'Circ.easeOut',
            yoyo: true,
            repeat: -1
        })

        //Rectangle d'info + text
        this.caseInfo;
        this.caseInfo = this.add.graphics(10, 10);
        this.caseInfo.fillStyle("0xffffff", 1);
        this.caseInfo.fillRect(0, this.grille.hauteurLigne * 7, this.grille.largeurColonne * 8, this.grille.hauteurLigne * 3);

        this.textInfo;
        this.textInfo = this.add.text(this.grille.largeurColonne * 4, this.grille.hauteurLigne * 7.5, "Apportez aux clients les plats demandés et complétez le plus de commandes pour gagner des points", {
            font: `normal ${tailleTexte*1.3}px Tamuragaki`,
            color: "#414b55",
            align: "center",
            backgroundColor: "white",
            wordWrap: { width: this.grille.largeurColonne*7.5, useAdvancedWrap: true }
        });
        this.textInfo.setOrigin(0.5,0)
    }

    jouer(pointer) {
        //jouer son
        this.sonProchainEnsemble.play();
        
        //Aller à l'écran de jeu
        this.scene.start("SceneJeu");
        
        
        for (let i=0; i<game.scene.scenes[0].sound.sounds.length; i++) {
            game.scene.scenes[0].sound.sounds[i].destroy();
        }
    }

    changerPage(Pointer) {
        //Jouer sons
        this.scene.sonClic.play();

        //console.log(this.game);
        if (this.name == "Precedent" && this.scene.pageActuelle > 0) {
            this.scene.pageActuelle--;
        }
        if (this.name == "Suivant" && this.scene.pageActuelle < 4) {
            this.scene.pageActuelle++;
        }
        
        if (this.scene.pageActuelle == 3) {
            this.scene.boutonSuivant.alpha = 0;
        } else {
            this.scene.boutonSuivant.alpha = 1;
        }
        if (this.scene.pageActuelle == 0) {
            this.scene.boutonPrecedent.alpha = 0;
        } else {
            this.scene.boutonPrecedent.alpha = 1;
        }
        
        switch (this.scene.pageActuelle) {
            case 0:
                this.scene.page.setTexture("inst1");
                this.scene.leBouton.setTint("0x6D392E");
                this.scene.textInfo.text = "Apportez aux clients les plats demandés et complétez le plus de commandes pour gagner des points";
                break;
            case 1:
                this.scene.page.setTexture("inst2");
                this.scene.leBouton.setTint("0x6D392E");
                this.scene.textInfo.text = "Pour compléter une commande trouvez les produits de celle-ci parmi les nombreux plats";
                break;
            case 2:
                this.scene.page.setTexture("inst3");
                this.scene.leBouton.setTint("0x6D392E");
                this.scene.textInfo.text = "Évitez de faire une erreur! Du temps et des points vous seront déduits";
                break;
            case 3:
                this.scene.page.setTexture("inst4");
                this.scene.textInfo.text = "Au bout de 4 fautes, vous perdez";
                this.scene.leBouton.setTint("0xffffff");
                break;
            default:this.scene.leBouton.setTint("0x6D392E");
        }

    }

}
