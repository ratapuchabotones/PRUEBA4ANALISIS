const API = "http://localhost:8081/api";

document.addEventListener("DOMContentLoaded", () => {

    cargarDashboard();
    cargarProductos();

});

async function cargarDashboard() {

    try {

        const response = await fetch(
            `${API}/dashboard/resumen`
        );

        const data = await response.json();

        document.getElementById("productosTotal").textContent =
            data.productos;

        document.getElementById("clientesTotal").textContent =
            data.clientes;

        document.getElementById("ventasTotal").textContent =
            data.ventas;

        document.getElementById("comprasTotal").textContent =
            data.compras;

        document.getElementById("proveedoresTotal").textContent =
            data.proveedores;

        document.getElementById("empleadosTotal").textContent =
            data.empleados;

    } catch (error) {

        console.error(error);

    }

}

async function cargarProductos() {

    try {

        const response = await fetch(
            `${API}/productos`
        );

        const productos = await response.json();

        const contenedor =
            document.getElementById("listaProductos");

        contenedor.innerHTML = "";

        productos.forEach(producto => {

            contenedor.innerHTML += `

            <div class="col-lg-3 col-md-6">

                <div class="card product-card h-100">

                    <img
                    src="https://picsum.photos/400/300?random=${producto.idProducto}"
                    class="product-img">

                    <div class="product-body">

                        <h5 class="product-title">
                            ${producto.nombre}
                        </h5>

                        <p>
                            ${producto.marca}
                        </p>

                        <p class="product-category">
                            ${producto.categoria.nombre}
                        </p>

                        <p class="product-price">
                            Bs. ${producto.precioVenta}
                        </p>

                    </div>

                </div>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}