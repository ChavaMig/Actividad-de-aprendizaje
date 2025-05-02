// src/register.js
import { getById } from './documentUtil.js';
const API = '/motos';

getById('btn-cancel').onclick = () => window.location.href = 'index.html';

getById('register-form').onsubmit = async e => {
  e.preventDefault();
  const moto = {
    modelo: getById('modelo').value,
    marca:  getById('marca').value,
    año:    parseInt(getById('anio').value,10),
    tipo:   getById('tipo').value
  };
  const res = await fetch(API, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(moto)
  });
  if (res.ok) window.location.href = 'index.html';
  else alert('Error al crear');
};
