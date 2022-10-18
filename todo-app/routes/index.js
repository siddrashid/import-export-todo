// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <IndexRouterSnippet>
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let params = {
    active: { home: true }
  };
  // console.log(req.app.locals.users[req.session.userId]);
  res.render('home.ejs', { params: params, user: req.app.locals.users[req.session.userId] });
});

module.exports = router;
// </IndexRouterSnippet>
