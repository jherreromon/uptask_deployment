//esto lo traduce babel. Por eso no se pone require
import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import { actualizarAvance } from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})