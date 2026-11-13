let url = 'https://crud-leutz-default-rtdb.firebaseio.com/'
let estaEditando = false;

function criarTarefa() {
    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let mensagem = document.getElementById("mensagem");


    console.log(titulo);
    console.log(descricao);

    if (titulo == "") {
        mensagem.innerHTML="Insira ao menos o título da tarefa";
        mensagem.style.display='block';

    } else {
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
                mensagem.innerHTML="Salvo com sucesso";
                mensagem.style.display='block';
            } else {mensagem.innerHTML="Erro ao salvar"; mensagem.style.display='block'}
        });    
        } catch (error) {console.log(error);mensagem.innerHTML=error;}   
    }
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

// aqui utilizei os icones bootstrap para "Editar" e "Excluir"
function montarLista(tarefa, idBanco) {
    return  `<li id="${tarefa.createdDate}" class="list-group-item">
                
                <h4 class="TituloTarefa">${tarefa.titulo}</h4>
                <small class="DescricaoTarefa">${tarefa.descricao}</small><br>

                <button class="btn" onclick="editarTarefa('${tarefa.createdDate}', '${idBanco}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg></button>

                <button class="btn" onclick="deletarTarefa('${idBanco}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg></button>
            </li>`
};

function editarTarefa(createdDate, idBanco){
    if (!estaEditando) {        
    
    let liParaEditar = document.getElementById(createdDate);
    console.log(liParaEditar);
    const html = `<div class="MenuEdicao">
         <div>
            <label>Editar título da tarefa</label><br>
            <input id="titulo" type="text" placeholder="Novo título da tarefa" class="tituloTarefa">
        </div>
        <div>
            <label>Editar descricao da tarefa</label><br>
            <textarea id="descricao" placeholder="Nova descrição da tarefa" class="descricaoTarefa"></textarea>
        </div>
        <button onclick="salvarTarefa('${createdDate}', '${idBanco}')" class="btn">Salvar Edição</button>
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