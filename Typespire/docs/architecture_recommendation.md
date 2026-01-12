# Technical Architecture Recommendation

## 1. Backend Stack Recommendation

**Recommendation: Node.js (NestJS) + PostgreSQL**

### Why Node.js & NestJS?
*   **Unified Language**: Your frontend is already in TypeScript. Using TypeScript on the backend allows for sharing interfaces (DTOs) and reduces context switching for developers.
*   **Scalability**: Node.js is excellent for I/O-heavy applications (like handling many concurrent test submissions). NestJS provides a robust, modular architecture (similar to Angular) that scales well for multi-tenant applications.
*   **Real-time Capabilities**: Excellent support for WebSockets (Socket.io) if you want to implement live "race" modes or real-time teacher monitoring in the future.

### Why PostgreSQL?
*   **Reliability**: The industry standard for relational data.
*   **Multi-tenancy**: Excellent support for row-level security or schema-based isolation to satisfy **FR-01 Data Isolation**.
*   **JSON Support**: Good for storing flexible test result data (e.g., keystroke logs) while keeping core relationships (Users, Intakes) structured.

### Alternative Considered: Python (Django)
*   *Pros*: Built-in Admin panel is great.
*   *Cons*: Context switch from TypeScript. Slightly higher resource usage per request compared to Node.js for simple API calls.

---

## 2. Typing Test Engine Strategy

**Recommendation: Custom In-House System**

### Why Custom?
*   **Core Competency**: "Typespire" is a typing platform. The typing engine is your core product. Relying on a 3rd party API (like a rapidapi typing service) introduces a critical dependency, monthly costs, and limits your ability to customize grading logic.
*   **Specific Requirements**: Your PRD mentions specific logic like **FR-13 "Home Row" Grace Period** and **FR-15 Proficiency Levels**. Most APIs won't support these custom business rules out of the box.
*   **Security**: You need to prevent cheating. A custom engine allows you to implement "replay" verification on the backend (checking the timing of every keystroke) to detect bots or copy-paste scripts.

### "What would it take to develop our own?"

Developing a custom engine is manageable. Here is the high-level roadmap:

#### Phase 1: The "Engine" (Frontend Library)
*   **Input Capture**: A hidden HTML input or global keydown listener to capture raw keystrokes.
*   **State Management**: A React hook (e.g., `useTypingEngine`) to track:
    *   `cursorPosition`: Index of the current character.
    *   `errors`: Array of error indices.
    *   `startTime` / `endTime`.
    *   `keystrokeLog`: Array of `{ char: string, timestamp: number }` for anti-cheat.
*   **Metrics Calculation**:
    *   `WPM`: `(Total Characters / 5) / (Time in Minutes)`.
    *   `Accuracy`: `((Total Chars - Errors) / Total Chars) * 100`.

#### Phase 2: The Content Delivery (Backend)
*   **Text Management**: API to serve test content (paragraphs, code snippets).
*   **Session Management**: API to start a "Trial" (generate a session ID) and submit results.

#### Phase 3: Verification & Anti-Cheat (Backend)
*   **Replay Analysis**: When a student submits, send the full `keystrokeLog`. The backend "replays" the typing to verify the WPM matches the timestamps and that it wasn't typed "too perfectly" (bot behavior).

**Estimated Effort**:
*   **Basic Engine (Frontend)**: 3-5 days for a solid, bug-free React hook.
*   **Backend Integration**: 2-3 days to set up the schema and submission endpoints.
