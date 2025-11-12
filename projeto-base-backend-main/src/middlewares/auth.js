// middlewares/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        console.log('Token recebido:', token ? 'Presente' : 'Ausente');
        
        if (!token) {
            console.log('Token não fornecido');
            return res.status(401).json({ error: 'Token de acesso requerido' });
        }

        // Verifica o token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_aqui');
        console.log('Token decodificado:', decoded);
        
        // Adiciona os dados do usuário no request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            isAdmin: decoded.isAdmin
        };
        
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expirado' });
        } else {
            return res.status(403).json({ error: 'Falha na autenticação' });
        }
    }
};

module.exports = authMiddleware;