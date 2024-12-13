// Falso banco de dados de clientes, em memória RAM
var clientes = [];
var academias = [];
var estilos = [];

// Guarda o cliente que está sendo alterado
var clienteAlterado = null;

function mostrarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
}

function ocultarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

function adicionar() {
    clienteAlterado = null; // Marca que está adicionando um cliente
    limparFormulario();
    mostrarModal();
}

function alterar(cpf) {
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];
        if (cliente.cpf == cpf) {
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("peso").value = cliente.peso;
            document.getElementById("altura").value = cliente.altura;
            document.getElementById("dataNascimento").value = cliente.dataNascimento;
            document.getElementById("sapato").value = cliente.sapato;
            document.getElementById("academia").value = cliente.gym.id;
            document.getElementById("estilo").value = cliente.style.id;
            clienteAlterado = cliente; // Guarda o cliente que está sendo alterado
            mostrarModal();
        }
    }
}

async function excluir(cpf) {
    if (confirm("Deseja realmente excluir este body builder?")) {
        try {
            await fetch('http://localhost:3000/body-builder/' + cpf, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors'
            });
            alert("Excluído com sucesso");
            await carregarClientes();
        } catch (error) {
            alert("Erro ao excluir");
        }
    }
}

async function salvarStyle() {
    let style = document.getElementById('style').value;

    let newStyle = {
        id: Date.now(),
        nome: style
    };

    try {
        await fetch("http://localhost:3000/stylePost", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(newStyle)
        });
        alert("Style cadastrado com sucesso");
        await carregarEstilos();
    } catch (error) {
        alert('Ocorreu um erro');
    }

    limparFormularioStyle();

    return false;
}

async function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let peso = document.getElementById("peso").value;
    let altura = document.getElementById("altura").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let sapato = document.getElementById("sapato").value;
    let idAcademia = document.getElementById("academia").value;
    let idEstilo = document.getElementById("estilo").value;

    let novoBodyBuilder = {
        nome: nome,
        cpf: cpf,
        peso: peso,
        altura: altura,
        dataNascimento: dataNascimento,
        sapato: sapato,
        idAcademia: idAcademia,
        idEstilo: idEstilo
    };

    try {
        if (clienteAlterado == null) {
            // Adicionar novo cliente
            await fetch('http://localhost:3000/body-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                body: JSON.stringify(novoBodyBuilder)
            });
            alert("Cadastrado com sucesso");
        } else {
            // Alterar cliente existente
            await fetch('http://localhost:3000/body-builder/' + clienteAlterado.cpf, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                body: JSON.stringify(novoBodyBuilder)
            });
            alert("Alterado com sucesso");
        }

        ocultarModal();
        limparFormulario();
        await carregarClientes();
    } catch (error) {
        alert(clienteAlterado ? "Erro ao alterar" : "Erro ao cadastrar");
    }

    return false;
}

function limparFormulario() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("altura").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("sapato").value = "";
}

function limparFormularioStyle() {
    document.getElementById("style").value = "";
}

function atualizarLista() {
    let tbody = document.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Limpa as linhas da tabela
    for (let cliente of clientes) {
        let linhaTabela = document.createElement("tr");
        linhaTabela.innerHTML = `
            <td>${cliente.gym.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.peso}kg</td>
            <td>${cliente.altura}m</td>
            <td>${cliente.dataNascimento}</td>
            <td>${cliente.sapato}</td>
            <td>${cliente.style.nome}</td>
            <td>
                <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                <button onclick="excluir('${cliente.cpf}')">Excluir</button>
            </td>`;
        tbody.appendChild(linhaTabela);
    }
}

async function carregarClientes() {
    let busca = document.getElementById("busca").value;
    try {
        let response = await fetch('http://localhost:3000/body-builder?busca=' + busca, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        clientes = await response.json();
        atualizarLista();
    } catch (error) {
        alert("Erro ao listar clientes");
    }
}

async function carregarAcademias() {
    try {
        let response = await fetch('http://localhost:3000/gym', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        academias = await response.json();
        atualizarListaAcademias();
    } catch (error) {
        alert("Erro ao listar academias");
    }
}

function atualizarListaAcademias() {
    let listaAcademia = document.getElementById("academia");
    for (let academia of academias) {
        let option = document.createElement("option");
        option.value = academia.id;
        option.innerHTML = academia.nome;
        listaAcademia.appendChild(option);
    }
}

async function carregarEstilos() {
    try {
        let response = await fetch('http://localhost:3000/style', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        estilos = await response.json();
        atualizarListaEstilos();
    } catch (error) {
        alert("Erro ao listar estilos");
    }
}

function atualizarListaEstilos() {
    let listaEstilo = document.getElementById("estilo");
    for (let estilo of estilos) {
        let option = document.createElement("option");
        option.value = estilo.id;
        option.innerHTML = estilo.nome;
        listaEstilo.appendChild(option);
    }
}
