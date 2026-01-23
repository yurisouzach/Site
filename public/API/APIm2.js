const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..'))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PJ',
    password: 'pj123!',
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro de conexão:', err);
  } else {
    console.log('Conexão bem-sucedida! Hora do servidor:', res.rows[0].now);
  }
});

const marriageContext = async (req, res, next) => {
  try {
    const host = req.hostname;
    let marriage = null;

    if (host.endsWith('uniluv.com') || host.endsWith('uniluv.local')) {
      const subdomain = host.split('.')[0];

      const result = await pool.query(
        'SELECT * FROM marry WHERE name = $1',
        [subdomain]
      );

      marriage = result.rows[0];
    } else {
      const result = await pool.query(
        'SELECT * FROM marry WHERE name = $1',
        [host]
      );

      marriage = result.rows[0];
    }

    if (!marriage) {
      return res.status(404).json({ error: 'Casamento não encontrado', host: host });
    }

    req.marriage = marriage;
    next();
  } catch (err) {
    next(err);
  }
};

app.use(marriageContext);

app.get('/context', (req, res) => {
  res.json({
    id: req.marriage.id,
    marryDate: req.marriage.marrydate,
    palette: req.marriage.palette,
    name: req.marriage.name
  });
});

app.get('/getMarry', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM marry where id = $1`, [req.marriage.id]
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

app.put('/updatePassword', async (req, res) => {
    try {
        const { marry } = req.body;
        const result = await pool.query("update marry set password = $1 where id = $2 RETURNING *",
             [marry.password, marry.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getGuest', async (req, res) => {
    try {
        const { nome } = req.query;
        const result = await pool.query(
        `SELECT * FROM guest WHERE name ILIKE $1 || '%' OR name ILIKE '% ' || $1 || '%' and marryid = $2`,
        [nome, req.marriage.id]
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

app.put('/confGuest', async (req, res) => {
    try {
        const { guest } = req.body;
        const result = await pool.query("update guest set confirmed = $2 where id = $1 and marryid = $3", [guest.id, guest.confirmed, req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getGuests', async (req, res) => {
    try {
        const result = await pool.query("select * from guest where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getGifts', async (req, res) => {
    try {
        const result = await pool.query("select * from gift where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getChecks', async (req, res) => {
    try {
        const result = await pool.query("select * from checklist where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getSugestions', async (req, res) => {
    try {
        const result = await pool.query("select * from sugestion")
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.put('/updateGuest', async (req,res) => {
    try {
        const { guest } = req.body;
        const result = await pool.query("update guest set name = $1, confirmed = $2, phone = $3, description = $4 where id = $5 RETURNING *",
             [guest.name, guest.confirmed, guest.phone, guest.description, guest.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.post('/saveGuest', async (req,res) => {
    try {
        const { guest } = req.body;
        const result = await pool.query("insert into guest (name, confirmed, phone, description, marryid) values ( $1, $2, $3, $4, $5)",
             [guest.name, guest.confirmed, guest.phone, guest.description, req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.delete('/deleteGuest/:id', async (req, res) => {
    const { id } = req.params;
    try {

        
        await pool.query(
            'DELETE FROM guest WHERE id = $1',
            [id]
        );
        
        res.json({ sucesso: true });
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            id: id
        });
    }
});

app.put('/updateCheck', async (req,res) => {
    try {
        const { check } = req.body;
        const result = await pool.query("update checklist set title = $1, description = $2, duedate = $3, done = $4 where id = $5 RETURNING *",
             [check.title, check.description, check.duedate, check.done, check.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.post('/saveCheck', async (req,res) => {
    try {
        const { check } = req.body;
        const result = await pool.query("insert into checklist (title, description, duedate, done, marryid) values ($1, $2, $3, $4, $5)",
             [check.title, check.description, check.duedate, check.done, req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
        })
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            req: req.body
        });
        console.log(e);
    }
})

app.delete('/deleteCheck/:id', async (req, res) => {
    const { id } = req.params;
    try {

        
        await pool.query(
            'DELETE FROM checklist WHERE id = $1',
            [id]
        );
        
        res.json({ sucesso: true });
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            id: id
        });
    }
});

// Configurar Cloudinary
cloudinary.config({
  cloud_name: "dzektgzce",
  api_key: "494555796364749",
  api_secret: "s-5ee1br-QLccyEpik_VnzzelmM"
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'casamento_presentes',
    format: async (req, file) => 'png', // ou jpg, webp
    public_id: (req, file) => {
      return Date.now() + '-' + Math.round(Math.random() * 1E9);
    }
  }
});

const upload = multer({ storage: storage });

app.put('/updateGift', upload.single('image'), async (req,res) => {
    try {
        const { id, name, giftcategory, reservedby, price } = req.body

        let imagePath = null

        if (req.file) {
            imagePath = req.file.path
        }

        let query
        let values
        if (reservedby === "null" || reservedby === "undefined") {
            if (imagePath) {
                query = `
                    UPDATE gift
                    SET name = $1,
                    giftcategory = $2,
                    price = $3,
                    imagefile = $4
                    WHERE id = $5
                    `
                values = [name, giftcategory, price, imagePath, id]
            } else {
                query = `
                    UPDATE gift
                    SET name = $1,
                    giftcategory = $2,
                    price = $3
                    WHERE id = $4
                    ` 
                values = [name, giftcategory, price, id]
            }
        }
        else {
            query = `
                    UPDATE gift
                    SET reservedby = $1
                    WHERE id = $2
                    ` 
                values = [reservedby, id]
        }
        
        await pool.query(query, values)
        res.json({
            sucesso: true,
            req: req.body
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

app.post('/saveGift', upload.single('image'), async (req,res) => {
    try {
        const { name, giftcategory, price } = req.body

        var imagePath = req.file ? req.file.path : null

        if (req.file)
            imagePath = req.file.path;

        const result = await pool.query("insert into gift (name, giftcategory, price, imagefile, marryid) values ($1, $2, $3, $4, $5)",
             [name, giftcategory, price, imagePath, req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
        })
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            req: req.body
        });
        console.log(e);
    }
})

app.delete('/deleteGift/:id', async (req, res) => {
    const { id } = req.params;
    try {

        
        await pool.query(
            'DELETE FROM gift WHERE id = $1',
            [id]
        );
        
        res.json({ sucesso: true });
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            id: id
        });
    }
});

app.get('/getGuestView', async (req,res) => {
    try {
        const result = await pool.query("select * from guestview where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getWarnings', async (req, res) => {
    try {
        const result = await pool.query("select * from warninggv where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getInfs', async (req, res) => {
    try {
        const result = await pool.query("select * from informationgv where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.get('/getEnder', async (req, res) => {
    try {
        const result = await pool.query("select * from endergv where marryid = $1", [req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.put('/updateGuestView', async (req, res) => {
    try {
        const { guestView } = req.body;
        const result = await pool.query("update guestview set saudation = $1, subtitle = $2, welcome = $3, deadline = $4, showwarning = $5, showinformation = $6 where id = $7 RETURNING *",
             [guestView.saudation, guestView.subtitle, guestView.welcome, guestView.deadline, guestView.showwarning, guestView.showinformation, guestView.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.put('/updateWarning', async (req, res) => {
    try {
        const { warning } = req.body;
        const result = await pool.query("update warninggv set description = $1 where id = $2",
             [warning.description, warning.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.put('/updateInf', async (req, res) => {
    try {
        const { inf } = req.body;
        const result = await pool.query("update informationgv set description = $1 where id = $2",
             [inf.description, inf.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.put('/updateEnder', async (req, res) => {
    try {
        const { ender } = req.body;
        const result = await pool.query("update endergv set ender = $1 where id = $2",
             [ender.ender, ender.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.post('/insertWarning', async (req, res) => {
    try {
        const { warning } = req.body
        const result = await pool.query("insert into warninggv (description, guestviewid, marryid) values ($1, $2, $3)", [warning.description, warning.guestViewId, req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.post('/insertInf', async (req, res) => {
    try {
        const { inf } = req.body
        const result = await pool.query("insert into informationgv (description, guestviewid, marryid) values ($1, $2, $3)", [inf.description, inf.guestViewId, req.marriage.id])
        res.json({
            sucesso: true,
            hasData: result.rows.length > 0,
            data: result.rows,
            count: result.rowCount,
            req: req.body
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

app.delete('/deleteWarning/:id', async (req, res) => {
    const { id } = req.params;
    try {

        await pool.query(
            'DELETE FROM warninggv WHERE id = $1',
            [id]
        );
        
        res.json({ sucesso: true });
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            id: id
        });
    }
});

app.delete('/deleteInf/:id', async (req, res) => {
    const { id } = req.params;
    try {

        await pool.query(
            'DELETE FROM informationgv WHERE id = $1',
            [id]
        );
        
        res.json({ sucesso: true });
    }
    catch (e) {
        res.status(500).json({
            sucesso: false,
            error: e.message,
            id: id
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});