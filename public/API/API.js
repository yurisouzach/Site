const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..'))); 

const pool = new Pool({
  user: 'postgres',
  host: 'caboose.proxy.rlwy.net',
  database: 'railway',
  password: 'lripdNbNBjuqfsTWUqsONSNqHFlDqyzs',
  port: 39410,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/getConvidado', async (req, res) => {
  try {
    const { nome } = req.query;
    const result = await pool.query(
      'SELECT * FROM convidados WHERE "nome" = $1',
      [nome]
    );

    res.json({
      sucesso: true,
      hasData: result.rows.length > 0,
      data: result.rows,
      count: result.rowCount,
    });
  }
  catch (err) {
    res.status(500).json({
        sucesso: false,
        error: err.message
      });
    console.log(err);
  }
})

app.get('/dadosDev', async (req, res) => {
  try {
    const result = await pool.query('select * from senhadev');
    if (result.rows.length > 0) {
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
        });
    }
    else {
      res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
        });
    }
    } catch (err) {
      res.status(500).json({
        sucesso: false,
        error: err.message
      });
      console.log(err);
    } 
});

app.put('/SalvarSenha', async (req, res) => {
  try {
    const { senha } = req.query;
    const result = await pool.query('INSERT INTO public.senhadev(senha) VALUES ($1)', [senha]);
    res.json({
      sucesso: true,
      hasData: result.rows.length > 0,
      data: result.rows,
      count: result.rowCount,
      senha: senha
    });
  }
  catch (e) {
    res.status(500).json({
        sucesso: false,
        error: e.message
      });
    console.log(e);
  }
});

app.put('/ConfirmaConvidado', async (req, res) => {
  try {
    const { Nome } = req.query;
    const result = await pool.query('update convidados set confirmado = true where "nome" = $1', [Nome])
    res.json({
      sucesso: true,
      hasData: result.rows.length > 0,
      data: result.rows,
      count: result.rowCount,
      nome: Nome
    })
  }
  catch (e) {
    res.status(500).json({
        sucesso: false,
        error: e.message
      });
    console.log(e);
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
