
// 1. Inicializa el carrito leyendo desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botonesComprar = document.querySelectorAll('.boton-comprar');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarritoElemento = document.getElementById('total-carrito');
const botonVaciar = document.getElementById('boton-vaciar');
const botonComprarFinal = document.getElementById('boton-comprar-final');
const resumenCarrito = document.getElementById('resumen-carrito');

// ------ FUNCIÓN PARA MOSTRAR MENSAJES FLOTANTES ------
function mostrarMensaje(texto, colorFondo) {
    const msg = document.createElement("div");
    msg.textContent = texto;
    msg.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${colorFondo}; padding: 10px 15px; color: white; border-radius: 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.3); z-index: 1000;`;
    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), 1500);
}

// ------ CALCULAR TOTAL ------
function calcularTotal() {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    totalCarritoElemento.textContent = `Total: Bs. ${total.toFixed(2)}`;
    return total;
}

// ------ ELIMINAR PRODUCTO individualmente ------
function eliminarProducto(index) {
    const nombreProducto = carrito[index].nombre;
    
    // Elimina 1 elemento en la posición 'index'
    carrito.splice(index, 1);
    
    // Actualiza el almacenamiento y la vista
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    
    // MUESTRA MENSAJE DE ELIMINACIÓN
    mostrarMensaje(`❌ ${nombreProducto} eliminado`, '#dc3545'); // Rojo
}

// ------ ACTUALIZAR VISTA DEL CARRITO ------
function actualizarCarrito() {
    calcularTotal(); 
    
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li>No hay productos añadidos.</li>';
        resumenCarrito.style.display = 'none';
        return;
    }
    
    resumenCarrito.style.display = 'block';

    // Genera la lista de productos con botón de eliminar estilizado como botón
    listaCarrito.innerHTML = carrito
        .map((p, i) => {
            return `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                    <span>${p.nombre} - Bs. ${p.precio.toFixed(2)}</span>
                    <a href="#" class="boton-eliminar-item" data-indice="${i}" 
                       style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 0.8em; margin-left: 10px;">
                       Eliminar
                    </a>
                </li>
            `;
        })
        .join("");

    // Asigna el evento click a los botones de eliminar recién creados
    document.querySelectorAll(".boton-eliminar-item").forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const index = parseInt(e.target.getAttribute("data-indice"));
            eliminarProducto(index);
        });
    });
}

// ------ LÓGICA DE AÑADIR PRODUCTO ------
botonesComprar.forEach(boton => {
    boton.addEventListener('click', () => {
        const nombre = boton.dataset.nombre;
        const precio = parseFloat(boton.dataset.precio);

        carrito.push({ nombre, precio });
        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        // MUESTRA MENSAJE DE AÑADIR
        mostrarMensaje(`✔ ${nombre} añadido`, '#0a84ff'); // Azul

        actualizarCarrito();
    });
});

// ------ VACIAR CARRITO completo ------
botonVaciar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        mostrarMensaje("🛒 Carrito vaciado", '#dc3545');
    }
});

// ------ FINALIZAR COMPRA ------
botonComprarFinal.addEventListener("click", () => {
    if (carrito.length > 0) {
        const total = calcularTotal().toFixed(2);
        alert(`¡Gracias por tu compra en SportApz! Tu total a pagar es: Bs. ${total}`);
        
        // Vacía el carrito después de la compra
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    } else {
        alert("Tu carrito está vacío. Añade productos para finalizar la compra.");
    }
});


// ------ INICIALIZAR LA VISTA AL CARGAR LA PÁGINA ------
actualizarCarrito();


