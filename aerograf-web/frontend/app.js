const usaApiLocalExterna = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000';
const API_BASE_URL = usaApiLocalExterna ? 'http://localhost:3000' : '';
const API_URL = `${API_BASE_URL}/api/proyectos`;
const BUDGET_API_URL = `${API_BASE_URL}/api/presupuestos`;

// Elementos del DOM
const proyectoForm = document.getElementById('proyecto-form');
const proyectoIdInput = document.getElementById('proyecto-id');
const tituloInput = document.getElementById('titulo');
const clienteInput = document.getElementById('cliente');
const ubicacionInput = document.getElementById('ubicacion');
const estadoSelect = document.getElementById('estado');
const presupuestoInput = document.getElementById('presupuesto');
const tablaBody = document.getElementById('tabla-proyectos-body');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const calculatorForm = document.getElementById('calculator-form');
const btnCalcular = document.getElementById('btn-calcular');
const btnEnviar = document.getElementById('btn-enviar');
const resultadosDiv = document.getElementById('resultados');
const tablaPresupuestosBody = document.getElementById('tabla-presupuestos-body');

// --- GESTIÓN DE TEMA (MODO CLARO / OSCURO) ---
const THEME_STORAGE_KEY = 'aerograff-theme';
const themeToggleBtn = document.getElementById('theme-toggle');

// Resolver el tema: localStorage > prefers-color-scheme > dark por defecto
function resolveInitialTheme() {
  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (e) {
    // localStorage no disponible (navegación privada, etc.)
    storedTheme = null;
  }
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    // Ignorar fallos de almacenamiento
  }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  const initialTheme = resolveInitialTheme();
  applyTheme(initialTheme);
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    persistTheme(next);
  });

  cargarProyectos();
  proyectoForm.addEventListener('submit', guardarProyecto);
  btnCancel.addEventListener('click', resetFormulario);
  cargarPresupuestos();
  calculatorForm.addEventListener('submit', enviarCalculadora);
  btnEnviar.addEventListener('click', enviarCalculadora);
  btnCalcular.addEventListener('click', calcularPresupuesto);
});

// 1. OBTENER Y MOSTRAR PROYECTOS (READ)
async function cargarProyectos() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    renderTabla(result.data);
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    tablaBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ff007f;">Error al conectar con la API (puerto 3000).</td></tr>`;
  }
}

