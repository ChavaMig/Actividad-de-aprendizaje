// src/index.js
import { getById, createEl } from './documentUtil.js';
import { confirmAction } from './dialogUtil.js';

const API = '/motos';

async function loadMotos() {
  const tbody = getById('motos-table').querySelector('tbody');
  tbody.innerHTML = '';
  try {
    const res = await fetch(API);
    const motos = await res.json();
    motos.forEach(moto => {
      const tr = createEl('tr');
      ['modelo','marca','año','tipo'].forEach(p => {
        const td = createEl('td');
        td.textContent = moto[p];
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
          await fetch(`${API}/${encodeURIComponent(moto.modelo)}`, { method:'DELETE' });
          loadMotos();
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

getById('btn-new').onclick = () => window.location.href = 'register.html';
document.addEventListener('DOMContentLoaded', loadMotos);
