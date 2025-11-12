const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const categoryRoutes = require('./src/routes/categories');
const contaRoutes = require('./src/routes/contas');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/contas', contaRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema de Biblioteca',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /auth/login': 'Login (retorna token)',
      users: {
        'GET /users': 'Listar todos os usuários (admin only)',
        'GET /users/:id': 'Buscar usuário por ID (admin only)',
        'DELETE /users/:id': 'Deletar usuário (admin only)',
        'PATCH /users/:id/admin': 'Atualizar status de admin (admin only)'
      },
        'POST /auth/register': 'Registrar novo usuário'
      },
      categories: {
        'GET /categories': 'Listar todas as categorias (auth required)',
        'GET /categories/:id': 'Buscar categoria por ID (auth required)',
        'POST /categories': 'Criar categoria (admin only)',
        'PUT /categories/:id': 'Atualizar categoria (admin only)',
        'DELETE /categories/:id': 'Deletar categoria (admin only)'
      },
      contas: {
        'GET /contas': 'Listar todas as contas (auth required)',
        'GET /contas/:id': 'Buscar conta por ID (auth required)',
        'POST /contas': 'Criar conta (admin only)',
        'PUT /contas/:id': 'Atualizar conta (admin only)',
        'DELETE /contas/:id': 'Deletar conta (admin only)'
      },
    }
  });
});

app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` API Biblioteca disponível em: http://localhost:${PORT}`);
});
