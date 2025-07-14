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
  await cargarProductos(); // Cargar productos al inicio
});

// Variables globales
let carrito = [];
let productoActual = null;

// Cargar productos
async function cargarProductos() {
  await incluirHTML('contenido', './partials/productos.html');
}

// Mostrar detalle de un producto
function mostrarDetalle(titulo, descripcion, imagenes, precio) {
  productoActual = { titulo, descripcion, imagenes, precio };
  const contenido = `
    <section id="producto-detalle" class="container py-5">
      <button class="btn btn-secondary mb-4" onclick="volverAlCatalogo()">← Volver al catálogo</button>
      <div class="row">
        <div class="col-md-6">
          <div id="detalleCarrusel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner" id="carouselInner"></div>
            <button class="carousel-control-prev" type="button" data-bs-target="#detalleCarrusel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#detalleCarrusel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <h2>${titulo}</h2>
          <p>${descripcion}</p>
          <p class="fw-bold text-success fs-4">$${precio}</p>
          <button class="btn btn-success" onclick="agregarAlCarrito()">Agregar al carrito</button>
        </div>
      </div>
    </section>
  `;
  document.getElementById('contenido').innerHTML = contenido;
  cargarImagenes(imagenes);
}

// Cargar imágenes en el carrusel
function cargarImagenes(imagenes) {
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
}

// Volver al catálogo
function volverAlCatalogo() {
  productoActual = null;
  cargarProductos();
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
  const contenido = `
    <section id="carrito" class="container py-5">
      <button class="btn btn-secondary mb-4" onclick="volverAlCatalogo()">← Volver al catálogo</button>
      <h2 class="mb-4">🛒 Carrito de compras</h2>
      <ul id="listaCarrito" class="list-group mb-3"></ul>
      <p class="fw-bold fs-5">Total: $<span id="totalCarrito">0</span></p>
      <div class="mb-3">
        <button class="btn btn-warning" onclick="vaciarCarrito()">Vaciar carrito</button>
      </div>
      <form id="pedidoForm">
        <div class="row mb-3">
          <div class="col-md-6">
            <input type="text" id="nombreInput" class="form-control" placeholder="Tu nombre" required />
          </div>
          <div class="col-md-6">
            <input type="email" id="gmailInput" class="form-control" placeholder="Tu Gmail" required />
          </div>
        </div>
        <button type="submit" class="btn btn-success">Enviar pedido por WhatsApp</button>
      </form>
    </section>
  `;
  document.getElementById('contenido').innerHTML = contenido;
  actualizarVistaCarrito();
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
