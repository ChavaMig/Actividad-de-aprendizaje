import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function notifyError(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'center',
    style: { background: 'red' }
  }).showToast();
}

export function notifyOk(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'center',
    style: { background: 'green' }
  }).showToast();
}

export function confirmAction(message) {
  return confirm(message);
}
