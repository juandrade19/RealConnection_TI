const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

db.authenticate()
  .then(() => console.log('Conexão com o banco de dados bem-sucedida'))
  .catch(err => console.error('Erro ao conectar com o banco:', err));

db.sync({ alter: true })
  .then(() => console.log('Modelos sincronizados com o banco de dados'))
  .catch(err => console.error('Erro ao sincronizar modelos:', err));

app.get('/', (req, res) => {
  res.send('🚀 API Real Connection está rodando!');
});


const usuarioRoutes = require('./src/routes/UsuarioRoutes');
const dependenteRoutes = require('./src/routes/DependenteRoutes');
const atividadeRoutes = require('./src/routes/AtividadeRoutes');
const progressoRoutes = require('./src/routes/ProgressoRoutes');
const premioRoutes = require('./src/routes/PremioRoutes');
const resgateRoutes = require('./src/routes/ResgateRoutes');
const postsRoutes = require('./src/routes/postsRoutes'); 

app.use('/usuarios', usuarioRoutes);
app.use('/dependentes', dependenteRoutes);
app.use('/atividades', atividadeRoutes);
app.use('/progresso', progressoRoutes);
app.use('/premios', premioRoutes);
app.use('/resgates', resgateRoutes);
app.use('/posts', postsRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
