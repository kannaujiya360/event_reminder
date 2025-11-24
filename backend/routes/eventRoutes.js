const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/eventController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload'); 

router.use(auth); 


router.post('/', upload.single('image'), eventCtrl.createEvent);


router.get('/', eventCtrl.getEvents);


router.put('/:id', upload.single('image'), eventCtrl.updateEvent);


router.delete('/:id', eventCtrl.deleteEvent);

module.exports = router;
