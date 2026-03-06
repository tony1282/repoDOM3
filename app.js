'use strict';


const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));


const formTarea = document.getElementById("formTarea");
const inputTitulo = document.getElementById("inputTitulo");
const selectTag = document.getElementById("selectTag");
const listaTareas = document.getElementById("listaTareas");
const inputBuscar = document.getElementById("inputBuscar");
const btnLimpiarBuscar = document.getElementById("btnLimpiarBuscar");
const filtros = $$(".chip");
const statTotal = document.getElementById("statTotal");
const statVisibles = document.getElementById("statVisibles");
const statFavs = document.getElementById("statFavs");
const emptyState = document.getElementById("emptyState");


let contador = 4;



// Crear una nueva tarea y agregarla al DOM
function crearTarea(titulo, tag) {
    const tarea = document.createElement("li");
    tarea.className = "card";
    tarea.dataset.id = "t" + contador++;
    tarea.dataset.tag = tag;
    tarea.dataset.fav = "0";

    tarea.innerHTML = `
        <div class="card__head">
            <span class="badge">${tag}</span>
            <div class="actions">
                <button class="icon" data-action="fav">☆</button>
                <button class="icon" data-action="done">✓</button>
                <button class="icon danger" data-action="del">🗑</button>
            </div>
        </div>
        <p class="card__title">${titulo}</p>
    `;

    listaTareas.appendChild(tarea);
    actualizarEstadisticas();
}

// Actualiza contadores y estado vacío
function actualizarEstadisticas() {
    const todas = $$(".card").length;
    const visibles = $$(".card").filter(card => card.style.display !== "none").length;
    const favoritas = $$(".card[data-fav='1']").length;

    statTotal.textContent = todas;
    statVisibles.textContent = visibles;
    statFavs.textContent = favoritas;

    if (visibles === 0) {
        emptyState.classList.remove("is-hidden");
    } else {
        emptyState.classList.add("is-hidden");
    }
}


// Eventos del DOM 

// Agregar tarea desde el formulario
formTarea.addEventListener("submit", function(event) {
    event.preventDefault();

    const titulo = inputTitulo.value.trim();
    const tag = selectTag.value;

    if (titulo === "") return;

    crearTarea(titulo, tag);
    inputTitulo.value = "";
});

// Eventos para eliminar, completar y marcar favorita
listaTareas.addEventListener("click", function(event) {
    const btn = event.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const tarea = btn.closest(".card");
    if (!tarea) return;

    if (action === "del") {
        tarea.remove();
    } else if (action === "done") {
        tarea.classList.toggle("done");
    } else if (action === "fav") {
        if (tarea.dataset.fav === "0") {
            tarea.dataset.fav = "1";
            btn.textContent = "★";
        } else {
            tarea.dataset.fav = "0";
            btn.textContent = "☆";
        }
    }

    actualizarEstadisticas();
});

// Filtrar por categoria o favoritas
filtros.forEach(chip => {
    chip.addEventListener("click", () => {
        filtros.forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        const filtro = chip.dataset.filter;

        $$(".card").forEach(card => {
            if (
                filtro === "all" ||
                (filtro === "fav" && card.dataset.fav === "1") ||
                card.dataset.tag === filtro
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        actualizarEstadisticas();
    });
});

// Buscar tareas por texto
inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.trim().toLowerCase();
    const filtroActivo = $(".chip.is-active").dataset.filter;

    $$(".card").forEach(card => {
        const titulo = card.querySelector(".card__title").textContent.toLowerCase();
        const coincideTexto = titulo.includes(texto);
        const coincideFiltro =
            filtroActivo === "all" ||
            (filtroActivo === "fav" && card.dataset.fav === "1") ||
            card.dataset.tag === filtroActivo;

        card.style.display = coincideTexto && coincideFiltro ? "block" : "none";
    });

    actualizarEstadisticas();
});

// Limpiar busqueda
btnLimpiarBuscar.addEventListener("click", () => {
    inputBuscar.value = "";
    inputBuscar.dispatchEvent(new Event("input"));
});