'use strict'

const openModal = () => document.querySelector('#modal').classList.add('active')
const closeModal = () => {
    limpaCampos()
    document.querySelector('#modal').classList.remove('active')
}


const tempAssistir = {
    nome: "300",
    categoria: "Filme"
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_assistir')) ?? []
const setLocalStorage = (dbAssistir) => localStorage.setItem("db_assistir", JSON.stringify(dbAssistir))

//create
const criar = (obra) => {
    const dbAssistir = getLocalStorage()
    dbAssistir.push(obra)
    setLocalStorage(dbAssistir)
}

//read
const ler = () => getLocalStorage()

//update
const atualizar = (indice, obra) => {
    const dbAssistir = ler()
    dbAssistir[indice] = obra
    setLocalStorage(dbAssistir)
}

//delete
const deletar = (indice) => {
    const dbAssistir = ler()
    dbAssistir.splice(indice,1)
    setLocalStorage(dbAssistir)
}

const salvar = () => {
    if(camposValidos()) {
        const obra = {
            nome: document.querySelector("#nome").value,
            categoria: document.querySelector("#categoria").value
        }
        const indice = document.querySelector('#nome').dataset.indice
        if(indice === 'new') {
            criar(obra)
            atualizaTabela()
            closeModal()
        } else {
            atualizar(indice,obra)
            atualizaTabela()
            closeModal()
        }
    }
}

const limpaCampos = () => {
    const campos = document.querySelectorAll('.modal-field')
    campos.forEach(campo => campo.value = '')
    
}
const camposValidos = () => {
    return document.querySelector('#form').reportValidity()
}

const criaLinha = (obra, indice) => {
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = 
                    `
                    <td>${obra.nome}</td>
                    <td>${obra.categoria}</td>
                    <td>
                        <button type="button" class="button green material-symbols-outlined" id="editar-${indice}">edit</button>
                        <button type="button" class="button red material-symbols-outlined" id="excluir-${indice}">delete</button>
                    </td>
                    `
    document.querySelector("#tabela > tbody").appendChild(novaLinha)
}

const limpaTabela = () => {
    const linhas = document.querySelectorAll("#tabela > tbody tr")
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

const atualizaTabela = () => {
    limpaTabela()
    const dbAssistir = ler()
    dbAssistir.forEach(criaLinha)
}

const preencheCampos = (obra) => {
    document.querySelector("#nome").value = obra.nome
    document.querySelector("#categoria").value = obra.categoria
    document.querySelector("#nome").dataset.indice = obra.indice

}
const editaObra = (indice) => {
    const obra = ler()[indice]
    obra.indice = indice
    preencheCampos(obra)
    openModal()
}

const editaOuExclui = (e) => {
    if(e.target.type == 'button'){
        const [action,indice] = e.target.id.split('-')
        if(action == 'editar') {
            editaObra(indice)
        } else {
            const obra = ler()[indice]
            const confirma = confirm(`Deseja realmente excluir ${obra.nome}?`)
            if(confirma) {
                deletar(indice)        
                atualizaTabela()
            } 
          
        }
    }
}


atualizaTabela()

document.querySelector('#addObra').addEventListener('click', openModal)
document.querySelector('#modalClose').addEventListener('click',closeModal)

document.querySelector("#salvar").addEventListener('click',salvar)
document.querySelector("#cancelar").addEventListener('click',closeModal)
document.querySelector("#tabela > tbody").addEventListener('click',editaOuExclui)


