 // Inicializa el carrito leyendo desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botonesComprar = document.querySelectorAll('.boton-comprar');
const listaProductosCarrito = document.getElementById('lista-productos-carrito');
const totalCarritoElemento = document.getElementById('total-carrito');
const resumenCarrito = document.getElementById('resumen-carrito');
const botonVaciar = document.getElementById('boton-vaciar');
const botonComprarFinal = document.getElementById('boton-comprar-final');

// ------ CALCULAR TOTAL ------
function calcularTotal() {
    // Suma todos los precios del carrito
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    totalCarritoElemento.textContent = `Total: Bs. ${total.toFixed(2)}`;
}

// ------ ELIMINAR PRODUCTO individualmente ------
function eliminarProducto(e) {
    // Obtiene el índice del producto a eliminar
    const indice = e.target.getAttribute("data-indice");
    // Elimina 1 elemento en la posición 'indice'
    carrito.splice(indice, 1);
    
    // Actualiza el almacenamiento y la vista
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

// ------ ACTUALIZAR VISTA DEL CARRITO ------
function actualizarCarrito() {
    // Si el carrito está vacío
    if (carrito.length === 0) {
        listaProductosCarrito.innerHTML = "<p>No hay productos añadidos.</p>";
        resumenCarrito.style.display = 'none'; // Oculta botones y total
        calcularTotal();
        return;
    }
    
    // Si hay productos, muestra la lista y los botones de acción
    resumenCarrito.style.display = 'block';

    // Genera el HTML de la lista de productos con botón de eliminar
    listaProductosCarrito.innerHTML = carrito
        .map((p, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span>• ${p.nombre} - Bs. ${p.precio.toFixed(2)}</span>
                <a class="boton-eliminar" data-indice="${i}" style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em; text-decoration: none;">X Eliminar</a>
            </div>
        `)
        .join("");

    // Asigna el evento click a los botones de eliminar recién creados
    document.querySelectorAll(".boton-eliminar").forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });

    calcularTotal();
}

// ------ LÓGICA DE AÑADIR PRODUCTO ------
botonesComprar.forEach(boton => {
    boton.addEventListener('click', () => {
        const nombre = boton.dataset.nombre;
        // Convierte el precio a número
        const precio = parseFloat(boton.dataset.precio);

        // Añade el producto al carrito
        carrito.push({ nombre, precio });
        
        // Guarda el carrito en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));

        // Muestra mensaje flotante
        const msg = document.createElement("div");
        msg.textContent = `✔ ${nombre} añadido al carrito`;
        msg.style.position = "fixed";
        msg.style.top = "20px";
        msg.style.right = "20px";
        msg.style.background = "#0a84ff";
        msg.style.padding = "10px 15px";
        msg.style.color = "white";
        msg.style.borderRadius = "6px";
        msg.style.boxShadow = "0 3px 6px rgba(0,0,0,0.3)";
        document.body.appendChild(msg);

        setTimeout(() => msg.remove(), 1500);

        // Actualiza la vista del carrito
        actualizarCarrito();
    });
});

// ------ VACIAR CARRITO completo ------
botonVaciar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        alert("El carrito ha sido vaciado.");
    }
});

// ------ FINALIZAR COMPRA ------
botonComprarFinal.addEventListener("click", () => {
    if (carrito.length > 0) {
        // Recalcula el total final por seguridad
        const total = carrito.reduce((sum, p) => sum + p.precio, 0).toFixed(2);
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

