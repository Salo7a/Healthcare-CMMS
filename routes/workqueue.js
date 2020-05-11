const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const workqueue = require('../models').WorkQueue;
router.get('/view', function (req, res, next) {
    res.render('workQueue', {
        title: 'list of work queue',
        user: req.user
    });
});
// GET Route to manage any new work queue
router.get('/add', isAdmin, (req, res) => {
    res.render('addWorkQueue', {
        title: 'Add',
        user: req.user
    });
});

router.post('/add', isAdmin, (req, res) => {
    const newWork = {
        // engineername: req.body.name,
        task_name: req.body.task,
        task_date: req.body.Date,
        task_priority: req.body.priority
    };
    workqueue.create(newWork).then(result => {
        req.flash("success", "Added New Work Queue Successfully");
        res.redirect("/view");
    });

});

module.exports = router;