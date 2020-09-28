/**
 * Classe  PointTexte
 * pour le cours 582-448-MA
 * @author Johanne Massé
 * @version 2019-03-01
 */

export class Client extends Phaser.GameObjects.Sprite  {


	/**
	 * @constructor
	 * @param {object Phaser.Scene} scene	Scène où sera affiché l'instance
	 * @param {Number} posX = 0				Position de l'instance sur l'axe horizontal
	 * @param {Number} posY = 0				Position de l'instance sur l'axe vertical
	 * @param {String} texte = ""			Couleur de la grille affichée
	 * @param {Object} style = null			Objet pour configurer les styles CSS de l'instance
	 */
	constructor(scene, posX = 0, posY = 0, cle = "", vignette = "") {
		if ((scene instanceof Phaser.Scene) != true) {
			console.log("No scene.");
			//On sort donc du constructeur
			return;
		}
		
		//Passer les infos au constructeur de la classe-mère
		super(scene, posX, posY, cle, vignette);

		//Enregistrer la référence à la scène
		this.scene = scene;
		
		//Ajouter le texte dans la scène
		this.scene.add.existing(this);
		
		//Partir l'animation
		this.animerClient();
        
        //Origin
        this.setOrigin(0.5,0.5);
        
        //Default scale
        this.setScale(1.4);
        
        //Depth
        this.setDepth(-1)
	}

	//Méthodes d'instance

	/**
	 * Demarre l'animation avec un "tween"
	 */
	animerClient() {

      this.scene.tweens.add({
            targets: this,
            duration: 250,
            scaleX: 1.45,
            scaleY: 1.45,
          ease:'Bounce.easeIn',
          yoyo:true,
          onComplete: this.reinitialiserInstanceClient,
          callbackScope:this
        });
	}

	/**
	 * Détruit l'instance du point quand son animation est terminée
	 */
	reinitialiserInstanceClient() {
        this.setScale(1.4);
//        this.setTexture("client_idle")
        
	}

}