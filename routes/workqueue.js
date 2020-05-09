const express = require('express');
const router = express.Router();
router.get('/view', function (req, res, next) {
    res.render('workQueue', {
        title: 'list of work queue',
        user: req.user
    });
});
module.exports = router;