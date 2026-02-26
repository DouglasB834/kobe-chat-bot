# Plano: Correção dos erros das APIs (Gemini e Groq)

Envs ficam como estão por enquanto (teste com validade curta). Este plano é para resolver os erros 404 e 401.

---

## 1. Gemini 404 – modelo não encontrado

**Problema:** `models/gemini-1.5-flash is not found for API version v1beta`.

**Ação:** Em [app/api/chat/gemini/route.ts](app/api/chat/gemini/route.ts), trocar o modelo para um id válido na API v1beta.

- Opções comuns: `gemini-1.5-flash-latest`, `gemini-1.5-pro-latest`, ou `gemini-2.0-flash-exp` (conferir em [Google AI – modelos](https://ai.google.dev/gemini-api/docs/models)).
- Alterar a constante `GEMINI_URL` (ex.: de `gemini-1.5-flash` para `gemini-1.5-flash-latest` ou o modelo escolhido).

---

## 2. Groq 401 – Invalid API Key

**Problema:** Groq retorna 401 quando a chave é inválida ou de outro serviço.

**Verificar no `.env` (só para teste):**

- **GEMINI_API_KEY** deve ser a chave do **Google AI Studio** (formato `AIza...`).
- **GROQ_API_KEY** deve ser a chave do **Groq Console** (formato `gsk_...`).

Se estiverem trocadas, corrigir: Gemini = `AIza...`, Groq = `gsk_...`.  
Se as chaves estiverem certas e ainda der 401 no Groq, gerar uma nova key em https://console.groq.com/keys e atualizar `GROQ_API_KEY`.

---

## 3. Depois do teste (segurança)

- Remover **qualquer chave real** do [.env.example](.env.example).
- Deixar só placeholders: `GEMINI_API_KEY=` e `GROQ_API_KEY=`.
- Manter chaves apenas em `.env` ou `.env.local` (não commitar).

---

## Resumo

| Erro   | Onde corrigir                         | Ação |
|--------|---------------------------------------|------|
| 404 Gemini | `app/api/chat/gemini/route.ts` | Trocar id do modelo para um válido (ex.: `gemini-1.5-flash-latest`) |
| 401 Groq    | `.env` / `.env.local`          | Garantir que GROQ_API_KEY é chave Groq (`gsk_...`); trocar se estiver com chave Google |
| Segurança   | `.env.example`                 | Após o teste: remover chaves reais, deixar só placeholders |
