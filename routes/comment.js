var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const commentController = require('../controller/commentController')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/addComment',commentController.addComment);
router.post('/getAnomalyComments',commentController.getAnomalyComments);


module.exports = router;