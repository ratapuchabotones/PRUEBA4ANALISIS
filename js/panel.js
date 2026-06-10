const empleado =
    JSON.parse(
        localStorage.getItem("empleado")
    );

if (!empleado) {

    window.location.href =
        "index.html";

}
document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.getElementById(
            "infoEmpleado"
        ).innerHTML = `

        <div class="text-center mb-3">

            <strong>

                ${empleadoLogueado.usuario.nombre}

            </strong>

            <br>

            <small>

                ${empleadoLogueado.rol}

            </small>

        </div>

        `;

    }
);
function logout() {

    localStorage.removeItem(
        "empleado"
    );

    window.location =
        "index.html";
}
const API = "http://localhost:8081/api";
let detallesVenta = [];
let detallesCompra = [];
let productoEditando = null;
let categoriaEditando = null;
let empleadoEditando = null;
let proveedorEditando = null;
let usuarioEditando = null;
let clienteEditando = null;
window.onload = () => {

    cargarDashboard();
    cargarProductos();
    cargarInventario();
    cargarClientes();
    cargarProveedores();
    cargarUsuarios();
    cargarEmpleados();
    cargarCombosVenta();
    cargarCombosCompra();

};

function mostrarVista(id) {

    document
        .querySelectorAll(".vista")
        .forEach(v => v.classList.add("d-none"));

    document
        .getElementById(id)
        .classList.remove("d-none");
}

async function cargarDashboard() {

    const response =
        await fetch(`${API}/dashboard/resumen`);

    const data =
        await response.json();

    document.getElementById("dashboard").innerHTML = `

    <h2 class="mb-4">
        Dashboard
    </h2>

    <div class="row g-4">

        <div class="col-md-4">
            <div class="card-resumen">
                <h5>Productos</h5>
                <h2>${data.productos}</h2>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card-resumen">
                <h5>Clientes</h5>
                <h2>${data.clientes}</h2>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card-resumen">
                <h5>Ventas</h5>
                <h2>${data.ventas}</h2>
            </div>
        </div>

    </div>

    `;
}



