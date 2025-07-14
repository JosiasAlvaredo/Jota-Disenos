// Cargar fragmentos HTML
function incluirHTML(id, archivo) {
  fetch(archivo)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => console.error(`Error al cargar ${archivo}:`, err));
}

// Fragmentos a insertar
window.addEventListener('DOMContentLoaded', () => {
  incluirHTML('navbar', './partials/navbar.html');
  incluirHTML('footer', './partials/footer.html');
  incluirHTML('productos', './partials/productos.html');
  incluirHTML('detalle', './partials/detalle.html');
  incluirHTML('carrito', './partials/carrito.html');
});

// Funcionalidad de la tienda
let carrito = [];
let productoActual = null;

function mostrarDetalle(titulo, descripcion, imagenes, precio) {
  productoActual = { titulo, descripcion, imagenes, precio };
  document.getElementById('detalleTitulo').textContent = titulo;
  document.getElementById('detalleDescripcion').textContent = descripcion;
  document.getElementById('detallePrecio').textContent = `$${precio}`;

  const carouselInner = document.getElementById('carouselInner');
  carouselInner.innerHTML = '';
  imagenes.forEach((url, i) => {
    const div = document.createElement('div');
    div.className = i === 0 ? 'carousel-item active' : 'carousel-item';
    const img = document.createElement('img');
    img.src = url;
    img.className = 'd-block w-100 rounded';
    div.appendChild(img);
    carouselInner.appendChild(div);
  });

  document.getElementById('productos').style.display = 'none';
  document.getElementById('producto-detalle').style.display = 'block';
  document.getElementById('carrito').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function volverAlCatalogo() {
  productoActual = null;
  document.getElementById('producto-detalle').style.display = 'none';
  document.getElementById('productos').style.display = 'block';
  document.getElementById('carrito').style.display = 'none';
}

function agregarAlCarrito() {
  if (!productoActual) return alert("Seleccioná un producto.");
  carrito.push(productoActual);
  actualizarContador();
  alert(`✅ "${productoActual.titulo}" agregado al carrito.`);
}

function actualizarContador() {
  const contador = document.getElementById('carritoCantidad');
  if (contador) contador.textContent = carrito.length;
}

function mostrarCarrito() {
  document.getElementById('productos').style.display = 'none';
  document.getElementById('producto-detalle').style.display = 'none';
  document.getElementById('carrito').style.display = 'block';
  actualizarVistaCarrito();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function actualizarVistaCarrito() {
  const lista = document.getElementById('listaCarrito');
  const totalSpan = document.getElementById('totalCarrito');
  if (!lista || !totalSpan) return;
  lista.innerHTML = '';
  let total = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `${item.titulo} - $${item.precio}
      <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">❌</button>`;
    lista.appendChild(li);
    total += item.precio;
  });
  totalSpan.textContent = total;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContador();
  actualizarVistaCarrito();
}

function vaciarCarrito() {
  if (confirm("¿Vaciar todo el carrito?")) {
    carrito = [];
    actualizarContador();
    actualizarVistaCarrito();
  }
}

document.addEventListener('submit', function (e) {
  if (e.target.id === 'pedidoForm') {
    e.preventDefault();
    const nombre = document.getElementById('nombreInput')?.value.trim();
    const gmail = document.getElementById('gmailInput')?.value.trim();
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
  }
});

// Bloquear clic derecho en imágenes
document.addEventListener('contextmenu', function (e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    alert("😅 No se puede descargar esta imagen");
  }
});
