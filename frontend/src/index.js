import axios from 'axios';
import { getById, createEl } from './documentUtil.js';
import { confirmAction } from './dialogUtil.js';

const API_MOTOS   = 'http://localhost:8080/motos';
const API_PILOTOS = 'http://localhost:8080/pilotos';

let motosCache = [];

// Carga Motos y almacena en caché
async function loadMotos() {
  const tbody = getById('motos-table').querySelector('tbody');
  tbody.innerHTML = '';
  try {
    const { data: motos } = await axios.get(API_MOTOS);
    motosCache = motos; // guarda para usar al mostrar pilotos
    motos.forEach(moto => {
      const tr = createEl('tr');
      ['modelo','marca','año','tipo'].forEach(prop => {
        const td = createEl('td');
        td.textContent = moto[prop];
        tr.appendChild(td);
      });
      const acciones = createEl('td');
      const btnE = createEl('button');
      btnE.textContent = 'Editar';
      btnE.onclick = () =>
        window.location.href = `modify.html?modelo=${encodeURIComponent(moto.modelo)}`;
      const btnD = createEl('button');
      btnD.textContent = 'Eliminar';
      btnD.onclick = async () => {
        if (confirmAction('¿Eliminar esta moto?')) {
          await axios.delete(`${API_MOTOS}/${encodeURIComponent(moto.modelo)}`);
          loadMotos();
          loadPilotos();
        }
      };
      acciones.appendChild(btnE);
      acciones.appendChild(btnD);
      tr.appendChild(acciones);
      tbody.appendChild(tr);
    });
  } catch {
    alert('Error al cargar motos');
  }
}

// Carga Pilotos y usa motosCache para mostrar el modelo
async function loadPilotos() {
  const tbody = getById('pilotos-table').querySelector('tbody');
  tbody.innerHTML = '';
  try {
    const { data: pilotos } = await axios.get(API_PILOTOS);
    pilotos.forEach(p => {
      const tr = createEl('tr');
      // Nombre y edad
      ['nombre','edad'].forEach(prop => {
        const td = createEl('td');
        td.textContent = p[prop];
        tr.appendChild(td);
      });
      // Mostrar modelo de la moto asignada
      const tdMoto = createEl('td');
      const moto = motosCache.find(m => m.id === p.moto_id);
      tdMoto.textContent = moto ? moto.modelo : '—';
      tr.appendChild(tdMoto);
      // Acciones
      const acciones = createEl('td');
      const btnE = createEl('button');
      btnE.textContent = 'Editar';
      btnE.onclick = () =>
        window.location.href = `modify.piloto.html?id=${encodeURIComponent(p.id)}`;
      const btnD = createEl('button');
      btnD.textContent = 'Eliminar';
      btnD.onclick = async () => {
        if (confirmAction('¿Eliminar este piloto?')) {
          await axios.delete(`${API_PILOTOS}/${encodeURIComponent(p.id)}`);
          loadPilotos();
        }
      };
      acciones.appendChild(btnE);
      acciones.appendChild(btnD);
      tr.appendChild(acciones);
      tbody.appendChild(tr);
    });
  } catch {
    alert('Error al cargar pilotos');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getById('btn-new-moto').onclick   = () => window.location.href = 'register.html';
  getById('btn-new-piloto').onclick = () => window.location.href = 'register.piloto.html';
  loadMotos().then(loadPilotos);
});
