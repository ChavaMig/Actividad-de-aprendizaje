import axios from 'axios';
import { getById } from './documentUtil.js';

const API = 'http://localhost:8080/motos';

document.addEventListener('DOMContentLoaded', () => {
  getById('btn-cancel').onclick = () => window.location.href = 'index.html';

  getById('register-form').onsubmit = async e => {
    e.preventDefault();
    const moto = {
      modelo: getById('modelo').value,
      marca:  getById('marca').value,
      año:    parseInt(getById('anio').value, 10),
      tipo:   getById('tipo').value
    };
    try {
      await axios.post(API, moto);
      window.location.href = 'index.html';
    } catch {
      alert('Error al crear');
    }
  };
});
