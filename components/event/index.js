const express = require('express');
const ctrl = require('./controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

const router = express.Router();

router.route('/')
  .get(ctrl.list);
router.get('/today', isAuthenticated, ctrl.listTodayEvents);
router.route('/:id')
  .all(isAuthenticated)
  .get(ctrl.read)
  .put(ctrl.update)
  .delete(ctrl.remove);
router.post('/', isAuthenticated, ctrl.create);

module.exports = router;
