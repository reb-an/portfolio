//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

import {
    CheckEcran
} from "../utils/CheckEcran.js";

import {
    Client
} from "../utils/Client.js";



/**
 * Class representant la scène du jeu comme tel
 */

export class SceneJeu extends Phaser.Scene {

	constructor() {
		super("SceneJeu");

		//Propriétés de la scène du jeu comme tel		
		this.tempsRestant; // Temps restant pour le jeu
		this.tempsTxt; // Objet de type text pour afficher le temps restant
		this.scoreTxt; // Objet de type text pour afficher le score au fur et à mesure
        this.tableauPlats = []; //Tableau pour enregistrer les plats de produits
        this.tableauCommande = [];//Tableau listant les produits à trouver
		this.minuterie; //La minuterie pour le temps du jeu
		this.grille = null; //La grille pour la mise en page du jeu
        this.ensemble; // Une commande
        this.tabImgErreur = [];
        this.client;
        this.jeuGagne = false;
        this.erreurTxt;
        
        
        //les sons
        this.musiqueJeu = null;
        this.sonClic = null;
        this.sonEnsembleReussi = null;
        this.sonProchainEnsemble = null;
        this.sonJeuFini = null;
        this.sonPerdu = null;
        
	}

	init() {
		this.tempsRestant = game.jeuRestaurant.TEMPS_JEU;//Initialiser le temps restant
		game.jeuRestaurant.score = 0; // Initialise le score
		this.tableauPlats = [];//Initialiser le tableau des plats
		this.tableauCommande = [];//Initialiser les produits à trouver
        this.ensemble = 1;
        this.chances = 3;
        this.tabImgErreur = [];
        this.nbErreur = 0;
        this.jeuGagne = false;
        this.musiqueJeu = this.sound.add("musiqueJeu", {volume:0.3}, true); 
        this.musiqueJeu.loop = true;
        this.sonClic = this.sound.add("sonClic", {volume:0.3});
        this.sonEnsembleReussi = this.sound.add("EnsembleReussi", {volume:0.3});
        this.sonProchainEnsemble = this.sound.add("ProchainEnsemble", {volume:0.3});
        this.sonJeuFini = this.sound.add("JeuFini", {volume:0.3});
        this.sonPerdu = this.sound.add("Perdu", {volume:0.3});
	}

