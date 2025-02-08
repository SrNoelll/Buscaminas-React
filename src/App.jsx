import { useState, useEffect } from "react";
import "./App.css";
import { CeldaComponent } from "./components/ButtonComponent/CeldaComponent";
import Switch from "./components/ButtonComponent/Switch ";
import cara from "./assets/images/acierto.png"

function App() {
  // funcion para generar el tablero de juego con minas y numeros
  const generarTablero = () => {
    let array = [];
    // crear una matriz de 8x8 inicializada en 0
    for (let index = 0; index < 8; index++) {
      array[index] = Array(8).fill(0);
    }

    let totalMinas = 0;
    // ubicar 10 minas de forma aleatoria en el tablero
    while (totalMinas < 10) {
      const posicionX = Math.floor(Math.random() * 8);
      const posicionY = Math.floor(Math.random() * 8);

      if (array[posicionX][posicionY] === 0) {
        array[posicionX][posicionY] = "*";

        // actualizar los contadores de minas en las casillas adyacentes
        if (posicionX - 1 >= 0 && array[posicionX - 1][posicionY] !== "*") {
          array[posicionX - 1][posicionY] += 1;
        }

        if (posicionX + 1 < 8 && array[posicionX + 1][posicionY] !== "*") {
          array[posicionX + 1][posicionY] += 1;
        }

        if (posicionY + 1 < 8 && array[posicionX][posicionY + 1] !== "*") {
          array[posicionX][posicionY + 1] += 1;
        }

        if (posicionY - 1 >= 0 && array[posicionX][posicionY - 1] !== "*") {
          array[posicionX][posicionY - 1] += 1;
        }

        if (
          posicionX - 1 >= 0 &&
          posicionY - 1 >= 0 &&
          array[posicionX - 1][posicionY - 1] !== "*"
        ) {
          array[posicionX - 1][posicionY - 1] += 1;
        }

        if (
          posicionX - 1 >= 0 &&
          posicionY + 1 < 8 &&
          array[posicionX - 1][posicionY + 1] !== "*"
        ) {
          array[posicionX - 1][posicionY + 1] += 1;
        }

        if (
          posicionX + 1 < 8 &&
          posicionY - 1 >= 0 &&
          array[posicionX + 1][posicionY - 1] !== "*"
        ) {
          array[posicionX + 1][posicionY - 1] += 1;
        }

        if (
          posicionX + 1 < 8 &&
          posicionY + 1 < 8 &&
          array[posicionX + 1][posicionY + 1] !== "*"
        ) {
          array[posicionX + 1][posicionY + 1] += 1;
        }

        totalMinas++;
      }
    }

    return array;
  };

  // estados principales del juego
  const [mapaValores, setMapaValores] = useState(generarTablero());
  const [visibilidad, setVisibilidad] = useState(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(false))
  );
  const [contadorMinas, setContadorMinas] = useState(10);
  const [iniciado, setIniciado] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [intervalo, setIntervalo] = useState(null);
  const [banderas, setBanderas] = useState(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(false))
  );

  // funcion para revelar casillas adyacentes de forma recursiva
  const revelarCasillasAdyacentes = (x, y) => {
    // validar limites del tablero y condiciones de revelacion
    if (x < 0 || x >= 8 || y < 0 || y >= 8 || visibilidad[x][y] || mapaValores[x][y] === "*") {
      return;
    }
  
    const nuevaVisibilidad = [...visibilidad];
    nuevaVisibilidad[x][y] = true;
    setVisibilidad([...nuevaVisibilidad]);
  
    // si la casilla no tiene numeros, se revelan las casillas circundantes
    if (mapaValores[x][y] === 0) {
      revelarCasillasAdyacentes(x - 1, y);
      revelarCasillasAdyacentes(x + 1, y);
      revelarCasillasAdyacentes(x, y - 1);
      revelarCasillasAdyacentes(x, y + 1);
      revelarCasillasAdyacentes(x - 1, y - 1);
      revelarCasillasAdyacentes(x - 1, y + 1);
      revelarCasillasAdyacentes(x + 1, y - 1);
      revelarCasillasAdyacentes(x + 1, y + 1);
    }
  
    revisarVictoria(); // verifico la victoria despues de cada revelacion
  };
  
  // funcion para iniciar o detener el juego
  const toggleJuego = () => {
    if (iniciado) {
      // detener el juego: se reinician estados y se detiene el cronometro
      setIniciado(false);
      setTiempo(0);
      setContadorMinas(10);
      setMapaValores(generarTablero());
      setVisibilidad(
        Array(8)
          .fill(null)
          .map(() => Array(8).fill(false))
      );
      setBanderas(  // restablecer las banderas
        Array(8)
          .fill(null)
          .map(() => Array(8).fill(false))
      );
  
      if (intervalo) {
        clearInterval(intervalo);
        setIntervalo(null);
      }
    } else {
      // iniciar el juego: se activa el cronometro
      setIniciado(true);
  
      const nuevoIntervalo = setInterval(() => {
        setTiempo((prev) => prev + 1);
      }, 1000);
      setIntervalo(nuevoIntervalo);
    }
  };
  
  // funcion para mostrar el valor de una casilla al hacer clic
  const mostrarValor = (x, y) => {
    if (!iniciado || visibilidad[x][y]) return;
  
    // si se revela una mina se muestra alerta y se reinicia el juego
    if (mapaValores[x][y] === "*") {
      alert("¡boom! has perdido. reiniciando la partida... Vueleve a Pulsar el botón para iniciare una nueva partida");
      toggleJuego();
      return;
    }
  
    revelarCasillasAdyacentes(x, y);
    revisarVictoria(); // llamo a la funcion despues de revelar casillas
  };
  
  // manejar clic derecho para colocar banderas
  const manejarClickDerecho = (x, y, e) => {
    e.preventDefault(); // prevenir el menu contextual
    if (!iniciado) return;
  
    const nuevasBanderas = [...banderas];
    
    // si ya tiene bandera, se retira, y si no, solo se coloca si hay banderas disponibles
    if (nuevasBanderas[x][y]) {
      nuevasBanderas[x][y] = false; // retirar la bandera
      setBanderas(nuevasBanderas);
      setContadorMinas((prev) => prev + 1); // aumentar contador de banderas
    } else if (contadorMinas > 0) {
      nuevasBanderas[x][y] = true; // colocar la bandera
      setBanderas(nuevasBanderas);
      setContadorMinas((prev) => prev - 1); // disminuir contador de banderas
    }
  };
  
  // funcion para revisar si se ha ganado el juego
  const revisarVictoria = () => {
    // recorremos todas las casillas del tablero
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        // si la casilla no tiene mina y no esta revelada, aun no se ha ganado
        if (mapaValores[x][y] !== "*" && !visibilidad[x][y]) {
          return; // si falta una casilla por revelar, se sale de la funcion
        }
      }
    }
    // si se han revelado todas las casillas sin mina, se gana la partida
    alert("¡felicidades, has ganado! reiniciando la partida...");
    toggleJuego(); // reiniciar el juego
  };
  
  // efecto para limpiar el intervalo cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }
    };
  }, [intervalo]);

  return (
    <>
      <div className="container text-center" style={{ width: 492 }}>
        {/* parte superior con el contador */}
        <div className="grid bg-body-secondary py-2 px-4 borderOutSide m-0">
          <div className="row bg-body-secondary borderInside">
            <div className="d-flex flex-wrap justify-content-around">
              <div className="lcdText text-danger pe-2 m-2 borderInsideS">
                {contadorMinas}
              </div>
              <div className="align-self-center m-2 borderInsideS">
                <img
                  src={cara}
                  style={{ width: 50 }}
                  alt="acierto"
                />
              </div>
              <div
                className="lcdText text-danger pe-2 m-2 borderInsideS"
                style={{ width: 54 }}
              >
                {tiempo.toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* tablero de juego */}
          <div className="row borderInside bg-body-secondary text-center justify-content-center">
            <div className="col my-1 p-0">
              <div className="d-flex flex-wrap justify-content-center">
                {mapaValores.map((fila, x) =>
                  fila.map((valor, y) => (
                    <div key={`${x}-${y}`} className="col-auto p-0">
                      <CeldaComponent
                        valor={visibilidad[x][y] ? valor : " "}
                        onCeldaClick={() => mostrarValor(x, y)}
                        onCeldaContextMenu={(e) => manejarClickDerecho(x, y, e)} // clic derecho
                        disabled={!iniciado} // bloquea las celdas si el juego esta apagado
                        bandera={banderas[x][y]} // bandera colocada
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* boton de encendido/apagado */}
      <div className="d-flex justify-content-center align-items-center">
        <div style={{ width: 300 }} className="bg-body-secondary borderOutSide d-flex justify-content-center align-items-center">
          <Switch className="swich" onClick={toggleJuego} />
        </div>
      </div>
    </>
  );
}

export default App;
