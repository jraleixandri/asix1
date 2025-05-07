fetch('fotovoltaiques.json')
  .then(response => response.json())
  .then(data => {
    const taulaBaixEbre = document.querySelector('#baix-ebre tbody');
    const taulaMontsia = document.querySelector('#montsia tbody');
    
    // Comprovem l'estructura del JSON per determinar com accedir a les dades
    console.log("Estructura JSON:", data);
    
    // Assumim que data pot tenir una estructura diferent a un array simple
    let plantes = data;
    
    // Si el JSON té una estructura tipus { rows: { row: [...] } } o similar
    if (data.rows && data.rows.row) {
      plantes = data.rows.row;
    } else if (data.rows) {
      plantes = data.rows;
    } else if (data.plantes) {
      plantes = data.plantes;
    }
    
    // Assegurem que plantes sigui iterable (un array)
    if (!Array.isArray(plantes)) {
      plantes = [plantes]; // Convertim a array si només tenim un objecte
    }
    
    plantes.forEach(planta => {
      // Provem diferents possibles estructures per accedir a les dades
      const nom = planta.nom || planta.NOM || (planta.row && planta.row.nom);
      const comarca = planta.comarca || planta.COMARCA || (planta.row && planta.row.comarca);
      const potenciaText = planta.potencia_mw || planta.potencia || planta.POTENCIA || 
                         (planta.row && (planta.row.potencia_mw || planta.row.potencia));
      
      // Convertim la potència a número
      const potencia = parseFloat(potenciaText);
      
      // Creem la fila de la taula
      const fila = document.createElement('tr');
      fila.className = potencia >= 5 ? 'alta-potencia' : 'baixa-potencia';
      
      fila.innerHTML = `
        <td>${nom}</td>
        <td>${comarca}</td>
        <td>${potencia} MW</td>
      `;
      
      // Afegim la fila a la taula corresponent
      if (comarca === 'Baix Ebre') {
        taulaBaixEbre.appendChild(fila);
      } else if (comarca === 'Montsià') {
        taulaMontsia.appendChild(fila);
      }
    });
  })
  .catch(error => {
    console.error('Error en carregar les dades JSON:', error);
    document.body.innerHTML += `
      <div style="color: red; margin-top: 20px;">
        <h3>Error en carregar les dades:</h3>
        <p>${error.message}</p>
      </div>
    `;
  });