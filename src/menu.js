import './style.css';
import { supabase } from './supabase.js';

const botaoLogout = document.getElementById('btn-logout');

botaoLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.assign('./index.html');
});

async function validaSessao() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    window.location.assign('./index.html');
  }
}

validaSessao();
