async function cargarInventario(){

const response = await fetch(`${API}/inventarios`);

const inventarios = await response.json();

let filas = "";

inventarios.forEach(i=>{

let estado="Normal";

if(i.stockActual<=i.stockMinimo){

estado="Crítico";

}

filas += `

<tr>

<td>${i.producto.nombre}</td>

<td>${i.stockActual}</td>

<td>${i.stockMinimo}</td>

<td>${estado}</td>

</tr>

`;

});

document.getElementById("contenido").innerHTML = `

<h2 class="mb-4">Inventario</h2>

<button
class="btn btn-dismac mb-3"
onclick="stockBajo()">

Ver Stock Bajo

</button>

<table class="table table-bordered">

<thead>

<tr>

<th>Producto</th>
<th>Stock Actual</th>
<th>Stock Mínimo</th>
<th>Estado</th>

</tr>

</thead>

<tbody>

${filas}

</tbody>

</table>

`;

}

async function stockBajo(){

const response =
await fetch(`${API}/inventarios/stockbajo`);

const datos =
await response.json();

console.log(datos);

}