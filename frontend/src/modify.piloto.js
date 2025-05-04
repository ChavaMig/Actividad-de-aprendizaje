import axios from 'axios';
import { getById } from './documentUtil.js';

const API_PILOTOS = 'http://localhost:8080/pilotos';
const API_MOTOS   = 'http://localhost:8080/motos';

function queryId() {
  return new URLSearchParams(window.location.search).get('id');
}

async function loadMotosOptions(selectedId) {
  const select = getById('motoModelo');
  select.innerHTML = '<option disabled value="">Seleccione una moto</option>';
  try {
    const { data: motos } = await axios.get(API_MOTOS);
    motos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.modelo} (${m.marca})`;
      if (m.id === selectedId) opt.selected = true;
      select.appendChild(opt);
    });
  } catch {
    alert('Error al cargar motos');
  }
}

async function init() {
  const id = parseInt(queryId(), 10);
  if (!id) return window.location.href = 'index.html';

  try {
    const { data: piloto } = await axios.get(`${API_PILOTOS}/${id}`);
    getById('id').value     = piloto.id;
    getById('nombre').value = piloto.nombre;
    getById('edad').value   = piloto.edad;

    await loadMotosOptions(piloto.moto_id);

    getById('modify.piloto-form').onsubmit = async e => {
      e.preventDefault();
      const actualizado = {
        nombre:  getById('nombre').value,
        edad:    parseInt(getById('edad').value, 10),
        moto_id: parseInt(getById('motoModelo').value, 10)
      };
      try {
        await axios.put(`${API_PILOTOS}/${id}`, actualizado);
        window.location.href = 'index.html';
      } catch {
        alert('Error al actualizar piloto');
      }
    };

    getById('btn-cancel').onclick = () => window.location.href = 'index.html';
  } catch {
    alert('Piloto no encontrado');
  }
}

document.addEventListener('DOMContentLoaded', init);
