require("dotenv-safe").config();
const jwt     = require('jsonwebtoken');
const express = require('express'); 
const app     = express(); 
const port    = process.env.PORT

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

app.get('/list', verifyJWT, (req, res, next) => { 
    console.log("Retornou todos eventos!");
    res.json([{id:1, nome:'Evento musical'}]);
})

app.post('/save', verifyJWT, (req, res, next) => { 
  console.log("Retornou todos eventos!");
  res.json([{id:1, nome:'Evento musical'}]);
})

app.post('/delete', verifyJWT, (req, res, next) => { 
    console.log("Retornou todos eventos!");
    res.json([{id:1, nome:'Evento musical'}]);
})

app.listen(port, () => console.log(`Servidor escutando na porta ${port}...`));