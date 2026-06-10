async function cargarDashboard(){

const response = await fetch(`${API}/dashboard`);

const data = await response.json();

document.getElementById("contenido").innerHTML = `

<h2 class="mb-4">Dashboard</h2>

<div class="row g-4">

<div class="col-md-4">
<div class="card-dashboard">
<h5>Productos</h5>
<h2>${data.productos}</h2>
</div>
</div>

<div class="col-md-4">
<div class="card-dashboard">
<h5>Clientes</h5>
<h2>${data.clientes}</h2>
</div>
</div>

<div class="col-md-4">
<div class="card-dashboard">
<h5>Ventas</h5>
<h2>${data.ventas}</h2>
</div>
</div>

<div class="col-md-4">
<div class="card-dashboard">
<h5>Compras</h5>
<h2>${data.compras}</h2>
</div>
</div>

<div class="col-md-4">
<div class="card-dashboard">
<h5>Proveedores</h5>
<h2>${data.proveedores}</h2>
</div>
</div>

<div class="col-md-4">
<div class="card-dashboard">
<h5>Empleados</h5>
<h2>${data.empleados}</h2>
</div>
</div>

</div>

`;

}

window.onload=cargarDashboard;