let url = 'https://crud-leutz-default-rtdb.firebaseio.com/'
let estaEditando = false;

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
                    html += montarLista(i[1], i[0]);
                })
                listaDeTarefasSalvas.innerHTML = html;
                }
            );
        }
    })    
};

function montarLista(tarefa, idBanco) {
    return  `<li id="${tarefa.createdDate}" class="list-group-item">
                ${tarefa.titulo}<br>
                ${tarefa.descricao}<br>
                <button onclick="editarTarefa('${tarefa.createdDate}', '${idBanco}')">Editar</button>
                <button onclick="deletarTarefa('${idBanco}')">Deletar</button>
            </li>`
};

function editarTarefa(createdDate, idBanco){
    if (!estaEditando) {        
    
    let liParaEditar = document.getElementById(createdDate);
    console.log(liParaEditar);
    const html = `<div>
         <div>
            <label>Editar título da tarefa</label><br>
            <input id="titulo" type="text" placeholder="Titulo da tarefa">
        </div>
        <div>
            <label>Editar descricao da tarefa</label><br>
            <textarea id="descricao" placeholder="Descrição da tarefa"></textarea>
        </div>
        <button onclick="salvarTarefa('${createdDate}', '${idBanco}')">Salvar Edição</button>
    </div>`

    liParaEditar.innerHTML = html;
    estaEditando=true;
    }
}

function salvarTarefa (createdDate, idBanco){
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    const tarefa = {
        titulo:titulo,
        descricao: descricao
    }
    
    fetch(url + `/tarefas/${idBanco}.json`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(tarefa)
        }
    ).then(response => {if (response.status == 200) {
        getLista()        
    }});

    estaEditando = false
}

function deletarTarefa(idBanco){
    console.log("DELETAR "+idBanco);

    const confirme = confirm("Tem certeza que deseja deletar essa tarefa?");

    if(confirme){
        
        fetch(url + `/tarefas/${idBanco}.json`, {
            method: 'DELETE'
            }).then(response => {
                    if (response.status == 200){getLista()}
                })
    };
}
