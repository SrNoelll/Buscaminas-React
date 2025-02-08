export const CeldaComponent = ({ valor = " ", onCeldaClick, onCeldaContextMenu, disabled, bandera }) => {
  return (
    <button
      className="border border-2 border-dark-subtle fs-2 fw-bold text-success"
      style={{
        minWidth: 50,
        minHeight: 50,
        backgroundColor: bandera ? "red" : "transparent", // Mostrar bandera en rojo
      }}
      onClick={onCeldaClick}
      onContextMenu={onCeldaContextMenu} // Añadimos el evento de clic derecho
      disabled={disabled}
    >
      {valor}
    </button>
  );
};
