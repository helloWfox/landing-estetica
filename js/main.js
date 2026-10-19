/*
 * CONFIGURAÇÃO DO CLIENTE
 * Para adaptar o protótipo a uma clínica nova, troque só este bloco
 * (e as fotos em assets/img). O resto da página se ajusta sozinho.
 */
const CONFIG = {
  nome: 'Sálvia',
  cidade: 'Monte Carmelo',
  whatsapp: '5534999999999',
  telefoneExibicao: '(34) 99999-9999',
  instagram: '@clinicasalvia',
  endereco: 'Rua Exemplo, 123 · Centro, Monte Carmelo',
  horario: 'Seg a sex, 8h às 19h · Sáb, 8h às 12h',
  procedimentos: {
    facial: [
      { nome: 'Limpeza de pele profunda', duracao: '60 min', descricao: 'Remove cravos e impurezas e devolve o viço da pele.' },
      { nome: 'Peeling químico', duracao: '45 min', descricao: 'Renova a pele e suaviza manchas e marcas de acne.' },
      { nome: 'Microagulhamento', duracao: '60 min', descricao: 'Estimula colágeno para tratar cicatrizes e linhas finas.' },
      { nome: 'Hidratação facial', duracao: '50 min', descricao: 'Repõe a água da pele e deixa o rosto macio e luminoso.' },
    ],
    corporal: [
      { nome: 'Drenagem linfática', duracao: '60 min', descricao: 'Reduz inchaço e retenção de líquido, ótima no pós-operatório.' },
      { nome: 'Massagem modeladora', duracao: '50 min', descricao: 'Ativa a circulação e ajuda a definir o contorno do corpo.' },
      { nome: 'Radiofrequência', duracao: '40 min', descricao: 'Melhora a firmeza da pele e o aspecto da celulite.' },
      { nome: 'Depilação a laser', duracao: '30 min', descricao: 'Reduz os pelos de forma duradoura, com sessões rápidas.' },
    ],
  },
};

const waLink = (texto) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

function aplicarConfig() {
  document.querySelectorAll('[data-config]').forEach((el) => {
    const valor = CONFIG[el.dataset.config];
    if (typeof valor === 'string') el.textContent = valor;
  });

  const geral = waLink(`Olá! Vim pelo site da ${CONFIG.nome} e gostaria de agendar uma avaliação.`);
  document.getElementById('floatWhatsapp').href = geral;
  document.getElementById('footerWhatsapp').href = geral;
  document.getElementById('footerInstagram').href = `https://instagram.com/${CONFIG.instagram.replace('@', '')}`;
  document.getElementById('year').textContent = new Date().getFullYear();
}

function renderProcedimentos(tipo) {
  const lista = CONFIG.procedimentos[tipo];
  const box = document.getElementById('procs');
  box.innerHTML = lista
    .map(
      (p) => `
      <article class="proc">
        <div class="proc-top">
          <h3>${p.nome}</h3>
          <span class="proc-time">${p.duracao}</span>
        </div>
        <p>${p.descricao}</p>
        <button type="button" class="proc-link" data-proc="${p.nome}">Agendar este procedimento <span aria-hidden="true">→</span></button>
      </article>`
    )
    .join('');

  box.querySelectorAll('.proc-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('bf-proc').value = btn.dataset.proc;
      document.getElementById('agendar').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('bf-nome').focus({ preventScroll: true });
    });
  });
}

function configurarAbas() {
  const abas = document.querySelectorAll('.tab');
  abas.forEach((aba) => {
    aba.addEventListener('click', () => {
      abas.forEach((a) => {
        const ativa = a === aba;
        a.classList.toggle('is-active', ativa);
        a.setAttribute('aria-selected', String(ativa));
      });
      renderProcedimentos(aba.dataset.tab);
    });
  });
}

function configurarFormulario() {
  const select = document.getElementById('bf-proc');
  const grupos = [
    ['Faciais', CONFIG.procedimentos.facial],
    ['Corporais', CONFIG.procedimentos.corporal],
  ];
  select.innerHTML =
    '<option value="Avaliação gratuita">Ainda não sei, quero uma avaliação</option>' +
    grupos
      .map(([rotulo, itens]) => `<optgroup label="${rotulo}">${itens.map((p) => `<option>${p.nome}</option>`).join('')}</optgroup>`)
      .join('');

  const data = document.getElementById('bf-data');
  const hoje = new Date();
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  data.min = iso(hoje);
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  data.value = iso(amanha);

  const form = document.getElementById('bookingForm');
  const erro = document.getElementById('formError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    if (!nome || !form.data.value) {
      erro.hidden = false;
      return;
    }
    erro.hidden = true;

    const [ano, mes, dia] = form.data.value.split('-');
    const texto = [
      `Olá! Meu nome é ${nome} e gostaria de agendar:`,
      '',
      `• Procedimento: ${form.procedimento.value}`,
      `• Dia: ${dia}/${mes}/${ano}`,
      `• Período: ${form.periodo.value}`,
      '',
      'Vim pelo site.',
    ].join('\n');

    window.open(waLink(texto), '_blank', 'noopener');
  });
}

aplicarConfig();
configurarAbas();
renderProcedimentos('facial');
configurarFormulario();
