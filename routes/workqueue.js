const express = require('express');
const router = express.Router();
router.get('/portal/workqueue', function (req, res, next) {
    res.render('workQueue', {
        title: 'list of work queue'
    });
});
module.exports = router;