/**
 * LÓGICA DO SISTEMA DE CONTROLE DE ESTUDOS
 */

// 1. Estado da Aplicação
let disciplinas = JSON.parse(localStorage.getItem('estudos_data')) || [];

// 2. Seleção de Elementos
const form = document.getElementById('form-disciplina');
const listaContainer = document.getElementById('lista-disciplinas');
const totalHorasDisplay = document.getElementById('total-horas-global');

// 3. Funções de Persistência e Renderização
function atualizarTudo() {
    localStorage.setItem('estudos_data', JSON.stringify(disciplinas));
    renderizarLista();
    calcularTotalGlobal();
}

function calcularTotalGlobal() {
    const total = disciplinas.reduce((acc, curr) => acc + curr.estudado, 0);
    totalHorasDisplay.textContent = total.toFixed(1);
}

function renderizarLista() {
    listaContainer.innerHTML = '';

    if (disciplinas.length === 0) {
        listaContainer.innerHTML = '<p class="empty-msg">Nenhuma disciplina cadastrada.</p>';
        return;
    }

    disciplinas.forEach((disc) => {
        const percentual = Math.min((disc.estudado / disc.carga) * 100, 100).toFixed(1);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between">
                <strong>${disc.nome}</strong>
                <span style="font-size:0.7rem; background:#eee; padding:2px 6px; border-radius:4px">${disc.area}</span>
            </div>
            <div style="font-size:0.9rem; margin-top:5px">Prof. ${disc.professor} | Meta: ${disc.carga}h</div>
            <div style="font-size:0.9rem; font-weight:bold">Estudado: ${disc.estudado}h</div>
            
            <div class="progress-container">
                <div class="progress-bar" style="width: ${percentual}%"></div>
            </div>
            <div style="font-size:0.75rem; text-align:right">${percentual}% concluído</div>

            <div class="actions">
                <button class="btn-small btn-add" onclick="adicionarHoras('${disc.id}')">+ Horas</button>
                <button class="btn-small btn-edit" onclick="prepararEdicao('${disc.id}')">Editar</button>
                <button class="btn-small btn-del" onclick="removerDisciplina('${disc.id}')">Excluir</button>
            </div>
        `;
        listaContainer.appendChild(card);
    });
}

// 4. Operações de CRUD
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('input-id').value;
    const dados = {
        nome: document.getElementById('input-nome').value,
        professor: document.getElementById('input-professor').value,
        carga: parseFloat(document.getElementById('input-carga').value),
        area: document.getElementById('input-area').value
    };

    if (id) {
        // Edição
        const index = disciplinas.findIndex(d => d.id === id);
        disciplinas[index] = { ...disciplinas[index], ...dados };
        document.getElementById('btn-submit').textContent = "Salvar Disciplina";
    } else {
        // Cadastro
        const nova = {
            id: Date.now().toString(),
            ...dados,
            estudado: 0
        };
        disciplinas.push(nova);
    }

    form.reset();
    document.getElementById('input-id').value = '';
    atualizarTudo();
});

window.adicionarHoras = (id) => {
    const horas = prompt("Quantas horas deseja somar?");
    if (horas && !isNaN(horas)) {
        const index = disciplinas.findIndex(d => d.id === id);
        disciplinas[index].estudado += parseFloat(horas);
        atualizarTudo();
    }
};

window.removerDisciplina = (id) => {
    if (confirm("Deseja excluir esta disciplina?")) {
        disciplinas = disciplinas.filter(d => d.id !== id);
        atualizarTudo();
    }
};

window.prepararEdicao = (id) => {
    const d = disciplinas.find(disc => disc.id === id);
    document.getElementById('input-id').value = d.id;
    document.getElementById('input-nome').value = d.nome;
    document.getElementById('input-professor').value = d.professor;
    document.getElementById('input-carga').value = d.carga;
    document.getElementById('input-area').value = d.area;
    document.getElementById('btn-submit').textContent = "Atualizar Disciplina";
    window.scrollTo(0, 0);
};

// Inicialização
atualizarTudo();