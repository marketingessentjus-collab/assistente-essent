# Essent — Assistente de Comunicação: Ideias de Design

## Contexto
Ferramenta interna de comunicação para a Essent Inovação Contábil. Público: time de comunicação, gestores, sócios. Uso diário, produtivo, profissional.

---

<response>
<probability>0.07</probability>
<idea>

**Design Movement:** Corporate Brutalism — estrutura exposta, hierarquia visual agressiva, funcionalidade como estética.

**Core Principles:**
1. Tipografia como elemento estrutural — tamanhos extremos criam hierarquia imediata
2. Bordas visíveis e deliberadas — nada é escondido, tudo é declarado
3. Contraste máximo — navy escuro vs. branco puro vs. azul elétrico
4. Grid assimétrico — colunas de tamanhos diferentes criam tensão visual produtiva

**Color Philosophy:** Navy profundo (#002060) como base de autoridade. Azul elétrico (#0099ff) como acento de ação. Branco puro como espaço de trabalho. A paleta comunica: "aqui se decide, aqui se age."

**Layout Paradigm:** Sidebar fixa com navegação vertical + área de conteúdo com grid de 12 colunas. Cada seção ocupa largura diferente, criando ritmo visual.

**Signature Elements:**
1. Linha horizontal de 2px em azul elétrico como separador de seções
2. Números grandes e semi-transparentes como decoração de fundo
3. Tags/badges com bordas sólidas, sem arredondamento excessivo

**Interaction Philosophy:** Feedback imediato e claro. Estados de loading com animações lineares. Hover com mudança de cor, não de posição.

**Animation:** Transições de 150ms, easing linear. Sem bounce ou spring — tudo é direto e decisivo.

**Typography System:** Blinker 900 para títulos (como no original), Blinker 400 para corpo. Hierarquia por peso e tamanho, não por família diferente.

</idea>
</response>

<response>
<probability>0.06</probability>
<idea>

**Design Movement:** Swiss International Style — grid matemático, tipografia funcional, clareza absoluta.

**Core Principles:**
1. Cada elemento tem um propósito — zero decoração sem função
2. Alinhamento rigoroso — tudo se encaixa em uma grade invisível mas sentida
3. Informação em camadas — o mais importante é sempre o maior e mais escuro
4. Espaço em branco como respiração — não como vazio

**Color Philosophy:** Monocromático azul com um único acento. Navy (#002060) para autoridade, cinza claro (#f2f2f2) para superfícies, azul (#0099ff) apenas para ações e destaques críticos.

**Layout Paradigm:** Header fixo + navegação horizontal em tabs + área principal com max-width de 1100px. Exatamente como o original, mas com refinamento visual elevado.

**Signature Elements:**
1. Indicador de tab ativo como linha inferior azul elétrico
2. Cards com sombra sutil e borda 1px em cinza azulado
3. Botões com estados visuais claros (default/hover/active/loading)

**Interaction Philosophy:** Micro-interações suaves. Toggle buttons com transição de cor. Loading states com spinner animado.

**Animation:** Fade-in de 200ms para conteúdo gerado. Transições de 150ms para estados de botão. Sem animações de entrada de página.

**Typography System:** Blinker como fonte principal (já definida na marca). Pesos 300, 400, 600, 700, 900 para criar hierarquia completa.

</idea>
</response>

<response>
<probability>0.08</probability>
<idea>

**Design Movement:** Dark Command Center — interface de controle, dashboard de missão crítica, profissionalismo técnico.

**Core Principles:**
1. Fundo escuro como canvas de trabalho — reduz fadiga visual em uso prolongado
2. Informação luminosa — texto claro em fundo escuro, como telas de controle
3. Acentos de cor como sinais — azul para ação, verde para sucesso, âmbar para atenção
4. Densidade informacional — mais conteúdo visível sem sacrificar legibilidade

**Color Philosophy:** Background #0a0f1e (navy quase preto), cards em #0d1530, texto em #e8edf5, azul elétrico #0099ff para ações. A paleta comunica: "ferramenta séria para profissionais sérios."

**Layout Paradigm:** Header fixo escuro + tabs horizontais com indicador de linha + área de conteúdo com cards em fundo levemente mais claro que o background.

**Signature Elements:**
1. Glow sutil em azul nos elementos ativos (box-shadow com cor)
2. Separadores como gradientes de transparência
3. Código/prompts em fonte monospace com fundo ainda mais escuro

**Interaction Philosophy:** Feedback visual imediato. Estados de loading com pulsação. Resultados aparecem com fade-in suave.

**Animation:** Glow pulse para loading (0.8s), fade-in para resultados (300ms), scale sutil para hover em cards.

**Typography System:** Blinker para UI, monospace para prompts e código. Hierarquia por luminosidade — títulos em branco puro, subtítulos em azul claro, corpo em cinza claro.

</idea>
</response>

---

## Decisão

**Escolhido: Swiss International Style (Resposta 2)** — mantém fidelidade ao design original (que já é bem construído), mas eleva a qualidade visual com refinamentos tipográficos, espaçamento mais generoso, transições suaves e componentes React modernos. A identidade da marca (navy + azul elétrico + Blinker) é preservada e aprimorada.
