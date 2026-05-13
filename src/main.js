import './style.css';
import { supabase } from './supabase.js'

const loginForm = document.getElementById('login-form')
const messageDiv = document.getElementById('message')
const btnAcessar = document.getElementById('acessar')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault() //evita recarregar

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    btnAcessar.disabled = true //desabilita o botao para clicar apenas 1 vez
    btnAcessar.innerHTML= `<span class='spinner'></span>Aguarde...`

    //login no supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        btnAcessar.disabled = false;
        btnAcessar.innerHTML = 'Entrar'
        messageDiv.innerText = `Erro: ${error.message}`
        messageDiv.classList.remove('hidden') //mostra na tela
    } else {
        window.location.assign('./menu.html') //carregamos menu
    }
})