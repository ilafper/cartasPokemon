$(document).ready(function () {
  // Cambiar de pestañas
  $('.tab-button').click(function () {
    const tabID = $(this).data('tab');
    $('.tab-button').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').hide();
    $('#' + tabID).show();
  });


  
  // const inventario=[
  //   packsAbiertos=0,
  //   cartasTotales=0,
  //   totalComunes=0,
  //   totalEpicas=0,
  //   totalRaras=0,
  //   totalLegendarias=0,
  // ]

  let packsAbiertos = 0;
  let itemsTotales = 0;

  let tipos = {
    comun: 0,
    rara: 0,
    epica: 0,
    legendaria: 0
  };

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
          <img src="${carta.img}" alt="imagen carta">
          <h5>${carta.nombre}</h5>
          <p>${carta.descripcion}</p>
          <span class="contador">x1</span>
        </section>
      `;
      contenedor.append(cartaHTML);
    }
  }

  $('#abrirSobreBtn').click(function () {
    const boton = $(this);
    const contenedor = $('#listaCartas');

    if (boton.text() === "APERTURA") {
      boton.text("Cerrar");

      $.ajax({
        url: 'https://api-minecraft-phi.vercel.app/api/cartitas',
        method: 'GET',
        success: function (lista_cartas) {
          console.log(lista_cartas);
          
          // Seleccionar 4 cartas aleatorias
          const cartasSeleccionadas = lista_cartas.sort(() => 0.5 - Math.random()).slice(0, 4);

          contenedor.empty(); // Limpiar cartas anteriores

          cartasSeleccionadas.forEach(carta => {
            const cartaHTML = `
              <section class="carta ${carta.tipo}" data-nombre="${carta.nombre}">
                <p class="tipo">${carta.tipo}</p>
                <span class="corner-bl"></span>
                <span class="corner-br"></span>
                <img src="${carta.img}" alt="imagen carta">
                <h5>${carta.nombre}</h5>
                <p>${carta.descripcion}</p>
                <span class="contador">x1</span>
              </section>
            `;
            contenedor.append(cartaHTML);

            // Actualizar inventarios por tipo
            actualizarInventario($('#listaTodas'), carta);
            if (carta.tipo === "comun") actualizarInventario($('#listaComunes'), carta);
            else if (carta.tipo === "rara") actualizarInventario($('#listaRaras'), carta);
            else if (carta.tipo === "epica") actualizarInventario($('#listaEpicas'), carta);
            else if (carta.tipo === "legendaria") actualizarInventario($('#listaLegendarias'), carta);

            // Actualizar estadísticas
            tipos[carta.tipo] = (tipos[carta.tipo] || 0) + 1;
            itemsTotales++;
          });

          packsAbiertos++;
          $('#packsCount').text(packsAbiertos);
          $('#itemsCount').text(itemsTotales);
          $('#statCommon').text(tipos.comun);
          $('#statRare').text(tipos.rara);
          $('#statEpic').text(tipos.epica);
          $('#statLegendary').text(tipos.legendaria);
        },
        error: function () {
          alert('Error al cargar las cartas.');
        }
      });

    } else {
      contenedor.empty();
      boton.text("APERTURA");
    }
  });
});
