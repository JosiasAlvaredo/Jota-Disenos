let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarAlCarrito(nombre, precio) {
  carrito.push({ titulo: nombre, precio: precio });
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`✅ "${nombre}" agregado al carrito.`);
  actualizarContador();
}

function actualizarContador() {
  const contador = document.getElementById("carritoCantidad");
  if (contador) contador.textContent = carrito.length;
}

function vaciarCarrito() {
  if (confirm("¿Vaciar todo el carrito?")) {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
  }
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById('listaCarrito');
  const totalSpan = document.getElementById('totalCarrito');
  if (!lista || !totalSpan) return;

  lista.innerHTML = '';
  let total = 0;
  carrito.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `${item.titulo} - $${item.precio} <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${i})">❌</button>`;
    lista.appendChild(li);
    total += item.precio;
  });
  totalSpan.textContent = total;
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarContador();
  mostrarCarrito();
});

document.getElementById('pedidoForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('nombreInput').value.trim();
  const gmail = document.getElementById('gmailInput').value.trim();
  if (!nombre || !gmail) return alert("Completá tus datos.");
  if (carrito.length === 0) return alert("El carrito está vacío.");

  let mensaje = `¡Hola! Soy *${nombre}* y quiero hacer un pedido.\n`;
  mensaje += `📧 Gmail: ${gmail}\n\n🛍️ Productos:\n`;
  let total = 0;
  carrito.forEach((item, i) => {
    mensaje += `${i + 1}. ${item.titulo} - $${item.precio}\n`;
    total += item.precio;
  });
  mensaje += `\n💰 Total: $${total}`;
  const numero = "5493516175353";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});