// Renderizar filas de la tabla
function renderTabla(proyectos) {
  tablaBody.innerHTML = '';

  if (!proyectos || proyectos.length === 0) {
    tablaBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay proyectos registrados aún.</td></tr>`;
    return;
  }

  proyectos.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${p.id}</td>
      <td><strong>${p.titulo}</strong></td>
      <td>${p.cliente}</td>
      <td>${p.ubicacion}</td>
      <td><span class="badge ${getBadgeClass(p.estado)}">${p.estado}</span></td>
      <td>€${Number(p.presupuesto).toLocaleString('es-ES')}</td>
      <td>
        <button class="btn-action" title="Editar" onclick="prepararEdicion(${p.id}, '${escapeQuotes(p.titulo)}', '${escapeQuotes(p.cliente)}', '${escapeQuotes(p.ubicacion)}', '${p.estado}', ${p.presupuesto})">✏️</button>
        <button class="btn-action" title="Eliminar" onclick="eliminarProyecto(${p.id})">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });
}

// 2. CREAR O ACTUALIZAR PROYECTO (CREATE / UPDATE)
async function guardarProyecto(e) {
  e.preventDefault();

  const id = proyectoIdInput.value;
  const proyectoData = {
    titulo: tituloInput.value.trim(),
    cliente: clienteInput.value.trim(),
    ubicacion: ubicacionInput.value.trim(),
    estado: estadoSelect.value,
    presupuesto: parseFloat(presupuestoInput.value)
  };

  const esEdicion = Boolean(id);
  const url = esEdicion ? `${API_URL}/${id}` : API_URL;
  const method = esEdicion ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proyectoData)
    });

    if (response.ok) {
      resetFormulario();
      cargarProyectos();
    } else {
      const errData = await response.json();
      alert(`Error: ${errData.error}`);
    }
  } catch (error) {
    console.error('Error al guardar proyecto:', error);
  }
}

// 3. ELIMINAR PROYECTO (DELETE)
async function eliminarProyecto(id) {
  if (!confirm(`¿Estás seguro de eliminar el proyecto con ID ${id}?`)) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      cargarProyectos();
    } else {
      alert('Error al eliminar el proyecto.');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}

// Cargar datos en el formulario para editar
window.prepararEdicion = function(id, titulo, cliente, ubicacion, estado, presupuesto) {
  proyectoIdInput.value = id;
  tituloInput.value = titulo;
  clienteInput.value = cliente;
  ubicacionInput.value = ubicacion;
  estadoSelect.value = estado;
  presupuestoInput.value = presupuesto;

  formTitle.textContent = `Editar Proyecto #${id}`;
  btnSubmit.textContent = 'Actualizar Proyecto';
  btnCancel.classList.remove('hidden');
};

// Resetear el formulario a su estado original
function resetFormulario() {
  proyectoForm.reset();
  proyectoIdInput.value = '';
  formTitle.textContent = 'Registrar Nuevo Proyecto';
  btnSubmit.textContent = 'Guardar Proyecto';
  btnCancel.classList.add('hidden');
}

// Helpers
function getBadgeClass(estado) {
  switch (estado) {
    case 'Planificación': return 'badge-planificacion';
    case 'En Progreso': return 'badge-progreso';
    case 'Completado': return 'badge-completado';
    case 'Cancelado': return 'badge-cancelado';
    default: return '';
  }
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

// --- CALCULADORA DE PRESUPUESTO ---
function calcularPresupuesto() {
  const cliente = document.getElementById('cliente-calc').value.trim();
  const superficie = parseFloat(document.getElementById('superficie-calc').value);
  const altura = parseFloat(document.getElementById('altura-calc').value);
  const tipoMural = document.getElementById('tipo-mural-calc').value;

  if (!superficie || superficie <= 0) {
    resultadosDiv.innerHTML = '<p style="color:#ff007f;">Error: La superficie debe ser mayor a 0.</p>';
    return;
  }
  if (!altura || altura <= 0) {
    resultadosDiv.innerHTML = '<p style="color:#ff007f;">Error: La altura debe ser mayor a 0.</p>';
    return;
  }

  // Precios base por tipo de mural
  const preciosBase = {
    estandar: 150,
    complejo: 220,
    ultra: 300
  };

  // Coste por m² ajustado por altura (mayor altura = mayor coste)
  const factorAltura = 1 + (altura / 100);
  const precioBase = preciosBase[tipoMural];
  const costePorM2 = precioBase * factorAltura;
  const costeTotal = superficie * costePorM2;

  // Número de drones necesarios (cada drone puede pintar ~50 m² por vuelo)
  const dronesNecesarios = Math.ceil(superficie / 50);

  // Tiempo estimado de pintado (horas): 0.5h por cada 10 m², ajustado por altura
  const tiempoHoras = Math.ceil((superficie / 10) * (1 + altura / 50));

  // Mostrar resultados
  resultadosDiv.innerHTML = `
    <div class="result-item">
      <span>Coste Total Estimado:</span>
      <strong>€${costeTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong>
    </div>
    <div class="result-item">
      <span>Drones Necesarios:</span>
      <strong>${dronesNecesarios}</strong>
    </div>
    <div class="result-item">
      <span>Tiempo Estimado de Pintado:</span>
      <strong>${tiempoHoras} horas</strong>
    </div>
    <div class="result-item">
      <span>Tipo de Mural:</span>
      <strong>${tipoMural}</strong>
    </div>
  `;

  // Guardar datos para enviar
  calculatorForm.dataset.costeTotal = costeTotal;
  calculatorForm.dataset.superficie = superficie;
  calculatorForm.dataset.altura = altura;
  calculatorForm.dataset.tipoMural = tipoMural;
  calculatorForm.dataset.cliente = cliente;

  // Mostrar botón de enviar
  btnEnviar.classList.remove('hidden');
}

function enviarCalculadora(e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente-calc').value.trim();
  const superficie = parseFloat(document.getElementById('superficie-calc').value);
  const altura = parseFloat(document.getElementById('altura-calc').value);
  const tipoMural = document.getElementById('tipo-mural-calc').value;
  const costeTotal = parseFloat(calculatorForm.dataset.costeTotal);

  // Obtener fecha actual en zona Europa/Madrid
  const ahora = new Date();
  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, '0');
  const day = String(ahora.getDate()).padStart(2, '0');
  const hour = String(ahora.getHours()).padStart(2, '0');
  const minute = String(ahora.getMinutes()).padStart(2, '0');
  const fechaMadrid = `${year}-${month}-${day}T${hour}:${minute}`;

  const presupuestoData = {
    cliente: cliente || 'Sin cliente',
    superficie_m2: superficie,
    altura_m: altura,
    tipo_mural: tipoMural,
    fecha_estimada: fechaMadrid,
    coste_total: costeTotal
  };

  fetch(BUDGET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(presupuestoData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al enviar presupuesto');
    }
    return response.json();
  })
  .then(data => {
    alert(`Presupuesto guardado con éxito. ID: ${data.data.id}`);
    calculatorForm.reset();
    resultadosDiv.innerHTML = '<p>Introduce los datos y haz clic en "Calcular"</p>';
    btnEnviar.classList.add('hidden');
    cargarPresupuestos();
  })
  .catch(error => {
    alert('Error al guardar el presupuesto.');
    console.error(error);
  });
}

async function cargarPresupuestos() {
  try {
    const response = await fetch(BUDGET_API_URL);
    const result = await response.json();
    renderTablaPresupuestos(result.data);
  } catch (error) {
    console.error('Error al cargar presupuestos:', error);
  }
}

function renderTablaPresupuestos(presupuestos) {
  if (!tablaPresupuestosBody) return;

  tablaPresupuestosBody.innerHTML = '';

  if (!presupuestos || presupuestos.length === 0) {
    tablaPresupuestosBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay presupuestos registrados aún.</td></tr>`;
    return;
  }

  presupuestos.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${p.id}</td>
      <td>${p.cliente}</td>
      <td>${Number(p.superficie_m2).toLocaleString('es-ES')} m²</td>
      <td>${Number(p.altura_m)} m</td>
      <td>${p.tipo_mural}</td>
      <td>€${Number(p.coste_total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
    `;
    tablaPresupuestosBody.appendChild(tr);
  });
}