async function cargarProductos() {

    const response = await fetch(`${API}/productos`);
    const productos = await response.json();

    let html = `

    <div class="card shadow-sm border-0">

        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">

            <h4 class="mb-0">
                <i class="bi bi-box-seam"></i> Gestión de Productos
            </h4>

            <button
                class="btn btn-light"
                onclick="abrirModalProducto()">

                <i class="bi bi-plus-circle-fill"></i>
                Nuevo Producto

            </button>

        </div>

        <div class="card-body">

            <div class="row mb-3">

                <div class="col-md-4">

                    <div class="input-group">

                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>

                        <input
                            type="text"
                            id="buscarProducto"
                            class="form-control"
                            placeholder="Buscar producto..."
                            onkeyup="buscarProducto()">

                    </div>

                </div>

            </div>

            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Imagen</th>
                            <th>Marca</th>
                            <th>Código</th>
                            <th>Compra</th>
                            <th>Venta</th>
                            <th>Estado</th>
                            <th class="text-center">Acciones</th>
                        </tr>

                    </thead>

                    <tbody>
    `;

    productos.forEach(p => {

        html += `

        <tr>

            <td>
                <span class="badge bg-secondary">
                    ${p.idProducto}
                </span>
            </td>

            <td class="fw-semibold">
                ${p.nombre}
            </td>

            <td>

                <img
                    src="${p.imagen}"
                    onerror="this.src='img/producto-default.png'"
                    class="rounded shadow-sm"
                    width="70"
                    height="70"
                    style="object-fit:cover;">

            </td>

            <td>${p.marca}</td>

            <td>
                <code>${p.codigoProducto}</code>
            </td>

            <td>
                Bs. ${parseFloat(p.precioCompra).toFixed(2)}
            </td>

            <td class="fw-bold text-success">
                Bs. ${parseFloat(p.precioVenta).toFixed(2)}
            </td>

            <td>

                ${p.activo
                ? `<span class="badge bg-success">Activo</span>`
                : `<span class="badge bg-danger">Inactivo</span>`
            }

            </td>

            <td class="text-center">

                <button
                    class="btn btn-warning btn-sm me-1"
                    onclick="editarProducto(${p.idProducto})">

                    <i class="bi bi-pencil-square"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarProducto(${p.idProducto})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `;

    document.getElementById("productos").innerHTML = html;
}

async function cargarInventario() {

    const response = await fetch(`${API}/inventarios`);
    const inventario = await response.json();

    let html = `

    <div class="card shadow-sm border-0">

        <div class="card-header bg-success text-white">

            <h4 class="mb-0">
                <i class="bi bi-boxes"></i>
                Control de Inventario
            </h4>

        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th>Producto</th>
                            <th class="text-center">Stock Actual</th>
                            <th class="text-center">Stock Mínimo</th>
                            <th class="text-center">Estado</th>

                        </tr>

                    </thead>

                    <tbody>

    `;

    inventario.forEach(i => {

        const stockBajo = i.stockActual <= i.stockMinimo;

        html += `

        <tr>

            <td class="fw-semibold">
                ${i.producto.nombre}
            </td>

            <td class="text-center">

                <span class="badge ${stockBajo ? 'bg-danger' : 'bg-success'} fs-6">

                    ${i.stockActual}

                </span>

            </td>

            <td class="text-center">

                <span class="badge bg-warning text-dark fs-6">

                    ${i.stockMinimo}

                </span>

            </td>

            <td class="text-center">

                ${
                    stockBajo
                    ? '<span class="badge bg-danger">Stock Bajo</span>'
                    : '<span class="badge bg-success">Disponible</span>'
                }

            </td>

        </tr>

        `;

    });

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `;

    document.getElementById("inventario").innerHTML = html;
}


async function cargarClientes() {

    const response = await fetch(`${API}/clientes`);
    const clientes = await response.json();

    let html = `

    <div class="card shadow-sm border-0">

        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">

            <h4 class="mb-0">
                <i class="bi bi-people-fill"></i>
                Gestión de Clientes
            </h4>

            <button
                class="btn btn-light"
                onclick="abrirModalCliente()">

                <i class="bi bi-plus-circle-fill"></i>
                Nuevo Cliente

            </button>

        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th class="text-center">Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

    `;

    clientes.forEach(c => {

        html += `

        <tr>

            <td>
                <span class="badge bg-secondary">
                    ${c.idCliente}
                </span>
            </td>

            <td class="fw-semibold">
                ${c.usuario.nombre} ${c.usuario.apellido}
            </td>

            <td>
                <i class="bi bi-telephone-fill me-1"></i>
                ${c.telefono}
            </td>

            <td>
                <i class="bi bi-geo-alt-fill me-1"></i>
                ${c.direccion}
            </td>

            <td>

                ${c.activo
                    ? '<span class="badge bg-success">Activo</span>'
                    : '<span class="badge bg-danger">Inactivo</span>'
                }

            </td>

            <td class="text-center">

                <button
                    class="btn btn-warning btn-sm me-1"
                    onclick="editarCliente(${c.idCliente})">

                    <i class="bi bi-pencil-square"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarCliente(${c.idCliente})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `;

    document.getElementById("clientes").innerHTML = html;
}

async function cargarProveedores() {

    const response = await fetch(`${API}/proveedores`);
    const proveedores = await response.json();

    let html = `

    <div class="card shadow-sm border-0">

        <div class="card-header bg-info text-white">

            <h4 class="mb-0">
                <i class="bi bi-truck"></i>
                Gestión de Proveedores
            </h4>

        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th>ID</th>
                            <th>Nombre Empresa</th>
                            <th>Correo Electrónico</th>

                        </tr>

                    </thead>

                    <tbody>

    `;

    proveedores.forEach(p => {

        html += `

        <tr>

            <td>
                <span class="badge bg-secondary">
                    ${p.idProveedor}
                </span>
            </td>

            <td class="fw-semibold">
                <i class="bi bi-building me-1"></i>
                ${p.nombreEmpresa}
            </td>

            <td>
                <i class="bi bi-envelope-fill me-1"></i>
                ${p.email}
            </td>

        </tr>

        `;

    });

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `;

    document.getElementById("proveedores").innerHTML = html;
}

async function cargarUsuarios() {

    const response = await fetch(`${API}/usuarios`);
    const usuarios = await response.json();

    let html = `

    <div class="card shadow-sm border-0">

        <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">

            <h4 class="mb-0">
                <i class="bi bi-person-gear"></i>
                Gestión de Usuarios
            </h4>

            <button
                class="btn btn-light"
                onclick="abrirModalUsuario()">

                <i class="bi bi-plus-circle-fill"></i>
                Nuevo Usuario

            </button>

        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th class="text-center">Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

    `;

    usuarios.forEach(u => {

        html += `

        <tr>

            <td>
                <span class="badge bg-secondary">
                    ${u.idUsuario}
                </span>
            </td>

            <td class="fw-semibold">
                ${u.nombre}
            </td>

            <td>
                ${u.apellido}
            </td>

            <td>
                <i class="bi bi-envelope-fill me-1"></i>
                ${u.email}
            </td>

            <td>

                ${u.activo
                    ? '<span class="badge bg-success">Activo</span>'
                    : '<span class="badge bg-danger">Inactivo</span>'
                }

            </td>

            <td class="text-center">

                <button
                    class="btn btn-warning btn-sm me-1"
                    onclick="editarUsuario(${u.idUsuario})">

                    <i class="bi bi-pencil-square"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarUsuario(${u.idUsuario})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `;

    document.getElementById("usuarios").innerHTML = html;
}


async function cargarEmpleados() {

    const response = await fetch(`${API}/empleados`);
    const empleados = await response.json();

    let html = `

    <div class="card shadow-sm border-0">

        <div class="card-header bg-warning d-flex align-items-center">

            <h4 class="mb-0">
                <i class="bi bi-person-badge-fill"></i>
                Gestión de Empleados
            </h4>

        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th>ID</th>
                            <th>Empleado</th>
                            <th>Cargo</th>

                        </tr>

                    </thead>

                    <tbody>

    `;

    empleados.forEach(e => {

        html += `

        <tr>

            <td>
                <span class="badge bg-secondary">
                    ${e.idEmpleado}
                </span>
            </td>

            <td class="fw-semibold">
                ${e.usuario.nombre} ${e.usuario.apellido}
            </td>

            <td>
                <span class="badge bg-warning text-dark">
                    ${e.cargo}
                </span>
            </td>

        </tr>

        `;

    });

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `;

    document.getElementById("empleados").innerHTML = html;
}




async function cargarCombosVenta() {

    const empleados =
        await fetch(`${API}/empleados`)
            .then(r => r.json());

    const productos =
        await fetch(`${API}/productos`)
            .then(r => r.json());

    const empleadoSelect =
        document.getElementById("empleadoVenta");

    const productoSelect =
        document.getElementById("productoVenta");

    empleadoSelect.innerHTML = "";
    productoSelect.innerHTML = "";

    empleados.forEach(e => {

        empleadoSelect.innerHTML += `

        <option value="${e.idEmpleado}">

            ${e.usuario.nombre} ${e.usuario.apellido}

        </option>

        `;

    });

    productos.forEach(p => {

        productoSelect.innerHTML += `

        <option value="${p.idProducto}">

            ${p.nombre}

        </option>

        `;

    });

}
function agregarProductoVenta() {

    const producto =
        document.getElementById("productoVenta");

    const cantidad =
        document.getElementById("cantidadVenta");

    detallesVenta.push({

        idProducto:
            Number(producto.value),

        cantidad:
            Number(cantidad.value)

    });

    document
        .getElementById("detalleVenta")
        .innerHTML +=

        `
        <tr>

            <td>
                ${producto.options[
            producto.selectedIndex
        ].text}
            </td>

            <td>
                ${cantidad.value}
            </td>

        </tr>
        `;
}
async function registrarVenta() {

    try {

        const venta = {

            idEmpleado:

                Number(
                    document.getElementById(
                        "empleadoVenta"
                    ).value
                ),

            descuento:

                Number(
                    document.getElementById(
                        "descuentoVenta"
                    ).value
                ),

            observaciones:

                document.getElementById(
                    "observacionVenta"
                ).value,

            detalles:

                detallesVenta

        };

        const response =
            await fetch(
                `${API}/ventas/registrar`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(venta)
                }
            );

        if (response.ok) {

            alert(
                "Venta registrada correctamente"
            );

            detallesVenta = [];

            document
                .getElementById("detalleVenta")
                .innerHTML = "";

            cargarInventario();

        } else {

            const error =
                await response.text();

            alert(error);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Error al registrar venta"
        );

    }

}


async function buscarProducto() {

    const texto =
        document
            .getElementById("buscarProducto")
            .value;

    if (texto.trim() === "") {

        cargarProductos();
        return;

    }

    const response =
        await fetch(
            `${API}/productos/buscar/${texto}`
        );

    const productos =
        await response.json();

    let html = `

    <h2 class="mb-4">
        Productos
    </h2>

    <div class="mb-3">

        <input
            type="text"
            id="buscarProducto"
            class="form-control"
            value="${texto}"
            placeholder="Buscar producto..."
            onkeyup="buscarProducto()">

    </div>

    <table class="table table-striped">

        <thead>

            <tr>

                <th>ID</th>
                <th>Producto</th>
                <th>Marca</th>
                <th>Precio</th>

            </tr>

        </thead>

        <tbody>

    `;

    productos.forEach(p => {

        html += `

        <tr>

            <td>${p.idProducto}</td>

            <td>${p.nombre}</td>

            <td>${p.marca}</td>

            <td>${p.precioVenta}</td>

        </tr>

        `;

    });

    html += `

        </tbody>

    </table>

    `;

    document
        .getElementById("productos")
        .innerHTML = html;
    setTimeout(() => {

        const input =
            document.getElementById("buscarProducto");

        input.focus();
        input.setSelectionRange(
            input.value.length,
            input.value.length
        );

    }, 10);

}


async function cargarCombosCompra() {

    const proveedores =
        await fetch(`${API}/proveedores`)
            .then(r => r.json());

    const productos =
        await fetch(`${API}/productos`)
            .then(r => r.json());

    const proveedorSelect =
        document.getElementById("proveedorCompra");

    const productoSelect =
        document.getElementById("productoCompra");

    proveedorSelect.innerHTML = "";
    productoSelect.innerHTML = "";

    proveedores.forEach(p => {

        proveedorSelect.innerHTML += `

        <option value="${p.idProveedor}">
            ${p.nombreEmpresa}
        </option>

        `;

    });

    productos.forEach(p => {

        productoSelect.innerHTML += `

        <option value="${p.idProducto}">
            ${p.nombre}
        </option>

        `;

    });

}

function agregarProductoCompra() {

    const producto =
        document.getElementById("productoCompra");

    const cantidad =
        Number(
            document.getElementById(
                "cantidadCompra"
            ).value
        );

    const costo =
        Number(
            document.getElementById(
                "costoCompra"
            ).value
        );

    const subtotal =
        cantidad * costo;

    detallesCompra.push({

        idProducto:
            Number(producto.value),

        cantidad:
            cantidad,

        costoUnitario:
            costo

    });

    document
        .getElementById("detalleCompra")
        .innerHTML += `

        <tr>

            <td>
                ${producto.options[
            producto.selectedIndex
        ].text}
            </td>

            <td>${cantidad}</td>

            <td>${costo}</td>

            <td>${subtotal}</td>

        </tr>

    `;

}
async function registrarCompra() {

    try {

        const compra = {

            idProveedor:

                Number(
                    document.getElementById(
                        "proveedorCompra"
                    ).value
                ),

            detalles:

                detallesCompra

        };

        const response =
            await fetch(
                `${API}/compras/registrar`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(compra)
                }
            );

        if (response.ok) {

            alert(
                "Compra registrada correctamente"
            );

            detallesCompra = [];

            document
                .getElementById("detalleCompra")
                .innerHTML = "";

            cargarInventario();

        } else {

            const error =
                await response.text();

            alert(error);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Error al registrar compra"
        );

    }

}
async function abrirModalProducto() {
    productoEditando = null;
    document.getElementById("idProducto").value = "";

    document.getElementById("nombreProducto").value = "";

    document.getElementById("marcaProducto").value = "";

    document.getElementById("codigoProducto").value = "";

    document.getElementById("precioCompraProducto").value = "";

    document.getElementById("precioVentaProducto").value = "";

    document.getElementById("descripcionProducto").value = "";

    const categorias =
        await fetch(`${API}/categorias`)
            .then(r => r.json());

    const select =
        document.getElementById("categoriaProducto");

    select.innerHTML = "";

    categorias.forEach(c => {

        select.innerHTML += `

            <option value="${c.idCategoria}">
                ${c.nombre}
            </option>

        `;

    });

    new bootstrap.Modal(
        document.getElementById("modalProducto")
    ).show();
}
async function guardarProducto() {

    const id =
        document.getElementById("idProducto").value;

    const producto = {

        ...productoEditando,

        categoria: {

            idCategoria:
                Number(
                    document.getElementById(
                        "categoriaProducto"
                    ).value
                )

        },

        nombre:
            document.getElementById(
                "nombreProducto"
            ).value,

        descripcion:
            document.getElementById(
                "descripcionProducto"
            ).value,

        precioCompra:
            Number(
                document.getElementById(
                    "precioCompraProducto"
                ).value
            ),

        precioVenta:
            Number(
                document.getElementById(
                    "precioVentaProducto"
                ).value
            ),

        codigoProducto:
            document.getElementById(
                "codigoProducto"
            ).value,

        marca:
            document.getElementById(
                "marcaProducto"
            ).value

    };

    let url =
        `${API}/productos`;

    let metodo =
        "POST";

    if (id) {

        url =
            `${API}/productos/${id}`;

        metodo =
            "PUT";
    }

    const response =
        await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(producto)

        });

    if (response.ok) {

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "modalProducto"
                )
            )
            .hide();

        cargarProductos();

        alert(
            "Producto guardado correctamente"
        );

    } else {

        alert(
            "Error al guardar producto"
        );

    }
}
async function editarProducto(id) {

    const producto =
        await fetch(
            `${API}/productos/${id}`
        ).then(r => r.json());
    productoEditando = producto;
    await abrirModalProducto();
    document.getElementById(
        "idProducto"
    ).value =
        producto.idProducto;

    document.getElementById(
        "nombreProducto"
    ).value =
        producto.nombre;

    document.getElementById(
        "marcaProducto"
    ).value =
        producto.marca;

    document.getElementById(
        "codigoProducto"
    ).value =
        producto.codigoProducto;

    document.getElementById(
        "precioCompraProducto"
    ).value =
        producto.precioCompra;

    document.getElementById(
        "precioVentaProducto"
    ).value =
        producto.precioVenta;

    document.getElementById(
        "descripcionProducto"
    ).value =
        producto.descripcion;

    document.getElementById(
        "categoriaProducto"
    ).value =
        producto.categoria.idCategoria;

}
async function eliminarProducto(id) {

    const confirmar =
        confirm(
            "¿Desea desactivar este producto?"
        );

    if (!confirmar) return;

    const response =
        await fetch(
            `${API}/productos/${id}`,
            {
                method: "DELETE"
            }
        );

    if (response.ok) {

        alert(
            "Producto desactivado"
        );

        cargarProductos();

    } else {

        alert(
            "No se pudo eliminar"
        );

    }
}
async function cargarEmpleados() {
    const response = await fetch(`${API}/empleados`);
    const empleados = await response.json();

    let html = `
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Rol</th>
                <th>Salario</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
    `;

    empleados.forEach(e => {
        html += `
        <tr>
            <td>${e.idEmpleado}</td>
            <td>${e.usuario.nombre} ${e.usuario.apellido}</td>
            <td>${e.cargo}</td>
            <td>${e.rol}</td>
            <td>Bs. ${e.salario}</td>
            <td>
                ${e.activo
                ? `<span class="estado activo">Activo</span>`
                : `<span class="estado inactivo">Inactivo</span>`}
            </td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarEmpleado(${e.idEmpleado})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${e.idEmpleado})">Eliminar</button>
            </td>
        </tr>
        `;
    });

    html += `</tbody></table>`;
    document.getElementById("tablaEmpleados").innerHTML = html;
}

// Modal y funciones de manejo para empleados
async function abrirModalEmpleado() {

    if (!empleadoEditando) {

        document.getElementById("idEmpleado").value = "";
        document.getElementById("cargoEmpleado").value = "";
        document.getElementById("rolEmpleado").value = "";
        document.getElementById("salarioEmpleado").value = "";
    }

    const usuarios =
        await fetch(`${API}/usuarios`)
            .then(r => r.json());

    const select =
        document.getElementById("usuarioEmpleado");

    select.innerHTML = "";

    usuarios.forEach(u => {

        select.innerHTML += `
            <option value="${u.idUsuario}">
                ${u.nombre} ${u.apellido}
            </option>
        `;

    });

    new bootstrap.Modal(
        document.getElementById("modalEmpleado")
    ).show();
}

async function guardarEmpleado() {

    const id =
        document.getElementById("idEmpleado").value;

    const empleado = {

        ...empleadoEditando,

        usuario: {

            idUsuario:
                Number(
                    document.getElementById(
                        "usuarioEmpleado"
                    ).value
                )

        },

        cargo:
            document.getElementById(
                "cargoEmpleado"
            ).value,

        rol:
            document.getElementById(
                "rolEmpleado"
            ).value,

        salario:
            Number(
                document.getElementById(
                    "salarioEmpleado"
                ).value
            )

    };

    let url = `${API}/empleados`;
    let metodo = "POST";

    if (id) {

        url = `${API}/empleados/${id}`;
        metodo = "PUT";
    }

    const response =
        await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(empleado)

        });

    if (response.ok) {

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "modalEmpleado"
                )
            )
            .hide();

        empleadoEditando = null;

        cargarEmpleados();

        alert(
            "Empleado guardado correctamente"
        );

    } else {

        alert(
            "Error al guardar empleado"
        );
    }
}

async function editarEmpleado(id) {

    const empleado =
        await fetch(
            `${API}/empleados/${id}`
        ).then(r => r.json());

    empleadoEditando = empleado;

    await abrirModalEmpleado();

    document.getElementById("idEmpleado").value =
        empleado.idEmpleado;

    document.getElementById("usuarioEmpleado").value =
        empleado.usuario.idUsuario;

    document.getElementById("cargoEmpleado").value =
        empleado.cargo;

    document.getElementById("rolEmpleado").value =
        empleado.rol;

    document.getElementById("salarioEmpleado").value =
        empleado.salario;
}

async function eliminarEmpleado(id) {
    const confirmar = confirm("¿Desea desactivar este empleado?");
    if (!confirmar) return;

    const response = await fetch(`${API}/empleados/${id}`, { method: "DELETE" });

    if (response.ok) {
        alert("Empleado desactivado");
        cargarEmpleados();
    } else {
        alert("No se pudo eliminar");
    }
}
async function abrirModalUsuario() {

    usuarioEditando = null;

    document.getElementById("idUsuario").value = "";
    document.getElementById("nombreUsuario").value = "";
    document.getElementById("apellidoUsuario").value = "";
    document.getElementById("ciUsuario").value = "";
    document.getElementById("emailUsuario").value = "";
    document.getElementById("passwordUsuario").value = "";

    new bootstrap.Modal(
        document.getElementById("modalUsuario")
    ).show();
}
async function guardarUsuario() {

    const id =
        document.getElementById("idUsuario").value;

    const usuario = {

        ...usuarioEditando,

        nombre:
            document.getElementById("nombreUsuario").value,

        apellido:
            document.getElementById("apellidoUsuario").value,

        ci:
            document.getElementById("ciUsuario").value,

        email:
            document.getElementById("emailUsuario").value,

        password:
            document.getElementById("passwordUsuario").value

    };

    let url =
        `${API}/usuarios`;

    let metodo =
        "POST";

    if (id) {

        url =
            `${API}/usuarios/${id}`;

        metodo =
            "PUT";
    }

    const response =
        await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

    if (response.ok) {

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "modalUsuario"
                )
            )
            .hide();

        cargarUsuarios();

        alert("Usuario guardado");

    }
}
async function editarUsuario(id) {

    const usuario =
        await fetch(
            `${API}/usuarios/${id}`
        ).then(r => r.json());

    usuarioEditando =
        usuario;

    await abrirModalUsuario();

    usuarioEditando =
        usuario;

    document.getElementById("idUsuario").value =
        usuario.idUsuario;

    document.getElementById("nombreUsuario").value =
        usuario.nombre;

    document.getElementById("apellidoUsuario").value =
        usuario.apellido;

    document.getElementById("ciUsuario").value =
        usuario.ci;

    document.getElementById("emailUsuario").value =
        usuario.email;

    document.getElementById("passwordUsuario").value =
        usuario.password;
}
async function eliminarUsuario(id) {

    if (!confirm("¿Desactivar usuario?"))
        return;

    const response =
        await fetch(
            `${API}/usuarios/${id}`,
            {
                method: "DELETE"
            }
        );

    if (response.ok) {

        cargarUsuarios();

        alert("Usuario desactivado");

    }
}
async function abrirModalCliente() {

    clienteEditando = null;

    document.getElementById("idCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("direccionCliente").value = "";

    const usuarios =
        await fetch(`${API}/usuarios`)
            .then(r => r.json());

    const select =
        document.getElementById("usuarioCliente");

    select.innerHTML = "";

    usuarios.forEach(u => {

        select.innerHTML += `

        <option value="${u.idUsuario}">

            ${u.nombre} ${u.apellido}

        </option>

        `;

    });

    new bootstrap.Modal(
        document.getElementById("modalCliente")
    ).show();
}
async function guardarCliente() {

    const id =
        document.getElementById("idCliente").value;

    const cliente = {

        ...clienteEditando,

        usuario: {

            idUsuario:
                Number(
                    document.getElementById(
                        "usuarioCliente"
                    ).value
                )

        },

        telefono:
            document.getElementById(
                "telefonoCliente"
            ).value,

        direccion:
            document.getElementById(
                "direccionCliente"
            ).value

    };

    let url =
        `${API}/clientes`;

    let metodo =
        "POST";

    if (id) {

        url =
            `${API}/clientes/${id}`;

        metodo =
            "PUT";
    }

    const response =
        await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(cliente)

        });

    if (response.ok) {

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "modalCliente"
                )
            )
            .hide();

        cargarClientes();

        alert(
            "Cliente guardado"
        );

    } else {

        alert(
            "Error al guardar cliente"
        );

    }
}
async function editarCliente(id) {

    const cliente =
        await fetch(
            `${API}/clientes/${id}`
        ).then(r => r.json());

    clienteEditando =
        cliente;

    await abrirModalCliente();

    clienteEditando =
        cliente;

    document.getElementById(
        "idCliente"
    ).value =
        cliente.idCliente;

    document.getElementById(
        "usuarioCliente"
    ).value =
        cliente.usuario.idUsuario;

    document.getElementById(
        "telefonoCliente"
    ).value =
        cliente.telefono;

    document.getElementById(
        "direccionCliente"
    ).value =
        cliente.direccion;
}
async function eliminarCliente(id) {

    if (
        !confirm(
            "¿Desactivar cliente?"
        )
    ) return;

    const response =
        await fetch(
            `${API}/clientes/${id}`,
            {
                method: "DELETE"
            }
        );

    if (response.ok) {

        cargarClientes();

        alert(
            "Cliente desactivado"
        );

    }
}