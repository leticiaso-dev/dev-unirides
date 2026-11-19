# Roteiro para montar o protótipo no Figma

Use as imagens de `docs/telas/` como referência (ou como fundo de cada frame) e ligue as telas com **Prototype → On click → Navigate to**. Frame sugerido: **Desktop 1280 × 800**.

## Identidade visual
| Elemento | Valor |
|---|---|
| Azul principal | `#1D3B8B` (cabeçalho, botões) |
| Laranja de destaque | `#F28C28` (logo, botões de ação principal) |
| Verde (valores em R$) | `#1F9D55` |
| Fundo | `#F5F7FB` |
| Fonte | Inter ou Segoe UI · títulos 24–28 px · texto 15 px |
| Cantos | 12 px nos cartões, 8 px nos botões e campos |

## Frames e conexões

| # | Frame (arquivo de referência) | Elementos clicáveis → destino |
|---|---|---|
| 1 | Página inicial (`01_pagina_inicial.png`) | "Criar conta" → 2 · "Entrar" → 3 |
| 2 | Cadastro (`02_cadastro_validacao.png`) | "Criar conta" → 4 · link "Entrar" → 3 |
| 3 | Login (`03_login.png`) | "Entrar" → 4 · "Cadastre-se" → 2 |
| 4 | Painel (`04_painel_motorista.png`) | Menu: Buscar → 6 · Oferecer → 5 · Minhas caronas → 14 · Meu perfil → 13 · "Avaliar" → 10 |
| 5 | Oferecer carona (`05_oferecer_carona.png`) | "Publicar carona" → 9 |
| 6 | Buscar carona (`06_buscar_carona.png`) | "Ver detalhes" → 7 |
| 7 | Detalhes + solicitar vaga (`07_detalhe_solicitar.png`) | "Solicitar vaga" → 8 · nome do motorista → 13 |
| 8 | Pedido pendente (`08_pedido_pendente.png`) | Menu "Início" → 11 |
| 9 | Pedidos do motorista (`09_motorista_pedidos.png`) | "Aceitar" → 10 (após "Concluir viagem") |
| 10 | Avaliação (`10_avaliacao.png`) | "Enviar" → 4 · "Denunciar um problema" → 12 |
| 11 | Painel da passageira (`11_painel_passageira.png`) | "Avaliar" → 10 |
| 12 | Denúncia (`12_denuncia.png`) | "Cancelar" / "Enviar denúncia" → 10 |
| 13 | Perfil (`13_perfil.png`) | Menu "Início" → 4 |
| 14 | Minhas caronas (`14_minhas_caronas.png`) | "Ver detalhes" → 7 |

## Fluxos para demonstrar (Prototype → Flow starting point)
1. **Jornada do Lucas (motorista):** 3 → 4 → 5 → 9 → 10
2. **Jornada da Camila (passageira):** 1 → 2 → 4 → 6 → 7 → 8 → 11 → 10 → 12
3. **Jornada do Marcos (funcionário):** 1 → 2 → 4 → 6 → 7 → 8

No fim, clique em **Share → Copy link** (acesso "Anyone with the link can view") e cole o link no documento, na seção 6.
