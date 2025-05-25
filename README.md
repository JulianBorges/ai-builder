# AI Website Builder – v5

Construtor de sites com inteligência artificial inspirado no Vercel v0 e Lovable, com geração modular de páginas, preview em tempo real e salvamento no Supabase.

---

## 📌 O que este projeto faz

Este projeto transforma um prompt do usuário em um site completo, funcional e responsivo utilizando agentes especializados. Ele simula o funcionamento de ferramentas como Lovable e Vercel v0, oferecendo:

- Geração de múltiplas páginas
- Preview em tempo real via iframe
- Histórico de versões
- Armazenamento de arquivos no Supabase
- Modularidade com agentes IA por função

---

## 🧠 Arquitetura baseada em agentes

### 🔧 Agentes implementados:

- `plannerAgent`: Gera o plano inicial de páginas, componentes e estilos
- `structureAgent`: Gera HTML semântico da estrutura
- `contentAgent`: Preenche o conteúdo das seções
- `designAgent`: Aplica CSS com design moderno e responsivo
- `interactionsAgent`: Adiciona JS para interações
- `seoAgent`: Insere metatags e otimizações para buscadores
- `finalizationAgent`: Junta tudo e retorna HTML, CSS, JS e arquivos
- `orchestrator`: Coordena todos os agentes acima

---

## ⚙️ Tecnologias

- Vite + React + TypeScript
- TailwindCSS + shadcn/ui
- Supabase (PostgreSQL)
- OpenAI GPT-4o e GPT-4o-mini
- Preview com `<iframe srcdoc>`

---

## 📁 Estrutura do projeto

src/
├── lib/agents/ → Todos os agentes de geração
├── components/ → UI da dashboard (input, preview, ações)
├── pages/ → Home e Dashboard
├── services/ → openai-service.ts
├── config/ → supabase.ts, salvador.ts
├── utils/ → debugLog.ts

---

## 🚧 O que precisa ser corrigido

> O sistema já está funcionando, os agentes estão conectados e o conteúdo é gerado com sucesso.  
> No entanto, **o HTML gerado não está sendo exibido corretamente no preview.**

O problema pode estar em:
- Como o conteúdo está sendo passado para o `iframe` do `PreviewPanel`
- Ou no `finalizationAgent`, se estiver retornando apenas o `<body>` em vez de um HTML completo

---

## ▶️ Como rodar localmente

```bash
npm install
npm run dev
