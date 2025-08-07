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
        //if (data.length === 0) return alert('No hay inventario guardado');

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
        alert('Error al cargar datos del inventario.');
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
      console.log();

    } else {
      const cartaHTML = `
        <section class="carta ${carta.tipo}" data-id="${carta._id}" data-nombre="${carta.nombre}">
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

      console.log();

    }
    const cartasInventario = [];

    $('#listaTodas .carta').each(function () {
      const $carta = $(this);
      const codigo = $carta.data('id'); // el _id de la carta
      const nombre = $carta.data('nombre');
      const tipo = $carta.find('.tipo').text().trim();
      const descripcion = $carta.find('p').last().text().trim();
      const img = $carta.find('img').attr('src');
      const cantidadTexto = $carta.find('.contador').text().trim(); // "x1"
      const cantidad = parseInt(cantidadTexto.replace('x', '')) || 1;

      cartasInventario.push({
        codigo,
        nombre,
        tipo,
        descripcion,
        img,
        cantidad
      });
    });
    console.log("patata:", JSON.stringify(cartasInventario, null, 2));
    
    $.ajax({
      url: 'https://api-minecraft-phi.vercel.app/api/inventario',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(cartasInventario.codigo, cartasInventario.cantidad),
      success: function () {
        console.log("Inventario actualizado en el servidor");
      },
      error: function () {
        alert("Error al guardar el inventario en el servidor");
      }
    });


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
          const cartasSeleccionadas = lista_cartas.sort(() => 0.5 - Math.random()).slice(0, 4);
          contenedor.empty();

          let cartasResumen = [];

          cartasSeleccionadas.forEach(carta => {
            const cartaHTML = `
            <section class="carta ${carta.tipo}" data-id="${carta._id}" data-nombre="${carta.nombre}">
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


            actualizarInventario($('#listaTodas'), carta);
            // Actualizar estadísticas de tipos
            if (carta.tipo === "comun") tipos.comun++;
            else if (carta.tipo === "rara") tipos.rara++;
            else if (carta.tipo === "epica") tipos.epica++;
            else if (carta.tipo === "legendaria") tipos.legendaria++;

            // Actualizar inventario por tipo
            if (carta.tipo === "comun") actualizarInventario($('#listaComunes'), carta);
            else if (carta.tipo === "rara") actualizarInventario($('#listaRaras'), carta);
            else if (carta.tipo === "epica") actualizarInventario($('#listaEpicas'), carta);
            else if (carta.tipo === "legendaria") actualizarInventario($('#listaLegendarias'), carta);

            itemsTotales++;



          });

          packsAbiertos++;

          // Actualizar indicadores en pantalla
          $('#packsCount').text(packsAbiertos);
          $('#itemsCount').text(itemsTotales);
          $('#statCommon').text(tipos.comun);
          $('#statRare').text(tipos.rara);
          $('#statEpic').text(tipos.epica);
          $('#statLegendary').text(tipos.legendaria);

          // Construimos el objeto para enviar con las cartas y cantidades
          const inventarioDatos1 = {
            packsAbiertos: packsAbiertos,
            cartasTotales: itemsTotales,
            totalComunes: tipos.comun,
            totalEpicas: tipos.epica,
            totalRaras: tipos.rara,
            totalLegendarias: tipos.legendaria,
          };

          console.log('Inventario a enviar:', inventarioDatos1);

          // Enviamos al backend
          $.ajax({
            url: 'https://api-minecraft-phi.vercel.app/api/inventario',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(inventarioDatos1),
            success: function () {
              console.log("Inventario actualizado en el servidor");
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
