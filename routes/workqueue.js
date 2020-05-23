const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const workqueue = require('../models').WorkQueue;
router.get('/view', function (req, res, next) {
    res.render('workQueue', {
        title: 'list of work queue'
    });
});
// GET Route to manage any new work queue
// router.get('/add', isAdmin, (req, res) => {
//     res.render('addWorkQueue', {
//         title: 'Add',
//         user: req.user
//     });
// });

module.exports = router;