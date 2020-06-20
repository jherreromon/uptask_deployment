import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

//recogemos .listado-pendientes del fichero tareas.pug
const tareas = document.querySelector('.listado-pendientes');

if (tareas) {

    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            // console.log(e.target.classList);
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            //mandamos al servidor la información y la 
            //respuesta es lo q nos manda el servidor como res
            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    if (respuesta.status === 200) {
                        //si esta lo quita y si no esta, lo pone
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }
        //si vamos a eliminar la tarea
        if (e.target.classList.contains('fa-trash')) {

            const tareaHTML = e.target.parentElement.parentElement,
                //obtenemos el id de la tarea. 
                //ojo!!!! no definimos a idTarea como const peeeero ponemos una coma antes
                idTarea = tareaHTML.dataset.tarea;

            //implementamos el alert para borrar
            Swal.fire({
                title: 'Deseas borrar esta tarea?',
                text: "una tarea eliminada, no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    //enviar el delete mediante axios.toma como parámetros
                    //la url y como segundo argumento lo q se quiere enviar
                    //con delete, el segundo parametro es params

                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                // console.log(respuesta);

                                //eliminamos el html del DOM de forma automatica haciendo 
                                //parentElement
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                //ponemos una alerta
                                Swal.fire(
                                    'Tarea Elmininada Correctamente',
                                    respuesta.data,
                                    //sustituye a title, text, icon
                                    'success'

                                )
                                actualizarAvance();

                            }
                        });
                }
            })


        }


    });

}

export default tareas;