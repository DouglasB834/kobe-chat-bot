This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 💬 Kobe – Chat Interface Challenge

## 📌 Visão Geral

Este projeto consiste na implementação de uma interface conversacional para recomendação de produtos, conforme especificado no desafio técnico.

O foco principal foi:

- Estruturação de componentes reutilizáveis
- Clareza arquitetural
- Controle previsível de estado
- Responsividade entre breakpoints
- Microinterações e experiência do usuário
- Organização e legibilidade do código

---

# 🛠️ Stack Tecnológica

## ⚙️ Framework

- **Next.js (App Router)**
- **TypeScript**

**Motivação:**  
Next.js fornece estrutura moderna e escalável.  
TypeScript garante segurança de tipos e melhor modelagem das entidades do chat.

---

## 🎨 UI & Estilização

- **TailwindCSS**
- **shadcn/ui**

**Motivação:**  
Tailwind permite estilização rápida e responsiva.  
shadcn/ui oferece componentes acessíveis e personalizáveis, servindo como base para um design consistente.

---

## 🧠 Gerenciamento de Estado

- **useReducer**

O fluxo do chat envolve múltiplas transições de estado:

- Usuário envia mensagem
- Sistema entra em estado de "digitando"
- Bot responde com texto e/ou recomendações
- Scroll automático
- Reset do chat (opcional)

Centralizar essas ações em um reducer torna o fluxo:

- Mais previsível
- Mais organizado
- Escalável para futuras integrações com API real

---

## ✅ Validação de Input

A validação foi implementada de forma simples e controlada diretamente no componente de input.

Regras aplicadas:

- Impedir envio de mensagens vazias
- `trim()` automático
- Botão desabilitado quando input inválido

**Justificativa:**  
O escopo do desafio não exige formulários complexos. Optou-se por uma solução simples e eficiente, mantendo foco na experiência conversacional.

---

# 📂 Estrutura do Projeto
app/
├── page.tsx

components/
├── chat/
│ ├── ChatContainer.tsx
│ ├── MessageBubble.tsx
│ ├── ProductRecommendation.tsx
│ ├── ChatInput.tsx
│
├── ui/ (componentes base do shadcn)

hooks/
├── useChat.ts

types/
├── message.ts

lib/
├── mock-data.ts


### Organização

- Separação clara entre UI e lógica
- Tipos centralizados
- Mock isolado simulando futura API
- Chat tratado como domínio principal

---

# 🧩 Modelagem do Chat

## Message

```ts
type Message = {
  id: string
  role: "user" | "agent"
  text: string
  products?: Product[]
  createdAt: Date
}

`
Ações do Reducer
ADD_USER_MESSAGE
SET_TYPING
ADD_BOT_MESSAGE
RESET_CHAT
`

✨ Microinterações Implementadas

Animação suave ao surgir nova mensagem
Scroll automático para última mensagem
Estado visual de “digitando...”

Botão desabilitado durante envio
Hover states nos cards de produto
Feedback visual consistente

📱 Responsividade
Mobile
Chat ocupa 100% da tela
Input fixo na parte inferior
Cards organizados em coluna

Desktop
Chat centralizado
Largura máxima controlada
Cards exibidos lado a lado
Breakpoints tratados explicitamente com TailwindCSS.

🔁 Padrão de Commits
Adotado padrão Conventional Commits:
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração
style: ajustes visuais
docs: documentação
chore: tarefas internas

🚀 Possíveis Evoluções Futuras
Integração com API real
Persistência em localStorage
Streaming de respostas
Virtualização da lista de mensagens

Testes unitários com Vitest + Testing Library
