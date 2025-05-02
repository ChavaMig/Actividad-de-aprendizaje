// src/modify.js
import { getById } from './documentUtil.js';
const API = '/motos';
let orig;

function queryModelo() {
  return new URLSearchParams(window.location.search).get('modelo');
}

async function init() {
  orig = queryModelo();
  if (!orig) return window.location.href = 'index.html';
  getById('original-modelo').value = orig;
  const motos = await (await fetch(API)).json();
  const m = motos.find(x => x.modelo===orig);
  getById('modelo').value = m.modelo;
  getById('marca').value  = m.marca;
  getById('anio').value   = m.año;
  getById('tipo').value   = m.tipo;
}

getById('btn-cancel').onclick = () => window.location.href = 'index.html';

getById('modify-form').onsubmit = async e => {
  e.preventDefault();
  const upd = {
    modelo: getById('modelo').value,
    marca:  getById('marca').value,
    año:    parseInt(getById('anio').value,10),
    tipo:   getById('tipo').value
  };
  const res = await fetch(`${API}/${encodeURIComponent(orig)}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(upd)
  });
  if (res.ok) window.location.href = 'index.html';
  else alert('Error al actualizar');
};

document.addEventListener('DOMContentLoaded', init);
