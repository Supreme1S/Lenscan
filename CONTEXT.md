# Lenscan — AI Context File

> Этот файл вставляй в начало каждого чата с ИИ перед тем как задавать вопросы по проекту.

---

## Что за проект

**Lenscan** — Sui-native портфельный трекер (аналог DeBank, но для Sui).
Соло-проект, код пишется через ИИ (Cursor + Perplexity).

**Цель:** дать пользователю полную картину его Sui-портфеля — токены, DeFi-позиции, NFT, транзакции, yields — в одном интерфейсе.

---

## Стек

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Edge Functions + Auth)
- **Блокчейн:** Sui RPC (`@mysten/sui.js`), Sui Indexer
- **Цены:** DeFiLlama API
- **Деплой:** Vercel

---

## Структура проекта

```
src/
├── app/              # Next.js App Router страницы и API routes
├── components/       # UI компоненты
├── contexts/         # React контексты
├── data/             # Mock-данные (временно, заменяем на реальные)
├── lib/
│   ├── sui/          # Sui RPC интеграция (rpc.ts, metadata.ts, portfolio.ts)
│   └── prices/       # DeFiLlama интеграция (defiLlama.ts)
└── providers/        # React провайдеры
```

---

## Текущее состояние (апрель 2026)

### Сделано
- Архитектура и роутинг
- Базовые UI компоненты (navbar, layout, карточки)
- Supabase подключён (auth, DB схема)
- Интеграция с Sui RPC — частично (portfolio, транзакции, метадата)
- DeFiLlama для цен — частично
- Mock-данные для DeFi-позиций, NFT, yields

### В процессе / не готово
- DeFi-позиции (Navi, Cetus, Suilend, Scallop) — только моки
- NFT — только моки
- Пагинация транзакций — есть баг (cursor не передаётся)
- Избранные кошельки — UI есть, логика частично
- Подписочная модель — не начата

### Известные баги
1. `rpc.ts` — `queryTransactionBlocks` всегда передаёт `cursor: null`, пагинация не работает
2. `metadata.ts` — `AbortError` не прерывает workers мгновенно
3. `defiLlama.ts` — один упавший chunk обнуляет все результаты

---

## Приоритеты на ближайшее время

1. Исправить 3 известных бага (см. выше)
2. Заменить mock-данные на реальные (DeFi-позиции через протокольные SDK)
3. Запустить MVP с реальными данными

---

## Важные правила при работе с кодом

- **Не трогай файлы, которые не упомянуты в задаче**
- **TypeScript должен компилироваться без ошибок**
- **Не добавляй новые зависимости без явной просьбы**
- **Один промпт = одна задача = один файл (максимум два)**
- При изменении API-функций — сохраняй обратную совместимость сигнатуры

---

## Интеграции и API

| Сервис | Статус | Примечание |
|--------|--------|-----------|
| Sui RPC (fullnode.mainnet.sui.io) | Частично | rate limit ~100 req/s |
| DeFiLlama `/coins/prices` | Частично | чанки по 100 монет |
| Navi Protocol SDK | Не начат | `@navi-protocol/sui-lending-sdk` |
| Cetus CLMM SDK | Не начат | `@cetusprotocol/cetus-sui-clmm-sdk` |
| Scallop SDK | Не начат | `@scallop-io/sui-scallop-sdk` |
| Suilend SDK | Не начат | `@suilend/sdk` |

---

## Контекст для агентных фич (будущее)

Планируется добавить:
- **Risk Agent:** анализ концентрации портфеля, health-факторы DeFi-позиций
- **Weekly Digest:** LLM-генерация еженедельного отчёта по портфелю
- **Price Alerts:** уведомления при изменении цены токена на X%
