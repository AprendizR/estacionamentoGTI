import './style.css';
import { supabase } from './supabase.js';

const botaoLogout = document.getElementById('btn-logout');
const formModelo = document.getElementById('form-modelo');
const campoId = document.getElementById('modelo-id');
const campoMarca = document.getElementById('marca');
const campoDescricao = document.getElementById('descricao');
const tabela = document.getElementById('tabela-modelos');
const totalModelos = document.getElementById('total-modelos');
const mensagemForm = document.getElementById('mensagem-form');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoCancelar = document.getElementById('btn-cancelar');
const botaoRecarregar = document.getElementById('btn-recarregar');
const formTitulo = document.getElementById('form-titulo');
const formSubtitulo = document.getElementById('form-subtitulo');
const formModo = document.getElementById('form-modo');

let modelos = [];

const icones = {
  editar: `
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>`,
  excluir: `
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path stroke-linecap="round" stroke-linejoin="round" d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M14 11v6" />
    </svg>`,
};

botaoLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.assign('./index.html');
});

formModelo.addEventListener('submit', salvarModelo);
botaoCancelar.addEventListener('click', limparFormulario);
botaoRecarregar.addEventListener('click', carregarModelos);

tabela.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-action]');

  if (!botao) {
    return;
  }

  const id = botao.dataset.id;

  if (botao.dataset.action === 'editar') {
    prepararEdicao(id);
  }

  if (botao.dataset.action === 'excluir') {
    excluirModelo(id);
  }
});

async function validaSessao() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    window.location.assign('./index.html');
  }
}

function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function definirMensagem(texto = '', tipo = 'info') {
  const cores = {
    info: 'text-slate-500',
    sucesso: 'text-emerald-600',
    erro: 'text-red-600',
  };

  mensagemForm.className = `mt-4 min-h-5 text-sm font-medium ${cores[tipo]}`;
  mensagemForm.textContent = texto;
}

function definirCarregando(ativo, texto = 'Salvando...') {
  botaoSalvar.disabled = ativo;
  botaoSalvar.classList.toggle('cursor-not-allowed', ativo);
  botaoSalvar.classList.toggle('opacity-70', ativo);
  botaoSalvar.lastChild.textContent = ativo ? texto : 'Salvar';
}

function atualizarResumo() {
  const total = modelos.length;
  totalModelos.textContent = total === 1 ? '1 modelo cadastrado' : `${total} modelos cadastrados`;
}

function renderizarTabela() {
  atualizarResumo();

  if (modelos.length === 0) {
    tabela.innerHTML = `
      <tr>
        <td colspan="3" class="px-5 py-10 text-center">
          <div class="mx-auto flex max-w-sm flex-col items-center gap-2 text-slate-500">
            <div class="rounded-full bg-slate-100 p-3 text-slate-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13h18l-2-5H5Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13v5h14v-5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 18v2" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 18v2" />
              </svg>
            </div>
            <p class="font-medium text-slate-700">Nenhum modelo cadastrado</p>
            <p class="text-sm">Use o formulário ao lado para criar o primeiro registro.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tabela.innerHTML = modelos.map((modelo) => `
    <tr class="bg-white transition hover:bg-slate-50">
      <td class="px-5 py-4 font-medium text-slate-900">${escaparHtml(modelo.marca)}</td>
      <td class="px-5 py-4 text-slate-600">${escaparHtml(modelo.descricao)}</td>
      <td class="px-5 py-4">
        <div class="flex justify-end gap-2">
          <button type="button" data-action="editar" data-id="${modelo.id}" title="Editar modelo"
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200">
            ${icones.editar}
          </button>
          <button type="button" data-action="excluir" data-id="${modelo.id}" title="Excluir modelo"
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200">
            ${icones.excluir}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function limparFormulario() {
  formModelo.reset();
  campoId.value = '';
  formTitulo.textContent = 'Novo modelo';
  formSubtitulo.textContent = 'Informe a marca e o modelo do veículo.';
  formModo.textContent = 'Cadastro';
  formModo.className = 'rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700';
  botaoCancelar.classList.add('hidden');
  definirMensagem();
  campoMarca.focus();
}

function prepararEdicao(id) {
  const modelo = modelos.find((item) => String(item.id) === String(id));

  if (!modelo) {
    definirMensagem('Registro não encontrado para edição.', 'erro');
    return;
  }

  campoId.value = modelo.id;
  campoMarca.value = modelo.marca ?? '';
  campoDescricao.value = modelo.descricao ?? '';
  formTitulo.textContent = 'Alterar modelo';
  formSubtitulo.textContent = 'Revise os dados e salve a alteração.';
  formModo.textContent = 'Edição';
  formModo.className = 'rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700';
  botaoCancelar.classList.remove('hidden');
  definirMensagem('Editando registro selecionado.', 'info');
  campoMarca.focus();
}

async function carregarModelos() {
  totalModelos.textContent = 'Carregando modelos...';
  tabela.innerHTML = `
    <tr>
      <td colspan="3" class="px-5 py-8 text-center text-sm text-slate-500">Carregando registros...</td>
    </tr>`;

  const { data, error } = await supabase
    .from('modelos')
    .select('*')
    .order('marca', { ascending: true })
    .order('descricao', { ascending: true });

  if (error) {
    totalModelos.textContent = 'Não foi possível carregar os modelos';
    tabela.innerHTML = `
      <tr>
        <td colspan="3" class="px-5 py-8 text-center text-sm text-red-600">
          Erro ao carregar os modelos: ${escaparHtml(error.message)}
        </td>
      </tr>`;
    return;
  }

  modelos = data ?? [];
  renderizarTabela();
}

async function salvarModelo(event) {
  event.preventDefault();

  const id = campoId.value;
  const modelo = {
    marca: campoMarca.value.trim(),
    descricao: campoDescricao.value.trim(),
  };

  if (!modelo.marca || !modelo.descricao) {
    definirMensagem('Preencha marca e modelo para salvar.', 'erro');
    return;
  }

  definirCarregando(true, id ? 'Alterando...' : 'Incluindo...');
  definirMensagem();

  const resposta = id
    ? await supabase.from('modelos').update(modelo).eq('id', id)
    : await supabase.from('modelos').insert(modelo);

  definirCarregando(false);

  if (resposta.error) {
    definirMensagem(`Erro ao salvar: ${resposta.error.message}`, 'erro');
    return;
  }

  limparFormulario();
  definirMensagem(id ? 'Modelo alterado com sucesso.' : 'Modelo incluído com sucesso.', 'sucesso');
  await carregarModelos();
}

async function excluirModelo(id) {
  const modelo = modelos.find((item) => String(item.id) === String(id));

  if (!modelo) {
    definirMensagem('Registro não encontrado para exclusão.', 'erro');
    return;
  }

  const confirmar = window.confirm(`Excluir o modelo "${modelo.marca} ${modelo.descricao}"?`);

  if (!confirmar) {
    return;
  }

  const { error } = await supabase.from('modelos').delete().eq('id', id);

  if (error) {
    definirMensagem(`Erro ao excluir: ${error.message}`, 'erro');
    return;
  }

  if (String(campoId.value) === String(id)) {
    limparFormulario();
  }

  definirMensagem('Modelo excluído com sucesso.', 'sucesso');
  await carregarModelos();
}

validaSessao();
carregarModelos();
