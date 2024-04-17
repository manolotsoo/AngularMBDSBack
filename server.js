require('dotenv').config()

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let { postUser } = require('./routes/users');
let { login, forbidden, internalServer, unauthorized, ok } = require('./routes/auth');
const cors = require('cors');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
// mongodb+srv://ramarolahymanoaniony:<password>@cluster0.y5yxchd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const uri = process.env.MONGO_URI_DEV || process.env.MONGO_URI;
console.log("uri ", uri);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:" + port + "/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

app.use(cors({
  origin: '*',
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
  credentials: true // If you're using cookies for authentication
}));

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// http://serveur..../assignments
app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment)
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

app.route(prefix + '/users')
  .post(postUser)

app.route(prefix + '/auth')
  .post(login)
app.route(prefix + '/internal-server')
  .post(internalServer)
app.route(prefix + '/forbidden')
  .post(forbidden)
app.route(prefix + '/unauthorized')
  .post(unauthorized)
app.route(prefix + '/ok')
  .post(ok)

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


