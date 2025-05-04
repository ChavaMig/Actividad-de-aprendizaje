import axios from 'axios';
import { getById } from './documentUtil.js';

const API = 'http://localhost:8080/motos';

function queryModelo() {
  return new URLSearchParams(window.location.search).get('modelo');
}

async function init() {
  const orig = queryModelo();
  if (!orig) return window.location.href = 'index.html';

  getById('original-modelo').value = orig;

  try {
    const { data: motos } = await axios.get(API);
    const m = motos.find(x => x.modelo === orig);

    if (!m) return alert('Moto no encontrada');

    getById('modelo').value = m.modelo;
    getById('marca').value  = m.marca;
    getById('anio').value   = m.año;
    getById('tipo').value   = m.tipo;

    getById('modify-form').onsubmit = async e => {
      e.preventDefault();
      const upd = {
        modelo: getById('modelo').value,
        marca:  getById('marca').value,
        año:    parseInt(getById('anio').value, 10),
        tipo:   getById('tipo').value
      };
      try {
        await axios.put(`${API}/${encodeURIComponent(orig)}`, upd);
        window.location.href = 'index.html';
      } catch {
        alert('Error al actualizar');
      }
    };

    getById('btn-cancel').onclick = () => window.location.href = 'index.html';
  } catch {
    alert('Error al obtener la moto');
  }
}

document.addEventListener('DOMContentLoaded', init);
