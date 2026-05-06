import './style.css';
import {supabase} from './supabase.js'
//elementos do form
const loginForm = document.getElementById('login-form')
const messageDiv = document.getElementById('message')
const btnAcessar = document.getElementById('acessar')

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault() //evita recarregar
    //campos do formulário
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    btnAcessar.disabled = true //desabilita o botão
    btnAcessar.innerHTML = `<span class='spinner'></span> Aguarde...`

    //fazendo o login no supabase
    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if(error){ //deu erro?
        btnAcessar.disabled = false //permite o click
        btnAcessar.innerHTML = 'Acessar o sistema'
    messageDiv.innerText = `Erro: ${error.message}`    
    messageDiv.classList.remove('hidden')//mostramos na tela
    } else{
        window.location.assign('./menu.html')//carregamos menu
    }
})