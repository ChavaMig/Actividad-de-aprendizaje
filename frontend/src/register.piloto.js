// src/register-piloto.js
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
      opt.value = m.id;                       // <--- id de la moto
      opt.textContent = `${m.modelo} (${m.marca})`;
      select.appendChild(opt);
    });
  } catch {
    alert('Error al cargar motos disponibles');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getById('btn-cancel').onclick = () => window.location.href = 'index.html';
  loadMotosOptions();

  getById('register.piloto-form').onsubmit = async e => {
    e.preventDefault();
    const piloto = {
      nombre:  getById('nombre').value,
      edad:    parseInt(getById('edad').value, 10),
      moto_id: parseInt(getById('motoModelo').value, 10) 
    };
    try {
      await axios.post(API_PILOTOS, piloto);
      window.location.href = 'index.html';
    } catch {
      alert('Error al registrar piloto');
    }
  };
});
