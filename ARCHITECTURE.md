# AstroAI System Architecture

This document details the architectural decisions, system design, and data flow of the AstroAI application. The primary goal of this architecture is to provide secure, low-latency access to Large Language Models (LLMs) from a web client.

## 1. The Inference Gateway (Cloudflare Workers)

The core architectural pattern is the **Inference Gateway**. Direct communication from a web browser to an AI provider (like OpenAI or Hugging Face) is inherently insecure because it requires exposing the API key in the client-side code.

To solve this, AstroAI uses a **Cloudflare Worker** (`cloudflare_worker_auth.js`) as a serverless edge proxy.

### Security Model
*   **Credential Isolation:** The `HF_API_KEY` is stored securely as an environment variable in the Cloudflare Worker. The client never sees this key.
*   **CORS Management:** The Worker handles Cross-Origin Resource Sharing (CORS) headers, ensuring that only requests originating from `astroai.live` (or localhost during development) are processed.
*   **Request Validation:** (Planned) The Worker acts as a gatekeeper, allowing for payload inspection, rate limiting, and malicious prompt filtering before the request ever reaches the LLM provider.

## 2. Low-Latency Streaming (Server-Sent Events)

Generative AI models can take several seconds to generate a complete response. Waiting for the full generation leads to a poor user experience. 

AstroAI optimizes for **Time-To-First-Token (TTFT)** by implementing a real-time streaming pipeline using Server-Sent Events (SSE).

### Data Flow
1.  **Client Request:** The user submits a prompt. `hfClient.js` initiates a `fetch` request to the Cloudflare Worker.
2.  **Worker Proxy:** The Worker attaches the secure API key and forwards the request to the Hugging Face Inference API, requesting a streaming response.
3.  **Stream Pipelining:** As Hugging Face generates tokens, the Worker immediately pipes those data chunks back to the client.
4.  **Client Rendering:** The `hfClient.js` reads the incoming byte stream, decodes it into text, and dispatches events to the UI.
5.  **Dynamic UI:** The `chatMessageList.js` component listens for these events and progressively renders the text as markdown, creating a responsive "typing" effect.

## 3. State Management & Data Persistence

Managing conversation history (the context window) is crucial for LLM applications. AstroAI utilizes a hybrid approach:

### Phase 1: Client-Side (Current MVP)
*   **Mechanism:** `LocalStorage` via `sessionService.js`.
*   **Use Case:** Provides immediate, zero-latency access to chat history upon page reload.
*   **Limitation:** Data is tied to the specific browser and device.

### Phase 2: Server-Side Edge Persistence (In Development)
*   **Mechanism:** Cloudflare D1 (Serverless SQL Database).
*   **Implementation:** The database schema (`d1_schema.sql`) defines tables for `Users`, `Sessions`, and `Messages`.
*   **Goal:** The Cloudflare Worker will intercept chat payloads, asynchronously persist them to the D1 database, and then forward the request to the LLM. This allows users to access their conversational state across any device.

## 4. Frontend Application Architecture

The frontend is a custom Single Page Application (SPA) built without external UI frameworks to demonstrate core web API proficiency.

*   **`/ui` (View Layer):** Contains the custom hash-based router (`router.js`) and UI components. The router orchestrates parallel module loading and CSS transitions for seamless screen changes.
*   **`/core` (Business Logic):** Houses services like `chatService.js` and `userService.js`. These modules orchestrate the flow of data between the UI and the infrastructure layer, independent of how the data is rendered.
*   **`/infra` (Infrastructure):** Modules like `hfClient.js` manage external communication (API calls, WebSockets, SSE) and abstract away the network complexity from the business logic.