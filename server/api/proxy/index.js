'use strict';

var express = require('express');
var controller = require('./proxy.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(),  controller.show);
router.get('/:id/start', auth.isAuthenticated(), controller.start);
router.get('/:id/stop', auth.isAuthenticated(),  controller.stop);
router.post('/', controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;