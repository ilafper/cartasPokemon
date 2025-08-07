$(document).ready(function () {
  // Cambiar de pestañas
  $('.tab-button').click(function () {
    const tabID = $(this).data('tab');
    $('.tab-button').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').hide();
    $('#' + tabID).show();
  });

  let packsAbiertos = 0;
    let itemsTotales = 0;

    let tipos = {
      comun: 0,
      rara: 0,
      epica: 0,
      legendaria: 0
    };

  function cargarInventario() {
    
    $.ajax({
      url: 'https://api-minecraft-phi.vercel.app/api/inventarioDatos',
      method: 'GET',
      success: function (data) {
        if (data.length === 0) return alert('No hay inventario guardado');

        const inventario_stok = data[0];
        console.log('Inventario cargado:', inventario_stok);

        packsAbiertos = inventario_stok.packsAbiertos;
        itemsTotales = inventario_stok.cartasTotales;

        tipos.comun = inventario_stok.totalComunes;
        tipos.rara = inventario_stok.totalRaras;
        tipos.epica = inventario_stok.totalEpicas;
        tipos.legendaria = inventario_stok.totalLegendarias;

        $('#packsCount').text(packsAbiertos);
        $('#itemsCount').text(itemsTotales);
        $('#statCommon').text(tipos.comun);
        $('#statRare').text(tipos.rara);
        $('#statEpic').text(tipos.epica);
        $('#statLegendary').text(tipos.legendaria);
      },
      error: function () {
        alert('Error2 al cargar datos del inventarioGET.');
      }
    });
  }

  cargarInventario();

  function actualizarInventario(contenedor, carta) {
    let cartaExistente = contenedor.find(`.carta[data-nombre="${carta.nombre}"]`);
    if (cartaExistente.length > 0) {
      let contador = cartaExistente.find('.contador');
      let cantidad = parseInt(contador.text().substring(1));
      contador.text(`x${cantidad + 1}`);
    } else {
      const cartaHTML = `
        <section class="carta ${carta.tipo}" data-id="${carta.id}" data-nombre="${carta.nombre}">
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

          const cartasSeleccionadas = lista_cartas.sort(() => 0.5 - Math.random()).slice(0, 4);
          contenedor.empty();

          let cartasResumen = [];

          cartasSeleccionadas.forEach(carta => {
            const cartaHTML = `
              <section class="carta ${carta.tipo}" data-id="${carta.id}" data-nombre="${carta.nombre}">
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

            // Actualizar inventarios visuales
            actualizarInventario($('#listaTodas'), carta);
            if (carta.tipo === "comun") actualizarInventario($('#listaComunes'), carta);
            else if (carta.tipo === "rara") actualizarInventario($('#listaRaras'), carta);
            else if (carta.tipo === "epica") actualizarInventario($('#listaEpicas'), carta);
            else if (carta.tipo === "legendaria") actualizarInventario($('#listaLegendarias'), carta);

            // Actualizar estadísticas
            tipos[carta.tipo] = (tipos[carta.tipo] || 0) + 1;
            itemsTotales++;

           
            let existente = cartasResumen.find(c => c.id === carta.id);
            if (existente) {
              existente.cantidad++;
            } else {
              cartasResumen.push({ id: carta.data-id, cantidad: 1 });
            }
          });

          packsAbiertos++;

          // Actualizar en pantalla
          $('#packsCount').text(packsAbiertos);
          $('#itemsCount').text(itemsTotales);
          $('#statCommon').text(tipos.comun);
          $('#statRare').text(tipos.rara);
          $('#statEpic').text(tipos.epica);
          $('#statLegendary').text(tipos.legendaria);

          // Enviar el nuevo inventario al servidor
          const inventarioFinal = {
            packsAbiertos: packsAbiertos,
            cartasTotales: itemsTotales,
            totalComunes: tipos.comun,
            totalEpicas: tipos.epica,
            totalRaras: tipos.rara,
            totalLegendarias: tipos.legendaria,
            cartas: cartasResumen
          };
          console.log(inventarioFinal);
          
          $.ajax({
            url: 'https://api-minecraft-phi.vercel.app/api/inventario',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(inventarioFinal),
            success: function () {
              console.log("Inventario actualizado en el servidor","wawawa:", inventarioFinal);
            },
            error: function () {
              alert("Error al guardar el inventario en el servidor");
            }
          });
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
