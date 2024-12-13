const express = require('express')
const cors = require('cors')
const BodyBuilder = require('./src/bodybuilder/bodybuilder.entity')
const app = express()
app.use(cors())
const port = 3000
app.use(express.json())

//banco de dados de clientes
var clientes = []

var academias = [
  { id: 1, nome: "Academia 1", telefone: "123456789" },
  { id: 2, nome: "Academia 2", telefone: "987654321" }
]

var estilos = [
  { id: 1, nome: "Chassi de grilo" },
  { id: 2, nome: "Capa do batman" }
]

app.post('/body-builder', (req, res) => {
    const data = req.body //receber o bodyBuilder, que é um objeto JSON que vem do front-end

    const idAcademia = data.idAcademia
    const gym = academias.find((academia) => academia.id == idAcademia)
    const idEstilo = data.idEstilo
    const estilo = estilos.find((estilo) => estilo.id == idEstilo)

    let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.sapato, gym, estilo)
    // gym.bodyBuilders.push(bodyBuilder)

    clientes.push(bodyBuilder) //adicionar o bodyBuiler no banco de dados
    res.send("Cadastrou")
})

app.put('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for(let i=0; i < clientes.length; i++){
    let cliente = clientes[i]
    if (cliente.cpf == cpf){
      const data = req.body

      const idAcademia = data.idAcademia
      const gym = academias.find((academia) => academia.id == idAcademia)

      const idEstilo = data.idEstilo
      const estilo = estilos.find((estilo) => estilo.id == idEstilo)

      let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.sapato, gym, estilo)
      clientes[i] = bodyBuilder
      //substitui o bodyBuilder pelos dados enviados no body
      res.send("Atualizou")
    }
  }
  throw new Error("Body builder nao encontrado")
})

app.delete('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for(let i = 0; i < clientes.length; i++){
      let cliente = clientes[i]
      if (cliente.cpf == cpf){
          clientes.splice(i, 1)
          res.send("Deletou")        
      }
  }
  throw new Error("Cliente nao encontrado")
})

app.get('/body-builder', (req, res) => {
  let busca = req.query.busca
  let clientesFiltrados
  if (busca){ //se a busca for diferente de vazio
    clientesFiltrados = clientes.filter((cliente) => {
      return cliente.nome.toLowerCase().includes(busca.toLowerCase())
      || cliente.cpf.toLowerCase().includes(busca.toLowerCase())
    })
  }else{
    clientesFiltrados = clientes
  }
  res.json(clientesFiltrados)
})

app.get("/gym", (req, res) => {
  res.json(academias)
})

app.get("/style", (req, res) => {
  res.json(estilos)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})