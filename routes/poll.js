const express = require('express');
router = express.Router();

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '467960',
    key: 'c12fbde6601da0630621',
    secret: 'c35edd3757b6e70792b2',
    cluster: 'us2',
    encrypted: true
});

router.get('/', (req, res) => {
    res.send('Poll');
});

router.post('/', (req, res) => {
    pusher.trigger('poll', 'vote', {
        // send the points
        points: 1,
        // send the object 
        party: req.body.party 
    });

    return res.json({success: true, message: 'Thank you for voting'});
});

module.exports = router;