	create() {
        //son
        //this.laMusique.destroy();
        this.musiqueJeu.play();
		//Instancier une grille de montage avec 8 colonnes et 12 rangées
		this.grille = new GrilleMontage(this, 6, 12, 0xff0000);
//		this.grille.afficherGrille();

		this.afficherTextesEtPlats()

		//Placer les plats
		this.placerPlats();

		//Choisir 
		this.prochaineCommande();

		//Mettre l'écouteur sur la scène
        this.input.on('gameobjectdown', this.cliquerAliment,this);
        
		//Partir la minuterie pour le temps du jeu
		this.minuterie = this.time.addEvent({
			delay: 1000,
			loop: true,
			callback: this.diminuerTemps,
			callbackScope: this
		});
	}//fin de la fonction create

    
	afficherTextesEtPlats() {

		//Taille et style du texte
		let tailleTexte = Math.round(36 * GrilleMontage.ajusterRatioX());
        
		let styleTexteEntete = {
			font: `bold ${tailleTexte}px tamuragaki`,
			color: "#FEF0C9",
			textAlign: "left",
		}
        
        let styleTexteJeu = {
			font: `normal ${tailleTexte*1.5}px 'tamuragaki'`,
			color: "#6D392E",
			textAlign: "center",
		}
        
        //Bordure en haut
        let rectHaut;
        rectHaut = this.add.graphics(10, 10);
        rectHaut.fillStyle("0x6D392E", 1);
        rectHaut.fillRect(0, 0, this.grille.largeurColonne*6, this.grille.hauteurLigne * 0.8);
        rectHaut.setDepth(1);
        
        
        //Text temps
		this.tempsTxt = this.add.text(this.grille.largeurColonne*0.5, this.grille.hauteurLigne/5, "Temps: " + this.tempsRestant, styleTexteEntete);
		this.tempsTxt.setOrigin(0, 0);
		this.tempsTxt.setDepth(30);
        
        //Text score
        this.scoreTxt = this.add.text(this.grille.largeurColonne*4,this.grille.hauteurLigne/5, "score: "+game.jeuRestaurant.score, styleTexteEntete);
        this.scoreTxt.setOrigin(0,0);
        this.scoreTxt.setDepth(30);
        
        //Text ensemble
        this.ensembleTxt = this.add.text(this.grille.largeurColonne*3, this.grille.hauteurLigne*10, "Ensemble "+this.ensemble, styleTexteJeu);
        this.ensembleTxt.setOrigin(0.5,0.5);
        
        //Affichage de l'icone du client
        this.client = this.add.image(this.grille.largeurColonne*3.5, this.grille.hauteurLigne*1.5, "client_idle");
        this.client.setOrigin(0.5,0.5);
        this.client.setScale(1.4);
//        this.grille.mettreEchelleDimensionMaximale( this.client, 5.5);

        
        //Affichage du fond de la grille du cadre du jeu
        let rect = this.add.graphics(0,0);
        rect.fillStyle("0xFFFDE3", 1);
        rect.fillRect(0,this.grille.hauteurLigne*2.9,this.grille.largeurColonne*8,this.grille.hauteurLigne*6.2);
        
        //Affichage des cases du cadre du jeu
        let cellule = 18;
        for (let i=0;i<game.jeuRestaurant.NB_ALIMENTS;i++) {
            let fondPuzzle = this.add.sprite(0,0,"fond_case");
            this.grille.placerIndexCellule(cellule+i, fondPuzzle);
            this.grille.mettreEchelleDimensionMaximale(fondPuzzle, 0.85);
        }
            
        //Affichage de la section commande
        for (let i=1; i<=4;i++) {
            this.fond = this.add.image(this.grille.largeurColonne*1.5+(this.grille.largeurColonne*(i*0.8)), this.grille.hauteurLigne*11, "fond_commande");
            this.grille.mettreEchelleDimensionMaximale(this.fond, 0.85);
        }
      
        let commandeImg = this.add.image((this.grille.largeurColonne*0.5),this.grille.hauteurLigne*11,"commande_bulle");
        this.grille.mettreEchelleDimensionMaximale(commandeImg, 1.3);
        commandeImg.setOrigin(0,0.5);
        
        // Affichage du tableau d'erreurs
        for (let i=0; i<4; i++) {
            
           this.tabImgErreur.push(this.add.image(this.grille.largeurColonne*0.4, (this.grille.hauteurLigne*1.1)+this.grille.hauteurLigne*(i*0.5), "erreur").setScale(0.15).setAlpha(0));
        }
	}//fin de la fonction afficherTextesEtPlats()
    
    /*
    *Fonction qui crée et place les plats
    */
    placerPlats() {
        
        //Détruit tous les éléments du tableau lorsque la fonction est appelée
        for (let i = 0; i < this.tableauPlats.length; i++) {
            this.tableauPlats[i].destroy();
        }
        
        let cellule = 18;//première cellule
        
        this.tableauPlats = [];
        
        //Créer le tableau de plats
        for (let i = 0; i < game.jeuRestaurant.NB_ALIMENTS; i++) {
            //Ajoute - en ordre - chaque premiers éléments de la feuille de sprite contenant les illustrations des plats
            this.tableauPlats.push(this.add.image(0,0,"plat",i).setInteractive()); //rend les images cliquables
        }
        
        this.tableauPlats = Phaser.Utils.Array.Shuffle(this.tableauPlats); //Mélange le tableau de plats
        
        //Règle la dimension des sprites dans les cases
        for (let i = 0; i < this.tableauPlats.length; i++) {
            this.grille.placerIndexCellule(cellule+i, this.tableauPlats[i]);
            this.grille.mettreEchelleDimensionMaximale(this.tableauPlats[i],1);
        }
        
	}//fin de la fonction placerPlats

