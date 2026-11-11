let url = 'https://crud-leutz-default-rtdb.firebaseio.com/'

function criarTarefa() {
    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let mensagem = document.getElementById("mensagem");


    console.log(titulo);
    console.log(descricao);

    const tarefa = {
        createdDate: new Date().toISOString(),
        titulo:titulo,
        descricao: descricao
    }

    try {
    fetch(url + "/tarefas.json", {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(tarefa)
    }).then(response => {
        if (response.status==200) {
            mensagem.innerHTML="Salvo com sucesso"
        } else {mensagem.innerHTML="Erro ao salvar"}
    });    
    } catch (error) {console.log(error);mensagem.innerHTML=error;}   
};

function getLista() {
    let html = '';
    let listaDeTarefasSalvas = document.getElementById("listaDeTarefasSalvas");
    fetch(url + "/tarefas.json").then(response => {
        if (response.status==200) {
            response.json().then( dados => {
                let arrayListaTarefas = Object.entries(dados);
                arrayListaTarefas.forEach( i => {
                    html += montarLista(i[1]);
                })
                listaDeTarefasSalvas.innerHTML = html;
                }
            );
        }
    })    
};

function montarLista(tarefa) {
    return  `<li>
                ${tarefa.titulo}<br>
                ${tarefa.descricao}
                <button onclick="editarTarefa('${tarefa.createdDate}')">Editar</button>
                <button onclick="deletarTarefa('${tarefa.createdDate}')">Deletar</button>
            </li>`
};

function editarTarefa(createdDate){console.log("Editar " + createdDate);
}

function deletarTarefa(createdDate){console.log("Deletar " + createdDate);
}