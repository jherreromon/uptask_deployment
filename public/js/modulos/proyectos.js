import Swal from 'sweetalert2';
import axios from 'axios';


//recogemos el boton eliminar-proyecto
const btnEliminar = document.querySelector('#eliminar-proyecto');

//si el boton eliminar existe xq sino existe da error

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        //Leemos el atributo html5 del fichero tareas.pug->data-proyecto-url
        //se lee como proyectoUrl en javascript
        const urlProyecto = e.target.dataset.proyectoUrl;
        // console.log(urlProyecto);

        Swal.fire({
            title: 'Deseas borrar este proyecto?',
            text: "Una vez eliminado el proyecto, no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                //envio de petición a axios
                //location.origin->nos da localhost
                //urlProyecto->nos da location.url (q es lo q está en la bbdd)
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    //esperamos la respuesta desde el servidor (res.data)
                    .then(function(respuesta) {
                        console.log(respuesta);

                        Swal.fire(
                            'Proyecto Elmininado!',
                            respuesta.data,
                            'success'
                        );
                        //redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        })

                    })


            }
        })

    })
}
export default btnEliminar;