const express = require('express'); 
const app = express(); 
 
app.use(express.json());
 
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})
 
app.get('/login', (req, res, next) => { 
    console.log("Retornou todos clientes!");
    res.json([{id:1,nome:'luiz'}]);
}) 
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));