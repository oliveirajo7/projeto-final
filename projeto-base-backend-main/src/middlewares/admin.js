const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }

    console.log('✓ Acesso admin autorizado para:', req.user.username);
    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = adminMiddleware;