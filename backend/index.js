require("dotenv-safe").config();
const jwt     = require('jsonwebtoken');
const express = require('express'); 
const app     = express(); 
const port    = process.env.PORT
const db      = require("db");


app.use(express.json());
 
app.get('/', (req, res, next) => {
    res.json({message: "Ok!"});
})
 
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'macedo' && req.body.password === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });

      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})
 
app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

app.post('/register', function(req, res) {
    res.json({ auth: false, token: null });
})

function verifyJWT(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'Usuario não identificado.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Falha na autenticação.' });
      
      req.userId = decoded.id;
      next();
    });
}

app.get('/list', verifyJWT, async (req, res, next) => { 
    
    let eventos = await db.findAllEvents()
    console.log(eventos);
    res.json(eventos);
})

app.post('/insert', verifyJWT, async (req, res, next) => { 
    try {

        const nome   = req.nome;
        const result = await db.insert({ nome });
        console.log(result);
        res.redirect('/list');
      } catch (err) {
        next(err);
      }
})

app.post('/update/:id', verifyJWT, async(req, res, next) => { 
    const id = req.id;
    const nome = req.nome;
    try {
        const result = await db.update(id, { nome });
        console.log(result);
        res.redirect('/list');
      } catch (err) {
        next(err);
      }
    // res.json([{id:1, nome:'Evento musical'}]);
})
  
app.post('/delete/:id', verifyJWT, async (req, res, next) => { 
    const id = req.params.id;

  try {
    const result = await db.deleteOne(id);
    console.log(result);
    res.redirect('/list');
  } catch (err) {
    next(err);
  }
})

app.listen(port, () => console.log(`Servidor escutando na porta ${port}...`));