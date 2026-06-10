const API = "http://localhost:8081/api";
let carrito =
    JSON.parse(
        localStorage.getItem(
            "carrito"
        )
    ) || [];
/* =========================
   EMPLEADO LOGUEADO
========================= */

const empleado =
    JSON.parse(
        localStorage.getItem("empleado")
    );

/* =========================
   AL CARGAR INDEX
========================= */

window.addEventListener("load", () => {

    cargarProductosPublicos();
    actualizarCarrito();
    const menuLogin =
        document.getElementById(
            "menuLogin"
        );

    const menuEmpleado =
        document.getElementById(
            "menuEmpleado"
        );

    const nombreEmpleado =
        document.getElementById(
            "nombreEmpleado"
        );

    if (
        empleado &&
        menuLogin &&
        menuEmpleado &&
        nombreEmpleado
    ) {

        menuLogin.classList.add(
            "d-none"
        );

        menuEmpleado.classList.remove(
            "d-none"
        );

        nombreEmpleado.textContent =
            empleado.usuario.nombre;

    }

});

/* =========================
   LOGIN
========================= */

async function login() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value;

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    const response =
        await fetch(
            `${API}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

    const data =
        await response.json();

    if (data.idEmpleado) {

        localStorage.setItem(
            "empleado",
            JSON.stringify(data)
        );

        window.location.href =
            "panel.html";

    } else {

        alert(
            "Credenciales incorrectas"
        );

    }

}

/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "empleado"
    );

    window.location.href =
        "index.html";

}

/* =========================
   PRODUCTOS PÚBLICOS
========================= */

async function cargarProductosPublicos() {

    const productos =
        await fetch(
            `${API}/productos`
        ).then(r => r.json());

    let html = "";

    productos.forEach(producto => {

        html += `

<div class="col-lg-3 col-md-6">

    <div class="card product-card h-100">

        <img
            src="https://picsum.photos/400/300?random=${producto.idProducto}"
            class="product-img"
        >

        <div class="product-body">

            <span class="product-category">

                ${producto.categoria.nombre}

            </span>

            <h5 class="product-title">

                ${producto.nombre}

            </h5>

            <p class="product-description">

                ${producto.descripcion}

            </p>

            <div
                class="d-flex justify-content-between align-items-center mt-3"
            >

                <span class="product-price">

                    Bs. ${producto.precioVenta}

                </span>

                <button
                    class="btn btn-danger btn-comprar"
                    onclick="comprarProducto(${producto.idProducto})"
                >

                    <i class="bi bi-cart-plus"></i>

                    Comprar

                </button>

            </div>

        </div>

    </div>

</div>

`;

    });

    const lista =
        document.getElementById(
            "listaProductos"
        );

    if (lista) {

        lista.innerHTML = html;

    }

}

/* =========================
   COMPRAR
========================= */

async function comprarProducto(id) {

    const productos =
        await fetch(
            `${API}/productos`
        ).then(r => r.json());

    const producto =
        productos.find(
            p => p.idProducto == id
        );

    if (!producto) return;

    const existente =
        carrito.find(
            p => p.idProducto == id
        );

    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({
            ...producto,
            cantidad: 1
        });

    }

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    actualizarCarrito();

    alert(
        "Producto agregado al carrito"
    );

}
function actualizarCarrito() {

    const lista =
        document.getElementById(
            "listaCarrito"
        );

    if (!lista) return;

    let html = "";

    let total = 0;

    carrito.forEach((p, i) => {

        total +=
            p.precioVenta *
            p.cantidad;

        html += `
            <div class="border rounded p-2 mb-2">

                <strong>
                    ${p.nombre}
                </strong>

                <br>

                Cantidad:
                ${p.cantidad}

                <br>

                Precio:
                Bs. ${p.precioVenta}

                <br>

                <button
                    class="btn btn-sm btn-danger mt-2"
                    onclick="eliminarProducto(${i})"
                >
                    Eliminar
                </button>

            </div>
        `;

    });

    lista.innerHTML = html;

    document.getElementById(
        "contadorCarrito"
    ).textContent =
        carrito.length;

    document.getElementById(
        "totalCarrito"
    ).textContent =
        total.toFixed(2);

}
function eliminarProducto(index) {

    carrito.splice(
        index,
        1
    );

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    actualizarCarrito();

}
function mostrarPago() {

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pagoModal"
            )
        );

    modal.show();

}
function pagarQR() {

    const total =
        document.getElementById(
            "totalCarrito"
        ).textContent;

    document.getElementById(
        "totalQr"
    ).textContent = total;

    let detalle = "";

    carrito.forEach(p => {

        detalle += `
            <div>

                <strong>
                    ${p.nombre}
                </strong>

                <br>

                Cantidad:
                ${p.cantidad}

                <br>

                Bs. ${p.precioVenta}

            </div>

            <hr>
        `;

    });

    document.getElementById(
        "detalleQr"
    ).innerHTML = detalle;

    // Generar comprobante

    document.getElementById(
        "numeroComprobante"
    ).textContent =
        Math.floor(
            Math.random() * 100000
        );

    document.getElementById(
        "fechaComprobante"
    ).textContent =
        new Date().toLocaleString();

    document.getElementById(
        "estadoPago"
    ).className =
        "alert alert-warning";

    document.getElementById(
        "estadoPago"
    ).textContent =
        "PENDIENTE DE PAGO";

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "qrModal"
            )
        );

    modal.show();

}
function confirmarPagoQR() {

    document.getElementById(
        "estadoPago"
    ).className =
        "alert alert-success";

    document.getElementById(
        "estadoPago"
    ).textContent =
        "PAGO EXITOSO";

    setTimeout(() => {

        carrito = [];

        localStorage.removeItem(
            "carrito"
        );

        actualizarCarrito();

        bootstrap.Modal.getInstance(
            document.getElementById(
                "qrModal"
            )
        ).hide();

    }, 1500);

}
function pagarTarjeta() {

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "tarjetaModal"
            )
        );

    modal.show();

}
function pagarTarjeta() {

    document.getElementById(
        "totalTarjeta"
    ).textContent =
        document.getElementById(
            "totalCarrito"
        ).textContent;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "tarjetaModal"
            )
        );

    modal.show();

}
function confirmarPagoTarjeta() {

    const numero =
        document.getElementById(
            "numeroTarjeta"
        ).value;

    const nombre =
        document.getElementById(
            "nombreTitular"
        ).value;

    const fecha =
        document.getElementById(
            "fechaTarjeta"
        ).value;

    const cvv =
        document.getElementById(
            "cvvTarjeta"
        ).value;

    if (
        !numero ||
        !nombre ||
        !fecha ||
        !cvv
    ) {

        alert(
            "Complete todos los campos"
        );

        return;

    }

    alert(
        "Pago aprobado correctamente"
    );

    carrito = [];

    localStorage.removeItem(
        "carrito"
    );

    actualizarCarrito();

    bootstrap.Modal.getInstance(
        document.getElementById(
            "tarjetaModal"
        )
    ).hide();

}
function actualizarVistaTarjeta() {

    const numero =
        document.getElementById(
            "numeroTarjeta"
        ).value;

    const nombre =
        document.getElementById(
            "nombreTitular"
        ).value;

    const fecha =
        document.getElementById(
            "fechaTarjeta"
        ).value;

    document.getElementById(
        "vistaNumeroTarjeta"
    ).textContent =
        numero ||
        "**** **** **** ****";

    document.getElementById(
        "vistaTitular"
    ).textContent =
        nombre.toUpperCase() ||
        "TU NOMBRE";

    document.getElementById(
        "vistaFecha"
    ).textContent =
        fecha ||
        "MM/AA";

}