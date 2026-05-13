import './style.css';
import { supabase } from './supabase.js';

const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');
const btnAcessar = document.getElementById('acessar');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  btnAcessar.disabled = true;
  btnAcessar.innerHTML = `<span class="spinner"></span>Aguarde...`;
  messageDiv.classList.add('hidden');

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    btnAcessar.disabled = false;
    btnAcessar.innerHTML = 'Entrar';
    messageDiv.innerText = `Erro: ${error.message}`;
    messageDiv.classList.remove('hidden');
    return;
  }

  window.location.assign('./menu.html');
});
