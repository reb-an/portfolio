/**
 * Classe CheckEcran
 * pour le cours 582-448-MA
 * @author Johanne Massé
 * @version 1.1 : 2019-04-26
 *          
 */


export class CheckEcran {
    /**
     * @constructor
     * @param {Phaser.Scene} scene       La scène du jeu en cours
     * @param {String}       orientation L'orientation souhaitée pour le jeu exprimée sous forme de chaîne
     */
    constructor(scene, orientation = Phaser.Scale.PORTRAIT) {

        if ((scene instanceof Phaser.Scene) != true) {
            console.log("Attention - il n'y a pas de scène!");
            //On sort donc du constructeur
            return;
        }

        //Récupérer les informations passées en paramètres
        this.scene = scene;
        this.orientationJeu = orientation;

        console.log("this.orientationJeu", this.orientationJeu);

        //Propriété pour enregistrer si l'orientation actuelle est correcte ou non
        this.bonneOrientation = true;

        //Gestionnaire d'événement pour détecter les rotation d'écrans du joueur
        this.scene.scale.on('resize', this.verifierRotation, this);
    }

    verifierRotation() {
        /*Vérifier l'orientation en cours avec window.orientation qui retournera un angle comme suit:
        0 = portrait-primary
        90 = landscape-primary
        180 = portrait-secondary
        -90 = landscape-secondary
        */
        let orientationActuelle;
        //Si l'angle retourné est de 90 ou -90, on est en mode paysage...
        if (Math.abs(window.orientation) === 90) {
            // Paysage
            orientationActuelle = Phaser.Scale.LANDSCAPE;
        } else {
            // Portrait
            orientationActuelle = Phaser.Scale.PORTRAIT;
        }

        if (orientationActuelle === Phaser.Scale.LANDSCAPE) {
            //On est en mode paysage!
            if (this.orientationJeu === Phaser.Scale.LANDSCAPE) {
                this.bonneOrientation = true;
            } else {
                this.bonneOrientation = false;
            }

        } else {
            //On est en mode portrait!
            if (this.orientationJeu === Phaser.Scale.PORTRAIT) {
                this.bonneOrientation = true;
            } else {
                this.bonneOrientation = false;
            }
        }

        //La scène distribue un événement pour avertir du changement d'orientation
        console.log("L'orientation est  " + this.bonneOrientation);
        
        this.scene.events.emit("changementOrientation", this.bonneOrientation);
        return this.bonneOrientation;
    }
}