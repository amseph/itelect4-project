# Campus Study Room Reservation System

## Project Concept

This React 19 + TypeScript + Vite project models a campus study room reservation system. It displays users, study rooms, and reservation information using shared domain types from `src/types/index.ts`.

## Current React Components

- `UserCard` displays a user's name, email, role, active status, and select action.
- `StudyRoomCard` displays room details and disables reservation when the room is unavailable.
- `ReservationBadge` displays reservation date, time, purpose, status, and optional child content.

## Setup and Execution

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```
