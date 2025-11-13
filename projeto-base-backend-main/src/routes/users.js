const express = require('express');
const userController = require('../controller/user');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const router = express.Router();

// Rotas públicas
router.post('/register', userController.register);

// Rotas que requerem apenas autenticação
router.get('/me', authMiddleware, (req, res, next) => {
  userController.getMyProfile(req, res).catch(next);
});

router.put('/me', authMiddleware, (req, res, next) => {
  userController.updateMyProfile(req, res).catch(next);
});

// Rotas que requerem admin
router.get('/', authMiddleware, adminMiddleware, (req, res, next) => {
  userController.getUsers(req, res).catch(next);
});

router.get('/:id', authMiddleware, adminMiddleware, (req, res, next) => {
  userController.getUserById(req, res).catch(next);
});

router.delete('/:id', authMiddleware, adminMiddleware, (req, res, next) => {
  userController.deleteUser(req, res).catch(next);
});

router.patch('/:id/admin', authMiddleware, adminMiddleware, (req, res, next) => {
  userController.updateUserAdmin(req, res).catch(next);
});

module.exports = router;