import swal from "sweetalert";

const mensajes = (texto, titulo, tipo = "success") => {
  swal(titulo, texto, tipo, {
    button: "ACEPTAR",
    timer: 5000,
    closeOnEsc: true,
  });
};

export default mensajes;
