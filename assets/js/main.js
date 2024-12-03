// Elementos del DOM
let dineroTotalElem = document.getElementById("dinero-total");
let ingresosTotalElem = document.getElementById("ingresos-total");
let gastosTotalElem = document.getElementById("gastos-total");
let formulario = document.getElementById("formulario");
let opciones = document.getElementById("opciones");
let descripcion = document.getElementById("descripcion");
let cantidad = document.getElementById("cantidad");
let ingresoNuevo = document.getElementById("ingreso-nuevo");
let gastoNuevo = document.getElementById("gasto-nuevo");

// Variables globales
let dineroTotal = 0.00;
let ingresosTotal = 0.00;
let gastosTotal = 0.00;




// Función para validar el formulario
function validar() {
    cantidad.value = cantidad.value.replace(",", ".");
    const cantidadVal = parseFloat(cantidad.value);
    

    console.log("Valor de cantidad (tras reemplazo y parseFloat):", cantidadVal);

    // Validar que los campos no estén vacíos y que cantidad sea un número válido y mayor a 0
    if (
        descripcion.value.trim() === "" ||  
        isNaN(cantidadVal) ||
        cantidadVal <= 0
    ) {
        alert("Debes llenar todos los campos correctamente y usar un número válido para la cantidad.");
        return false;
    }

    return true;
}

// Función para calcular y actualizar valores
function calcular() {
    const tipo = opciones.value;
    const descripcionVal = descripcion.value.trim();
    const cantidadVal = parseFloat(cantidad.value); // Convertir cantidad a número flotante


    if (tipo === "ingreso") {
        ingresosTotal += cantidadVal;
        dineroTotal += cantidadVal;
        agregarATabla("ingreso", descripcionVal, cantidadVal);
    } else {
        gastosTotal += cantidadVal;
        dineroTotal -= cantidadVal;
        agregarATabla("gasto", descripcionVal, cantidadVal);
    }

    // Limpiar los inputs después de procesar
    descripcion.value = "";
    cantidad.value = "";

    // Actualizar la interfaz
    actualizarUI();
}

// Función para actualizar los valores en la interfaz
function actualizarUI() {
    dineroTotalElem.textContent = `${dineroTotal.toFixed(2)}€`;
    ingresosTotalElem.textContent = `${ingresosTotal.toFixed(2)}€`;
    gastosTotalElem.textContent = `${gastosTotal.toFixed(2)}€`;
}


// Función para agregar un registro a la tabla
function agregarATabla(tipo, descripcion, cantidad) {
    const nuevaFila = document.createElement("tr");

    // Crear celdas para descripción, cantidad y botón de eliminar
    nuevaFila.innerHTML = `
        <td>${descripcion}</td>
        <td>${cantidad}€</td>
        <td><button class="btn-eliminar">🗑️</button></td>
    `;

    // Agregar la fila a la tabla correspondiente
    if (tipo === "ingreso") {
        ingresoNuevo.appendChild(nuevaFila);
    } else {
        gastoNuevo.appendChild(nuevaFila);
    }

    // Manejar la eliminación del registro
    nuevaFila.querySelector(".btn-eliminar").addEventListener("click", () => {
        if (tipo === "ingreso") {
            ingresosTotal -= cantidad;
            dineroTotal -= cantidad;
        } else {
            gastosTotal -= cantidad;
            dineroTotal += cantidad;
        }

        // Actualizar la interfaz y eliminar la fila
        actualizarUI();
        nuevaFila.remove();

        // Guardar los cambios en localStorage
        guardar();
    });
}

// Función para guardar los datos en el localStorage
function guardar() {
    const datos = {
        dineroTotal,
        ingresosTotal,
        gastosTotal,
        registros: {
            ingresos: Array.from(ingresoNuevo.children).map((row) => ({
                descripcion: row.children[0].textContent,
                cantidad: parseFloat(row.children[1].textContent.replace("€", "")), // Eliminar el símbolo de moneda
            })),
            gastos: Array.from(gastoNuevo.children).map((row) => ({
                descripcion: row.children[0].textContent,
                cantidad: parseFloat(row.children[1].textContent.replace("€", "")), // Eliminar el símbolo de moneda
            })),
        },
    };

    

    localStorage.setItem("gestorDatos", JSON.stringify(datos));
}

// Función para cargar los datos del localStorage
function cargar() {
    const datos = JSON.parse(localStorage.getItem("gestorDatos"));


    if (datos) {
        dineroTotal = datos.dineroTotal || 0;
        ingresosTotal = datos.ingresosTotal || 0;
        gastosTotal = datos.gastosTotal || 0;

        actualizarUI();

        datos.registros.ingresos.forEach((ingreso) =>
            agregarATabla("ingreso", ingreso.descripcion, ingreso.cantidad)
        );
        datos.registros.gastos.forEach((gasto) =>
            agregarATabla("gasto", gasto.descripcion, gasto.cantidad)
        );
    }
}

// Manejar el envío del formulario
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validar()) {
        calcular();
        guardar();
    }
});

// Cargar datos al iniciar la página
cargar();
