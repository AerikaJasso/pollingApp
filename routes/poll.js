const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/Vote');

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: 'yourID',
    key: 'yourKey',
    secret: 'yourSecret',
    cluster: 'us2',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true, votes: votes}));
});

router.post('/', (req, res) => {
    
    const newVote = {
        party: req.body.party,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('poll', 'vote', {
            // send the points
            points: parseInt(vote.points),
            // send the object 
            party: vote.party
        });
        return res.json({ success: true, message: 'Thank you for voting' });
    });
});

module.exports = router;