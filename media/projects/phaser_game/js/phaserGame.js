//Importation des scripts et classes nécessaires
import {
    SceneChargement
} from './scenes/SceneChargement.js';
import {
    SceneIntro
} from './scenes/SceneIntro.js';
import {
    SceneInstruction
} from './scenes/SceneInstruction.js';
import {
    SceneJeu
} from './scenes/SceneJeu.js';
import {
    SceneFinJeu
} from './scenes/SceneFinJeu.js';



window.addEventListener("load", function () {
    let largeur = 640,
        hauteur = 960;

    if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
        largeur = window.innerWidth;
        hauteur = window.innerHeight;
    }

    let config = {
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: largeur,
            height: hauteur,
        },
        backgroundColor: "0xABD9CE",
        scene: [SceneChargement, SceneInstruction, SceneIntro, SceneJeu, SceneFinJeu]
    }

    //brun 0xEBBD8A
    let webFontConfig = {
        //  L'événement 'active' PRÉ-DÉFINI signifie que toutes les polices demandées sont chargées et rendues
        //  Quand cet événement sera distribué, on crééra le jeu
        active: function () {
            //console.log("Les polices de caractères sont chargées");

            // Création du jeu comme tel - comme objet global pour qu'il soit accessible à toutes les scènes du jeu
            window.game = new Phaser.Game(config);

            window.game.jeuRestaurant = {
                TEMPS_JEU: 50, //Le temps du jeu
                TAILLE_IMAGE: 80, //Dimension des images du jeu
                //TAILLE_IMAGE: 30, //Dimension des images du jeu
//                NB_ALIMENTS: 48, //Le nombre de blocs du jeu
                NB_ALIMENTS: 36, //Le nombre de blocs du jeu
                NB_PRODUITS: 72, //Le nombre de produits du jeu
                score: 0, //Score de la partie courante
                meilleurScore: 0, //Meilleur score antérieur enregistré			
                NOM_LOCAL_STORAGE: "scorejeuRestaurant" //Sauvegarde et enregistrement du meilleur score pour le jeu 
            }

        },
        
        
        //  Les polices Google que nous voulons charger. Elles sont précisées dans un tableau (Array)
        //  sous forme de chaîne de caractères(en spécifier autant que vous voulez dans le tableau - mais SANS exagérer)
        google: {
            families: ["Kalam", "Caveat", "Merienda", "Handlee", "Exo 2", "Francois One", 'Concert One', "Roboto"]
        }

    };

    WebFont.load(webFontConfig);

}, false);
