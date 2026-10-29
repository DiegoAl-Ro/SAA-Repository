const API_URL = 'http://localhost:3000/api/proyectos';

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

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  cargarProyectos();
  proyectoForm.addEventListener('submit', guardarProyecto);
  btnCancel.addEventListener('click', resetFormulario);
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