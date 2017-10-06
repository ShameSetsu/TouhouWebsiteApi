var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

mongoose.connect('mongodb://127.0.0.1:27017');
var Bear = require('./models/bear');



router.use((req, res, next) => {
    console.log('middleware');
    next();
});

router.get('/', (req, res) =>{
    res.json({ message: 'OK' });
});

app.use('/api', router);

router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post((req, res)=> {
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save((err) => {
            if (!err)
                res.json({ message: 'Bear created!' });
            else
                res.send(err);
        });
    })
    .get((req, res) => {
        Bear.find((err, bears) => {
            if (!err)
                res.json({ data: bears });
            else
                res.send(err);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Server online on port ' + port);