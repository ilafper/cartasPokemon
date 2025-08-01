$(document).ready(function () {

  $('.tab-button').click(function () {
    const tabID = $(this).data('tab');

    // Activar solo el botón clicado
    $('.tab-button').removeClass('active');
    $(this).addClass('active');

    // Mostrar solo el contenido de la pestaña correspondiente
    $('.tab-content').hide();
    $('#' + tabID).show();
  });
  const cartas = [
    // 🟡 Legendaria (1)
    { nombre: "Ender Dragón", descripcion: "La criatura final del End, poderosa y temida.", tipo: "legendaria" },

    // ⚪ Comunes (10)
    { nombre: "Zombie", descripcion: "Camina en la noche y ataca sin piedad.", tipo: "comun" },
    { nombre: "Esqueleto", descripcion: "Dispara flechas desde la distancia.", tipo: "comun" },
    { nombre: "Creeper", descripcion: "Explota cuando se acerca. ¡Cuidado!", tipo: "comun" },
    { nombre: "Araña", descripcion: "Rápida y sigilosa, ataca de noche.", tipo: "comun" },
    { nombre: "Aldeano", descripcion: "Intercambia objetos, muy útil en aldeas.", tipo: "comun" },
    { nombre: "Cerdo", descripcion: "Animal pasivo, fuente de alimento.", tipo: "comun" },
    { nombre: "Vaca", descripcion: "Provee leche y cuero.", tipo: "comun" },
    { nombre: "Gallina", descripcion: "Pone huevos y sirve de comida.", tipo: "comun" },
    { nombre: "Oveja", descripcion: "Provee lana y comida.", tipo: "comun" },
    { nombre: "Pez tropical", descripcion: "Nada en aguas cálidas.", tipo: "comun" },

    // 🔵 Raras (5)
    { nombre: "Enderman", descripcion: "Se teletransporta y odia que lo miren.", tipo: "rara" },
    { nombre: "Bruja", descripcion: "Lanza pociones venenosas.", tipo: "rara" },
    { nombre: "Ahogado", descripcion: "Zombi marino que lanza tridentes.", tipo: "rara" },
    { nombre: "Zombi Pigman", descripcion: "Neutral, pero peligroso en grupo.", tipo: "rara" },
    { nombre: "Golem de Hierro", descripcion: "Protege a los aldeanos de amenazas.", tipo: "rara" },

    // 🟣 Épicas (4)
    { nombre: "Wither", descripcion: "Un jefe invocado muy destructivo.", tipo: "epica" },
    { nombre: "Guardia Anciano", descripcion: "Habita en los templos marinos.", tipo: "epica" },
    { nombre: "Piglin Bruto", descripcion: "Hostil incluso sin tocar su oro.", tipo: "epica" },
    { nombre: "Jinete Fantasma", descripcion: "Esqueleto montado en araña, muy raro.", tipo: "epica" }
  ];

  let packsAbiertos = 0;
  let itemsTotales = 0;

  let tipos = {
    comun: 0,
    rara: 0,
    epica: 0,
    legendaria: 0
  }

  function actualizarInventario(contenedor, carta) {
    let cartaExistente = contenedor.find(`.carta[data-nombre="${carta.nombre}"]`);
    if (cartaExistente.length > 0) {
      let contador = cartaExistente.find('.contador');
      let cantidad = parseInt(contador.text().substring(1));
      contador.text(`x${cantidad + 1}`);
    } else {
      const cartaHTML = `
        <section class="carta ${carta.tipo}" data-nombre="${carta.nombre}">
          <p class="tipo">${carta.tipo}</p>
          <span class="corner-bl"></span>
          <span class="corner-br"></span>
          <img src="../src/slime.png" alt="imagen carta">
          <h5>${carta.nombre}</h5>
          <p>${carta.descripcion}</p>
          <span class="contador">x1</span>
        </section>
      `;
      contenedor.append(cartaHTML);
    }
  }

  $('#abrirSobreBtn').click(function () {
    //reorganiza el arrat y coge los tres primeros.
    let boton = $('#abrirSobreBtn');


    //cogemos el contenedor en donde van las cartas
    const contenedor = $('#listaCartas');

    if (boton.text() == "APERTURA") {

      boton.text("Cerrar");

      // Mezclamos cartas y cogemos 4
      const cartasSeleccionadas = cartas.sort(() => 0.5 - Math.random()).slice(0, 4);

      contenedor.empty(); // Limpiamos antes de añadir.

      cartasSeleccionadas.forEach(carta => {
        const cartaHTML = `
        <section class="carta ${carta.tipo}" data-nombre="${carta.nombre}">
          <p class="tipo">${carta.tipo}</p>
          <span class="corner-bl"></span>
          <span class="corner-br"></span>
          <img src="../src/slime.png" alt="imagen carta">
          <h5>${carta.nombre}</h5>
          <p>${carta.descripcion}</p>
          
          <span class="contador">x1</span>
        </section>
      `;
        contenedor.append(cartaHTML);






        // Inventario
        actualizarInventario($('#listaTodas'), carta);
        if (carta.tipo === "comun") actualizarInventario($('#listaComunes'), carta);
        else if (carta.tipo === "rara") actualizarInventario($('#listaRaras'), carta);
        else if (carta.tipo === "epica") actualizarInventario($('#listaEpicas'), carta);
        else if (carta.tipo === "legendaria") actualizarInventario($('#listaLegendarias'), carta);


        // Actualizar estadísticas
        tipos[carta.tipo] = (tipos[carta.tipo] || 0) + 1;
        itemsTotales++;



      });

      // Actualizar datos
      packsAbiertos++;
      $('#packsCount').text(packsAbiertos);
      $('#itemsCount').text(itemsTotales);
      $('#statCommon').text(tipos.comun);
      $('#statRare').text(tipos.rara);
      $('#statEpic').text(tipos.epica);
      $('#statLegendary').text(tipos.legendaria);


    } else {
      contenedor.empty();
      boton.text("APERTURA");
    }



  });


});


