// Chargement d'express
const express = require('express');
const aws = require('aws-sdk');
const app = express(),
    s3 = new aws.S3();
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Définition de pug comme moteur de template 
app.set('view engine', 'pug');

// Servir des fichiers statiques 
app.use(express.static(__dirname + '/public'));

// Paramètres de connexion à mongoDb
const dbName = "sanimap";
const collName = "sanisettes";
const dbUrl = "mongodb://23.97.161.85:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
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
        collection.find("fields.horaire").toArray(function(err, data){
            if(err){
                throw err;
            }
            // Si je n'ai d'erreur lors de ma requête, je rends le template carte en lui passant mes data
            res.render('carte', { sanisettes : data });
        })
    })
})


aws.config.update({
	accessKeyId: 'AKIAIRPNR4IP65IFSBYQ',
    secretAccessKey: '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',    
    region: 'us-east-2'
});



app.use(bodyParser.json());

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sanimap1',
        key: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});
app.get('/images', function (req, res) {
    res.sendFile(__dirname + '/upload.html');
});

app.post('/upload', upload.array('uploadFile',1), function (req, res, next) {
    res.send("File uploaded successfully to Amazon S3 Server!");
});



// Démarrage de notre app
app.listen(4242, function(){
    console.log("App started at http://localhost:4242");
})