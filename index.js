// Chargement d'express
const express = require('express');
const app = express();

// Définition de pug comme moteur de template 
app.set('view engine', 'pug');

// Servir des fichiers statiques 
app.use(express.static(__dirname + '/public'));

// Paramètres de connexion à mongoDb
const dbName = "sanimap";
const collName = "sanisettes";
const dbUrl = "mongodb+srv://Julien:admin@clusterjulien.j5olw.mongodb.net/test?authSource=admin&replicaSet=atlas-xesq6s-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const mongoClient = require("mongodb").MongoClient;

// Gestion des routes
// J'aimerais avoir 2 routes : une page d'accueil qui va lister les événements et une page carte qui va afficher les événements sur une carte

// Accueil 
app.get('/', function (req, res) {
    console.log("Page index");

    // Connexion et requete à Mongo
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, function(err, client){
        if(err){
            throw err;
        }
        const collection = client.db(dbName).collection(collName);
        collection.find({"fields.adresse" : { $gte : new Date().toISOString()}}).sort({ "fields.adresse": 1 }).toArray(function(err, data){
            if(err){
                throw err;
            }
            // Si je n'ai d'erreur lors de ma requête, je rends le template index en lui passant mes data
            res.render('index', { sanisettes : data });
        })
    })
})

// Carte 
app.get('/carte', function (req, res) {
    console.log("Page carte");
    // Connexion et requete à Mongo
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, function(err, client){
        if(err){
            throw err;
        }
        const collection = client.db(dbName).collection(collName);
        // Je ne prends que les activités dont la date est supérieure à celle d'aujourd'hui
        collection.find({"fields.date_start" : { $gte : new Date().toISOString()}}).toArray(function(err, data){
            if(err){
                throw err;
            }
            // Si je n'ai d'erreur lors de ma requête, je rends le template carte en lui passant mes data
            res.render('carte', { sanisettes : data });
        })
    })
})

// Démarrage de notre app
app.listen(4242, function(){
    console.log("App started at http://localhost:4242");
})