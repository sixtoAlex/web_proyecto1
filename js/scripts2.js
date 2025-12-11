
// ------ CARRITO ------
// Almacena el precio como número para facilitar los cálculos
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botonesComprar = document.querySelectorAll(".boton-comprar");
const listaCarrito = document.getElementById("lista-carrito");
const totalCompra = document.getElementById("total-compra");
const botonVaciar = document.getElementById("boton-vaciar");
const botonComprarFinal = document.getElementById("boton-comprar-final");

// ------ CALCULAR TOTAL ------
function calcularTotal() {
    const total = carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0);
    totalCompra.textContent = `Total: Bs. ${total.toFixed(2)}`;
}

// ------ ACTUALIZAR VISTA ------
function actualizarCarrito() {
    // Si el carrito está vacío, muestra el mensaje y esconde los botones de acción
    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay productos añadidos.</p>";
        document.getElementById("resumen-carrito").style.display = 'none';
        calcularTotal();
        return;
    }
    
    // Si hay productos, muestra la lista y los botones de acción
    document.getElementById("resumen-carrito").style.display = 'block';

    // Construye la lista de productos con botón de eliminar
    listaCarrito.innerHTML = carrito
        .map((p, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span>• ${p.nombre} - Bs. ${p.precio}</span>
                <a class="boton-eliminar" data-indice="${i}" style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em; text-decoration: none;">X Eliminar</a>
            </div>
        `)
        .join("");

    // Asigna el evento click a los nuevos botones de eliminar
    document.querySelectorAll(".boton-eliminar").forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });

    calcularTotal();
}

// ------ AGREGAR PRODUCTO ------
botonesComprar.forEach(boton => {
    boton.addEventListener("click", () => {
        const card = boton.parentElement;
        const nombre = card.querySelector("h3").textContent;
        // Se asegura de obtener el precio como un string limpio para parseFloat
        const precioString = card.querySelector("p").textContent.replace("Bs. ", "").trim();

        carrito.push({ nombre, precio: precioString });
        localStorage.setItem("carrito", JSON.stringify(carrito));

        // mensaje flotante
        const msg = document.createElement("div");
        msg.textContent = "✔ Añadido al carrito";
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

        actualizarCarrito();
    });
});

// ------ ELIMINAR PRODUCTO individualmente ------
function eliminarProducto(e) {
    // Obtiene el índice del producto a eliminar
    const indice = e.target.getAttribute("data-indice");
    // Elimina el producto del arreglo
    carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

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
        const total = carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0).toFixed(2);
        alert(`¡Gracias por tu compra en SportApz! Tu total a pagar es: Bs. ${total}`);
        // Opcionalmente, puedes vaciar el carrito después de la compra
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    } else {
        alert("Tu carrito está vacío. Añade productos para finalizar la compra.");
    }
});


// ------ INICIALIZAR ------
actualizarCarrito();

