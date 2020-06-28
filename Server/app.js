let express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  database = require('./database'),
  bodyParser = require('body-parser'),
  createError = require('http-errors');

// Connect mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected at " + database.db)
  },
  error => {
    console.log("Database could't be connected to: " + error)
  }
)

const gameAPI = require('./routes/game.route');
const playerAPI = require('./routes/player.route');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// API
app.use('/game', gameAPI);
app.use('/player', playerAPI);

// Choose port and start listen
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
});

// Find 404s
app.use((req, res, next) => {
    next(createError(404));
})

// Error handling
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });