var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const anomalyController = require('../controller/anomalyController')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/getAllAnomaly',anomalyController.getAllAnomaly);
router.post('/getAnomalyByUser',anomalyController.getAnomalyByUser);
router.post('/addAnomaly',anomalyController.addAnomaly);
router.post('/deleteAnomaly',anomalyController.deleteAnomaly);

module.exports = router;