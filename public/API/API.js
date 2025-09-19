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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use(cors());

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

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'Casamento',
//   password: '123',
//   port: 5432,
// });

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro de conexão:', err);
  } else {
    console.log('Conexão bem-sucedida! Hora do servidor:', res.rows[0].now);
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

app.post('/SalvarSenha', async (req, res) => {
  const { senha } = req.query;
  let queryresult = ""
  try {
    queryresult = "vai salvar agora";
    const result = await pool.query('INSERT INTO public.senhadev(senha) VALUES ($1)', [senha]);
    queryresult = result;
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
        error: e.message,
        senha: senha,
        log: queryresult
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

//inicio api presente

app.get('/ObterPresentes', async (req, res) => {
  try {
    const consulta = await pool.query(`
      SELECT * FROM public.presentes
      ORDER BY 
        CASE WHEN "ValorPresente" = 0 THEN 1 ELSE 0 END,
        "ValorPresente" ASC,
        "NomePresente" ASC
    `);
    res.json({
      sucesso: true,
      hasData: consulta.rowCount > 0,
      data: consulta.rows,
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

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'Images', 'presentes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

app.post('/SalvarPresente', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, descricao, valor } = req.body;
    let nomeParam = nome;
    let descParam = descricao;
    let valorParam = valor;
    let imagemPath = null;
    if (req.file) {
      imagemPath = 'public/Images/presentes/' + req.file.filename;
    }

    const insert = await pool.query(
      `INSERT INTO public.presentes
       ("NomePresente", "DescPresente", "ValorPresente", "Imagem") 
       VALUES ($1, $2, $3, $4) RETURNING *`, 
      [nome, descricao, parseFloat(valor), imagemPath]
    );

    res.json({
      sucesso: true,
      hasData: insert.rowCount > 0,
      data: insert.rows,
      nome: nomeParam,
      desc: descParam,
      valor: valorParam,
      imagem: imagemPath
    })
  }
  catch (e) {
    res.status(500).json({
      sucesso: false,
      error: e.message,
      detail: e.detail,
    });
    console.log(e);
  }
})

app.put('/DoarParte', async (req, res) => {
  let teste = null;
  try {
    let { valordoado, usuario, cdPresente } = req.query;
    const presenteValor = await pool.query(
      `SELECT "ValorPresente", "NomeConv"
       FROM public.presentes
       WHERE "cdPresente" = $1`,
      [cdPresente]
    );
    let presente = presenteValor.rows[0];
    let valorAtual = presente.ValorPresente;
    const novoValorRestante = valorAtual - valordoado;
    
    let novoUsuario = null
    if (presente.NomeConv != null) {
      novoUsuario = presente.NomeConv + "," + usuario;
    }

    teste = novoUsuario !== null ? novoUsuario : usuario;

    const updateResult = await pool.query(
      `UPDATE public.presentes
       SET "ValorPresente" = $1, 
           "NomeConv" = $2
       WHERE "cdPresente" = $3 
       RETURNING *`,
      [novoValorRestante, novoUsuario !== null ? novoUsuario : usuario, cdPresente]
    );

    const updateUsuarios = await pool.query(
      `UPDATE public.convidados
       SET "valordoado" = coalesce("valordoado" + $1, 0 + $1),
           "cdPresente" = $2
       WHERE "nome" = $3
       RETURNING *`,
       [valordoado, cdPresente, usuario]
    );

    res.json({
      sucesso: true,
      valorAntigo: valorAtual,
      valorNovo: novoValorRestante,
      updatePresente: updateResult,
      updateUsuarios: updateUsuarios,
    })
  }
  catch (e) {
    res.status(500).json({
      sucesso: false,
      log: teste,
      error: e.message,
    });
    console.log(e);
  }
})

app.put('/DoarTotal', async (req, res) => {
  try {
    let { valordoado, usuario, cdPresente } = req.query;

    const presenteValor = await pool.query(
      `SELECT "NomeConv"
       FROM public.presentes
       WHERE "cdPresente" = $1`,
      [cdPresente]
    );
    const presente = presenteValor.rows[0];

    let novoUsuario = null
    if (presente.NomeConv != null) {
      novoUsuario = presente.NomeConv + "," + usuario;
    }

    const updateResult = await pool.query(
      `UPDATE public.presentes
       SET "ValorPresente" = 0, 
           "NomeConv" = $1
       WHERE "cdPresente" = $2 
       RETURNING *`,
      [ novoUsuario !== null ? novoUsuario : usuario, cdPresente]
    );

    const updateUsuarios = await pool.query(
      `UPDATE public.convidados
       SET "valordoado" = coalesce("valordoado" + $1, 0 + $1),
           "cdPresente" = $2
       WHERE "nome" = $3
       RETURNING *`,
       [valordoado, cdPresente, usuario]
    );

    res.json({
      sucesso: true,
      updatePresente: updateResult,
      updateUsuarios: updateUsuarios
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