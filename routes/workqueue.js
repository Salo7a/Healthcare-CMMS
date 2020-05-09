const express = require('express');
const router = express.Router();
router.get('/view', function (req, res, next) {
    res.render('workQueue', {
        title: 'list of work queue'
    });
});
module.exports = router;