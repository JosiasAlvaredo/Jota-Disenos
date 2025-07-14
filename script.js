// Función para incluir fragmentos HTML
async function incluirHTML(id, archivo) {
  try {
    const res = await fetch(archivo);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(`Error al cargar ${archivo}:`, err);
  }
}

// Esperamos que todo se cargue antes de conectar eventos
window.addEventListener('DOMContentLoaded', async () => {
  await incluirHTML('navbar', './partials/navbar.html');
  await incluirHTML('footer', './partials/footer.html');
  await incluirHTML('productos', './partials/productos.html');
  await incluirHTML('detalle', './partials/detalle.html');
  await incluirHTML('carrito', './partials/carrito.html');

  inicializarEventos(); // Conectamos eventos y actualizamos la vista
});

// Variables globales
let carrito = [];
let productoActual = null;

// Función para inicializar eventos y lógica
function inicializarEventos() {
  actualizarContador();

  // Enviar pedido por WhatsApp
  const form = document.getElementById('pedidoForm');
  if (form) {
    form.addEventListener('submit', function (e) {
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
    });
  }

  // Bloquear clic derecho en imágenes
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      alert("😅 No se puede descargar esta imagen");
    }
  });
}

// Mostrar detalle de un producto
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

// Volver al catálogo
function volverAlCatalogo() {
  productoActual = null;
  document.getElementById('producto-detalle').style.display = 'none';
  document.getElementById('productos').style.display = 'block';
  document.getElementById('carrito').style.display = 'none';
}

// Agregar producto al carrito
function agregarAlCarrito() {
  if (!productoActual) return alert("Seleccioná un producto.");
  carrito.push(productoActual);
  actualizarContador();
  alert(`✅ "${productoActual.titulo}" agregado al carrito.`);
}

// Actualizar contador del navbar
function actualizarContador() {
  const contador = document.getElementById('carritoCantidad');
  if (contador) contador.textContent = carrito.length;
}

// Mostrar sección del carrito
function mostrarCarrito() {
  document.getElementById('productos').style.display = 'none';
  document.getElementById('producto-detalle').style.display = 'none';
  document.getElementById('carrito').style.display = 'block';
  actualizarVistaCarrito();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar productos en el carrito
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

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContador();
  actualizarVistaCarrito();
}

// Vaciar el carrito
function vaciarCarrito() {
  if (confirm("¿Vaciar todo el carrito?")) {
    carrito = [];
    actualizarContador();
    actualizarVistaCarrito();
  }
}
