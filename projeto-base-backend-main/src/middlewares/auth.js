const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Token de autenticação necessário' });
    }

    const token = authHeader.substring(6);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    if (!username || !password) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // BUSCAR TODOS os usuários e fazer match manual
    const allUsers = await prisma.user.findMany();
    console.log('👥 Todos os usuários no banco:', allUsers.map(u => u.username));

    const user = allUsers.find(u => 
      u.username.toLowerCase() === username.trim().toLowerCase()
    );

    console.log('🎯 Usuário encontrado:', user);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = authMiddleware;