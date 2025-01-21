// script.js
const trainingPlan = [
    "Descanso",
    "Carrera moderada (5-7 km)",
    "Entrenamiento de fuerza o yoga",
    "Intervalos (5 km: 1 min rápido, 2 min lento)",
    "Descanso activo (30 min caminar/bici)",
    "Carrera larga (8-12 km)",
    "Trote suave (30 min)"
];

// Registrar el Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(() => {
        console.log("Service Worker registrado exitosamente.");
    }).catch(err => {
        console.error("Error al registrar el Service Worker:", err);
    });
}

// Manejar la generación del plan de entrenamiento
document.getElementById("startDate").addEventListener("change", function () {
    const startDate = new Date(this.value);
    const today = new Date(); // Fecha actual
    const days = 60; // Total duration of the training plan
    const trainingPlanDiv = document.getElementById("training-plan");
    const progressText = document.getElementById("progress-text");

    // Limpiar contenido previo
    trainingPlanDiv.innerHTML = "";

    // Crear tabla
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Día</th>
            <th>Fecha</th>
            <th>Actividad</th>
        </tr>
    `;

    let completedDays = 0;

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const row = document.createElement("tr");
        const dayType = trainingPlan[i % trainingPlan.length]; // Cycle through weekly activities

        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${date.toLocaleDateString()}</td>
            <td>${dayType}</td>
        `;

        // Marcar días pasados como completados
        if (date < today) {
            row.classList.add("completed");
            completedDays++;
        }

        // Agregar evento para marcar/desmarcar como completado
        row.addEventListener("click", function () {
            if (!row.classList.contains("completed")) {
                row.classList.add("completed");
                completedDays++;
            } else {
                row.classList.remove("completed");
                completedDays--;
            }

            // Actualizar progreso dinámicamente
            const remainingDays = days - completedDays;
            progressText.innerText = `Faltan ${remainingDays} días para completar el plan.`;
        });

        table.appendChild(row);
    }

    // Agregar tabla al contenedor
    trainingPlanDiv.appendChild(table);

    // Establecer progreso inicial
    const remainingDays = days - completedDays;
    progressText.innerText = `Faltan ${remainingDays} días para completar el plan. ¡Empieza hoy!`;
});
