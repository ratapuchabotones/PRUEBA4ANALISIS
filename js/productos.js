async function cargarProductos(){

const response = await fetch(`${API}/productos`);

const productos = await response.json();

let filas = "";

productos.forEach(p=>{

filas += `

<tr>

<td>${p.idProducto}</td>

<td>${p.nombre}</td>

<td>${p.marca}</td>

<td>${p.precio}</td>

<td>${p.estado}</td>

</tr>

`;

});

document.getElementById("contenido").innerHTML = `

<h2 class="mb-4">Productos</h2>

<table class="table table-bordered">

<thead>

<tr>

<th>ID</th>
<th>Nombre</th>
<th>Marca</th>
<th>Precio</th>
<th>Estado</th>

</tr>

</thead>

<tbody>

${filas}

</tbody>

</table>

`;

}