    /*
    *Fonction qui génère une nouvelle commande de produits
    */
    prochaineCommande() {
        
        this.tableauCommande = [];
        let tabIndex = []; //création d'un tableau des vignettes possibles

        for (let i=0; i<game.jeuRestaurant.NB_ALIMENTS; i++) {
            tabIndex.push(i);
        };

        Phaser.Utils.Array.Shuffle(tabIndex); //Mélange du tableau de chiffre 
        
        //Sélection de 4 chiffre parmi les 48 pour avoir les 4 plats que le joueur doit retrouver
       for (let i=0; i<4;i++) {
           
           let posX = (this.grille.largeurColonne*1.95)+(this.grille.largeurColonne*1)*(i*0.8);
           let posY = this.grille.hauteurLigne*11.3;
           
           //ajout d'images au tableau
           this.tableauCommande.push(this.add.image(posX,this.grille.hauteurLigne*11,"plat",tabIndex[i]));
           
           //redimensionnement
           this.tableauCommande[i].setOrigin(0,0.5);
           this.grille.mettreEchelleDimensionMaximale(this.tableauCommande[i], 0.8);
       } 
        
    }//fin de la fonction prochaineCommande
    
    /*
    *gerer les clics sur les plats
    */
	cliquerAliment(pointer, cible) {
        
        //jouer son
        this.sonClic.play();
      
        //Animation simple des aliment (Rebond au clic)
        var tweenClique;
         tweenClique = this.tweens.add({
            targets:cible,
            duration:1000,
            scaleX:1,
            scaleY:1,
            ease: 'Elastic.easeOut',
        });
        
        let produitCible = cible.frame.name; //sauvegarde l'index du plat cliqué
        
        let dansLaListe = null;//variable booléenne qui enregistre si le plat fait parti de la commande ou non
        
        //Pour chaque plat dans la commande...
        for (let i=0; i<this.tableauCommande.length;i++) {
            
            let produitDansListe = this.tableauCommande[i].frame.name;//enregistre l'index des plats de la commande
            
            if (produitCible == produitDansListe) {
                //si l'index du produit cible équivaut à l'un des index des plats
                dansLaListe = true;//le produit fait donc parti des plats demandés
                
                game.jeuRestaurant.score+=5;//On augmente le score
                
                //Animation du score
                 this.tweens.add({
                    targets: this.scoreTxt,
                    duration: 100,
                        props: {
                            alpha:0.7,
                        },
                    ease: 'Circ.easeOut',
                    yoyo: true
                });
                
                //Animation du plat dans le tableau: alpha 1 -> 0
                this.tweens.add({
					targets:cible,
                    delay:300,
                    duration:200,
                    alpha:0,
					ease: 'Circ.easeOut',
				});
                
                //Animation du plat dans la commande: alpha 1 -> 0
                this.tweens.add({
                    targets:this.tableauCommande[i],
                    duration:600,
                    alpha:0,
					ease: 'Circ.easeOut',
                   
                });
                
                //On enlève le produit en question du tableau de commande
                Phaser.Utils.Array.SpliceOne(this.tableauCommande, i);
                
            }//fin condition if produitCible==produitDansListe
            
        }//fin boucle for
        
        
        if (dansLaListe == true) {//Si le produit cliqué faisait parti de la commande
            
            this.client.destroy();//Destruction du sprite précédent
            
            // génère une nouvelle image de client, qui joue une animation
            let unClient = new Client(this, this.grille.largeurColonne*3.5,this.grille.hauteurLigne*1.5, "client_good");
            this.client = unClient;
            // remet l'image du client à celle par défaut
            setTimeout(
                function() {
                    unClient.setTexture("client_idle");
            }, 500);
            
        }
        
        else { //Si le joueur a fait une erreur
            
            this.client.destroy();//Destruction du sprite précédent
            
            let unClient = new Client(this, this.grille.largeurColonne*3.5,this.grille.hauteurLigne*1.5, "client_bad");
            this.client = unClient;
            
            // remet l'image du client à celle par défaut
            if (unClient != null)  {
                setTimeout(
                function() {
                    if (unClient != undefined) {
                        unClient.setTexture("client_idle");
                    }
                }, 500);
            }
                
            game.jeuRestaurant.score-=10; //augmente le score
            
            
            this.nbErreur++;
            let wrong = this.add.image(cible.x,cible.y, "erreur").setScale(0.2);
            this.tabImgErreur[this.nbErreur-1].setAlpha(1);
            
            //Animation du plat dans le tableau: alpha 1 -> 0
            this.tweens.add({
                targets:[cible, wrong],
                delay:300,
                duration:200,
                alpha:0,
                ease: 'Circ.easeOut',
            });
            
            this.tempsRestant-=5;//On diminue le temps restant
            
            //Animation sur le temps
            this.tweens.add({
                targets: this.tempsTxt,
                duration: 100,
                    props: {
                        scaleX: 1.02,
                        scaleY: 1.02,
                        alpha:0.6,
                    },

                ease: 'Circ.easeOut',
                yoyo: true
            });
            
            //Si le joueur fait 4 erreurs = PERDU
            if (this.nbErreur>=this.tabImgErreur.length) {
                this.client = new Client(this, this.grille.largeurColonne*3.5,this.grille.hauteurLigne*1.5, "client_failure");
                
                this.jeuGagne = false;
                
                let tempsFin = this.time.addEvent({
                    delay: 1000,
                    callback: this.perdu,
                    callbackScope:this
                });
                
                for (let i=0; this.tableauPlats.length;i++) {
                    this.input.disable(this.tableauPlats[i]);//Enleve l'interactivité des plats
                }
            }
        }
           
        
        if (this.tableauCommande.indexOf(this.tableauCommande[0])==-1) {
            //Si le joueur complète l'ensemble
            
            //jouer son
            this.sonEnsembleReussi.play();
            this.jeuGagne = true;
            
            //Après 1 seconde
            let tempsAttente = this.time.addEvent({
                delay: 1000,
                callback: function (){
                    this.ensemble++;//augmente le num de l'ensemble
                    this.ensembleTxt.text = "Ensemble "+  this.ensemble;
                    game.jeuRestaurant.score+=10; //augmente le score
                    this.placerPlats(); //replace les plats
                    this.prochaineCommande(); //génère une nouevelle commande
                    
                    //jouer son
                    this.sonProchainEnsemble.play();
                },
                callbackScope:this
            });
        
        }//fin condition if (this.tableauCommande.indexOf ...
        
        this.calculerScore();//Appel de la fonction qui gère le score
       
	}//fin de la fonction cliquerAliment


	/**
	 * Calcule et affiche le temps restant pour le jeu - est appelé à chaque seconde
	 */
	diminuerTemps() {
        
		this.tempsRestant--; //diminue le temps restant
		this.tempsTxt.text = "Temps: " + this.tempsRestant; //Affiche le temps restant

		//Si toutes les secondes sont écoulées, c'est la fin du jeu
		if (this.tempsRestant === 0 || this.tempsRestant<=0) {
			//Arrêter la minuterie du jeu
			this.minuterie.destroy();

			//Enlever l'écouteur sur la scène
			this.input.off('gameobjectdown', this.choisirImages, this);

			//Faire jouer le son de la fin du jeu
            this.sonJeuFini.play();
			//On va à la scène de la fin du jeu
			this.scene.start("SceneFinJeu");
            this.musiqueJeu.destroy();
		}
	}
    
    perdu() {
        this.scene.start("SceneFinJeu");
        this.sonPerdu.play();
        this.musiqueJeu.destroy();
    }
    
    calculerScore() {
        this.scoreTxt.text = "Score: " + game.jeuRestaurant.score;//Affiche le score du joueur
    }

}