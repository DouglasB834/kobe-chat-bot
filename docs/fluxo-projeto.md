# Fluxo do projeto – Kobe Chat Bot

Este documento descreve o fluxo completo do chat: camadas, uso de **memo()**, **reduce** (reducer), **useChat** e a estratégia **mock → API real** para facilitar o desenvolvimento e a troca de provedor de IA.

---

## 1. Visão geral do fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  UI (page.tsx → ChatContainer)                                               │
│  - Renderiza mensagens (MessageBubble), input (ChatInput), typing (LoadingDots)│
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  useChat (hook)                                                              │
│  - useReducer(chatReducer) → state (messages, isTyping)                      │
│  - sendMessage(text) → dispatch + chatAIProvider.sendMessage()             │
│  - resetChat() → dispatch RESET_CHAT                                         │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ chatReducer      │    │ chatAIProvider       │    │ Tipos (chat-state,    │
│ (estado +        │    │ (interface única)    │    │ chat-ai, message)     │
│  actions)        │    │ mock | groq | gemini │    │                       │
└──────────────────┘    └──────────┬───────────┘    └──────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
             mock (local)   /api/chat/groq   /api/chat/gemini
             lib/chat-ai/   (Next route)     (Next route)
             mock.ts
```

- **UI**: só consome `useChat()` e renderiza lista de mensagens + input.
- **useChat**: dono do estado (reducer), dispara ações e chama o **provedor de IA** abstrato.
- **chatReducer**: atualiza `messages` e `isTyping` de forma previsível.
- **chatAIProvider**: uma única interface (`ChatAIProvider`); a implementação (mock, groq, gemini) é escolhida por variável de ambiente.

Assim, você pode desenvolver e testar tudo com **mock** e, quando for implementar a API de verdade, só trocar o provedor (e/ou a rota) sem mudar o restante do fluxo.

---

## 2. O que foi usado nas chamadas da API

### 2.1 Contrato da “API” (tipos)

Toda camada de IA (mock ou real) respeita o mesmo contrato em `types/chat-ai.ts`:

- **ChatAIRequest**: `userMessage` (string) e opcionalmente `history` (array de `{ role, text }`).
- **ChatAIResponse**: `text` (string) e opcionalmente `products` (array de `Product`).
- **ChatAIProvider**: objeto com `name` e método `sendMessage(request): Promise<ChatAIResponse>`.

Assim, o **useChat** não sabe se está falando com mock, Groq ou Gemini; só chama `chatAIProvider.sendMessage(...)`.

### 2.2 Onde a “API” é chamada

- **No cliente**: em `useChat.ts`, dentro de `sendMessage`:
  - `await chatAIProvider.sendMessage({ userMessage: trimmed, history: state.messages.map(...) })`.
- **Mock**: em `lib/chat-ai/mock.ts` — simula delay (2s), usa `lib/mock-products` para buscar/lista de produtos e devolve texto + produtos.
- **Groq**: em `lib/chat-ai/groq.ts` — faz `POST /api/chat/groq` com o mesmo `ChatAIRequest`; a rota `app/api/chat/groq/route.ts` monta as mensagens para a Groq, chama a API externa e ainda usa `mock-products` para produtos (texto vem da IA, produtos do catálogo local).
- **Gemini**: em `lib/chat-ai/gemini.ts` — mesmo padrão, chamando `POST /api/chat/gemini`.

Ou seja: **uma única forma de chamar** (via `chatAIProvider`), e cada implementação decide se responde localmente (mock) ou via API (groq/gemini).

---

## 3. Por que usar `memo()` no MessageBubble

No projeto, **React.memo** é usado em `components/chat/message-bubble.tsx`:

```tsx
export const MessageBubble = React.memo(function MessageBubble({ message }: MessageBubbleProps) {
  // ...
});
```

**Motivo:**

- O **ChatContainer** renderiza uma lista de mensagens: `messages.map((message) => <MessageBubble key={message.id} message={message} />)`.
- Sempre que o estado do chat muda (nova mensagem, `isTyping`, etc.), o **ChatContainer** re-renderiza e, em princípio, **todos** os `MessageBubble` seriam re-renderizados.
- Cada bubble pode conter texto animado (TypingAnimation) e vários **ProductCard**; re-renderizar tudo a cada nova mensagem ou mudança de estado é custoso e desnecessário.
- Com **memo()**, o React só re-renderiza um `MessageBubble` quando as **props** mudam (no caso, quando o objeto `message` daquele item é outro por referência).
- Como o reducer devolve um **novo** array `messages` e só as mensagens novas ou alteradas têm nova referência, apenas os bubbles realmente afetados re-renderizam; o resto mantém a referência antiga e o memo evita trabalho.

Resumo: **memo()** no MessageBubble foi pensado para **reduzir re-renders** em listas longas de mensagens e evitar reexecutar animações e listas de produtos nos bubbles que não mudaram.

---

## 4. Estrutura do reduce (chatReducer)

O estado do chat é **um único objeto** e todas as mudanças passam por **ações** tratadas por um reducer, no estilo Redux.

### 4.1 Estado (`ChatState`)

Em `types/chat-state.ts`:

- **messages**: array de `Message` (id, role, text, products?, createdAt).
- **isTyping**: boolean (indica “bot está digitando”).

### 4.2 Ações (`ChatAction`)

- **ADD_USER_MESSAGE**: adiciona mensagem do usuário; payload: `{ text }`.
- **SET_TYPING**: atualiza indicador de “digitando”; payload: `boolean`.
- **ADD_BOT_MESSAGE**: adiciona mensagem do assistente; payload: `{ text, products? }`.
- **RESET_CHAT**: zera estado (messages vazio, isTyping false).

### 4.3 Reducer (`lib/chat-reducer.ts`)

- **initialChatState**: `{ messages: [], isTyping: false }`.
- **chatReducer(state, action)**:
  - Para cada tipo de ação, retorna um **novo** estado (imutável): spread de `state` e alteração só do que mudou (ex.: `messages: [...state.messages, message]`).
  - ADD_USER_MESSAGE / ADD_BOT_MESSAGE: cria a `Message` com `crypto.randomUUID()`, adiciona ao array.
  - SET_TYPING: substitui `state.isTyping` pelo payload.
  - RESET_CHAT: retorna `{ ...initialChatState }`.

Essa estrutura em **reduce** centraliza a lógica de atualização do chat, facilita testes e mantém o estado previsível; o **useChat** só dispara ações e lê o estado, sem espalhar `setState` pela UI.

---

## 5. useChat – responsabilidades e detalhes

O hook em `hooks/useChat.ts` é o **único** lugar que:

1. Mantém o estado do chat via **useReducer(chatReducer, initialChatState)**.
2. Expõe **sendMessage** e **resetChat** para a UI.
3. Chama o **chatAIProvider** (mock ou API).

Fluxo de **sendMessage**:

1. Valida e faz trim do texto; se vazio, retorna.
2. **Dispatch ADD_USER_MESSAGE** (mensagem do usuário aparece na hora).
3. **Dispatch SET_TYPING(true)** (mostra “digitando”).
4. **await chatAIProvider.sendMessage({ userMessage, history })** — aqui acontece a “chamada da API” (mock ou real).
5. Em sucesso: **dispatch ADD_BOT_MESSAGE** com `text` e `products` da resposta.
6. Em erro: **dispatch ADD_BOT_MESSAGE** com mensagem de erro fixa.
7. No **finally**: **dispatch SET_TYPING(false)**.

**useCallback**:

- **sendMessage** é envolvido em `useCallback(..., [state.messages])` para não recriar a função a cada render e ainda ter sempre o `history` atualizado quando o usuário envia uma nova mensagem.
- **resetChat** é `useCallback(..., [])` porque só dispara uma ação sem dependências.

O retorno do hook é um objeto estável em forma: `{ messages, isTyping, sendMessage, resetChat }`, consumido pelo **ChatContainer** (e indiretamente por MessageBubble, ChatInput, LoadingDots).

---

## 6. Estratégia mock → API real (por camadas)

A ideia é **facilitar cada camada** usando mock até o momento de implementar a API de verdade.

### 6.1 Camada de provedor (lib/chat-ai)

- **Interface única**: `ChatAIProvider` (`sendMessage(request) → Promise<ChatAIResponse>`).
- **Implementações**:
  - **mock** (`lib/chat-ai/mock.ts`): resposta local com delay, usando `lib/mock-products`; nenhuma HTTP.
  - **groq** (`lib/chat-ai/groq.ts`): `POST /api/chat/groq` com o mesmo `ChatAIRequest`.
  - **gemini** (`lib/chat-ai/gemini.ts`): `POST /api/chat/gemini` com o mesmo `ChatAIRequest`.

Quem escolhe o provedor é o **lib/chat-ai/index.ts**:

- Lê `process.env.NEXT_PUBLIC_CHAT_AI_PROVIDER` (valores: `"mock"` | `"gemini"` | `"groq"`).
- Default é **"mock"**.
- Exporta um único `chatAIProvider`; o resto do app não importa mock/groq/gemini diretamente.

Assim você pode:

- Desenvolver e testar **toda** a UI e o fluxo (reducer, useChat, mensagens, produtos) com **mock**, sem API key nem backend.
- Quando for implementar a API real: criar ou ajustar a rota (ex.: `app/api/chat/groq/route.ts`), manter o cliente chamando `chatAIProvider.sendMessage()` e só trocar no `.env` para `NEXT_PUBLIC_CHAT_AI_PROVIDER=groq` (ou gemini).

### 6.2 Camada de rotas (API real)

- **app/api/chat/groq/route.ts**: recebe `ChatAIRequest` (JSON), monta as mensagens para a Groq (system + history + userMessage), chama a API da Groq e devolve `ChatAIResponse` (texto da IA + produtos do `mock-products` no exemplo atual).
- O mesmo padrão pode ser usado para Gemini em `app/api/chat/gemini/route.ts`.

Ou seja: a “API” que o front chama é sempre a mesma **forma** (request/response); só o **provedor** (mock vs groq vs gemini) e a implementação da rota mudam.

---

## 7. Resumo rápido

| Parte | Função |
|-------|--------|
| **Reducer** | Estado único (messages, isTyping); atualização imutável por ações. |
| **useChat** | Dono do estado e da lógica: dispatch + chamada ao `chatAIProvider.sendMessage()`. |
| **ChatAIProvider** | Abstração da “API”: mock (local) ou groq/gemini (HTTP). Troca por env. |
| **memo(MessageBubble)** | Menos re-renders na lista de mensagens e nas animações/lista de produtos. |
| **Mock** | Permite desenvolver e testar todo o fluxo sem implementar API real; depois é só trocar o provedor e implementar a rota. |

Com isso, o fluxo fica claro: **UI → useChat → reducer + chatAIProvider → mock ou API real**, e a troca entre mock e API real é controlada por uma variável de ambiente e pela implementação do provedor/rota, sem alterar o restante do projeto.
