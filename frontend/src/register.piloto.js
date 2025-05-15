import axios from 'axios';
import { getById } from './documentUtil.js';

const API_PILOTOS = 'http://localhost:8080/pilotos';
const API_MOTOS   = 'http://localhost:8080/motos';

async function loadMotosOptions() {
  try {
    const { data: motos } = await axios.get(API_MOTOS);
    const select = getById('motoModelo');
    motos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.modelo} (${m.marca})`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Error al cargar motos disponibles:', err);
    alert('Error al cargar motos disponibles');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getById('btn-cancel').onclick = () => window.location.href = 'index.html';

  loadMotosOptions();

  const form = getById('register.piloto-form');
  if (!form) {
    console.error('No se encontró el formulario register.piloto-form');
    return;
  }

  form.onsubmit = async e => {
    e.preventDefault();

    const piloto = {
      nombre:       getById('nombre').value.trim(),
      nacionalidad: getById('nacionalidad').value.trim(),
      edad:         parseInt(getById('edad').value, 10),
      moto_id:      parseInt(getById('motoModelo').value, 10)
    };

    try {
      await axios.post(API_PILOTOS, piloto);
      window.location.href = 'index.html';
    } catch (err) {
      console.error(
        'Error al registrar piloto:',
        err.response?.status,
        err.response?.data
      );
      alert(
        `Error ${err.response?.status}: ${err.response?.data?.message || err.message}`
      );
    }
  };
});
