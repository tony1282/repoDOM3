'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// varables Dom

const formTarea = document.getElementById("formTarea");
const inputTitulo = document.getElementById("inputTitulo");
const selectTag = document.getElementById("selectTag");
const listaTareas = document.getElementById("listaTareas");


// contador para generar ids
let contador = 4;



// formulario

formTarea.addEventListener("submit", function(event){

    event.preventDefault();

    const titulo = inputTitulo.value.trim();
    const tag = selectTag.value;

    if(titulo === "") return;

    crearTarea(titulo, tag);

    // limpiar input
    inputTitulo.value = "";

});



// crear tarea

function crearTarea(titulo, tag){

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
}