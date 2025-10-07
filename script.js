function formatarNome(nome) {
    if (nome.toLowerCase() === "hp") return "HP";
    return nome
      .split("-")
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  }
  
  function criarTipoBadge(tipo) {
    return `<span class="type type-${tipo}">${tipo}</span>`;
  }
  
  function criarTabelaStats(stats) {
    return `
      <h3>Status Base</h3>
      <table>
        <tr>
          <th>Status</th>
          <th>Valor</th>
          <th>Barra</th>
        </tr>
        ${stats.map(stat => `
          <tr>
            <td>${formatarNome(stat.stat.name)}</td>
            <td>${stat.base_stat}</td>
            <td>
              <div class="stat-bar">
                <div class="stat-bar-inner" style="width: ${Math.min(stat.base_stat, 100)}%;"></div>
              </div>
            </td>
          </tr>
        `).join('')}
      </table>
    `;
  }
  
  function criarTabelaHabilidades(habilidades) {
    return `
      <h3>Habilidades</h3>
      <ul>
        ${habilidades.map(h => `<li>${formatarNome(h.ability.name)}${h.is_hidden ? " (oculta)" : ""}</li>`).join('')}
      </ul>
    `;
  }
  
  function criarTabelaInfos(dados) {
    return `
      <h3>Informações Gerais</h3>
      <table>
        <tr><th>Altura</th><td>${dados.height / 10} m</td></tr>
        <tr><th>Peso</th><td>${dados.weight / 10} kg</td></tr>
        <tr><th>Base de Experiência</th><td>${dados.base_experience}</td></tr>
      </table>
    `;
  }
  
  async function buscarPokemon() {
    const input = document.getElementById("searchInput");
    const termo = input.value.trim().toLowerCase();
    const resultado = document.getElementById("resultado");
  
    resultado.className = "loading";
    resultado.style.color = "black";
    resultado.innerHTML = "Carregando...";
  
    if (!termo) {
      resultado.className = "default-bg";
      resultado.style.color = "black";
      resultado.innerHTML = "<p>Por favor, digite o nome ou ID do Pokémon.</p>";
      return;
    }
  
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${termo}`);
      if (!res.ok) throw new Error("Pokémon não encontrado");
  
      const dados = await res.json();
  
      const tiposHTML = dados.types
        .map(t => criarTipoBadge(t.type.name))
        .join(" ");
  
      const tipoPrincipal = dados.types[0].type.name;
      resultado.className = `type-${tipoPrincipal}`;
      resultado.style.color = "black";
  
      // Adiciona ID antes do nome, com cerquilha #
      resultado.innerHTML = `
        <h2>#${dados.id} - ${formatarNome(dados.name)}</h2>
        <div class="imagem-pokemon">
          <img class="artwork" src="${dados.sprites.other["official-artwork"].front_default || dados.sprites.front_default}" alt="${dados.name}" title="Artwork Oficial" />
          <img class="sprite" src="${dados.sprites.front_default}" alt="${dados.name}" title="Sprite Pixelado" />
        </div>
        <div class="tipos">${tiposHTML}</div>
        ${criarTabelaInfos(dados)}
        ${criarTabelaStats(dados.stats)}
        ${criarTabelaHabilidades(dados.abilities)}
      `;
    } catch (error) {
      resultado.className = "default-bg";
      resultado.style.color = "black";
      resultado.innerHTML = `<p class="error">Erro: ${error.message}</p>`;
    }
  }
  
  document.getElementById("searchButton").addEventListener("click", buscarPokemon);
  document.getElementById("searchInput").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      buscarPokemon();
    }
  });  