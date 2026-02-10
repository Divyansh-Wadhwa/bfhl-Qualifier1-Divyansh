# BFHL API

Small Express API that supports basic math helpers and a thin wrapper around Google Gemini.

## Project layout
- bfhl-api/
  - index.js  (server)
  - package.json
  - vercel.json

## Prerequisites
- Node.js 18+ (or compatible)
- npm

## Setup
1. Open a terminal and install dependencies:

```bash
cd bfhl-api
npm install
```

2. Create a `.env` file in `bfhl-api/` with the following variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

3. Start the server:

```bash
node index.js
```

The server listens on `http://localhost:<PORT>` (default 3000).

## API Endpoints

- GET /health
  - Response: `{ is_success: true, official_email: "<email>" }`

- POST /bfhl
  - Body must contain exactly one of the following keys: `fibonacci`, `prime`, `lcm`, `hcf`, `AI`.
  - Examples:

    Fibonacci (request next N numbers):

    ```json
    { "fibonacci": 5 }
    ```

    Prime filter (array of integers):

    ```json
    { "prime": [2, 3, 4, 5, 16, 17] }
    ```

    LCM / HCF (array of integers):

    ```json
    { "lcm": [4,6,8] }
    { "hcf": [12,18,24] }
    ```

    AI (ask short question; returns a single word):

    ```json
    { "AI": "How many continents are there?" }
    ```

  - Successful response structure:

    ```json
    {
      "is_success": true,
      "official_email": "divyansh1569.be23@chitkara.edu.in",
      "data": ...
    }
    ```

  - Error responses return `is_success: false` and a `message` describing the issue.

## Notes & Security
- I removed `bfhl-api/node_modules` and `bfhl-api/.env` from the repository tip and added a `.gitignore` to prevent re-committing them. You still need to run `npm install` locally.
- If the removed `.env` contained any real API keys, rotate them immediately — history was rewritten but rotating keys is recommended.

## Want me to...
- Add `npm start` script to `package.json`? 
- Create a small test script to exercise the endpoints?

