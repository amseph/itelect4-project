# Campus Study Room Reservation System

## Project Concept

This project is a Campus Study Room Reservation System for ITELECT4 GT1 Part 2.
It models how students reserve campus study rooms and how administrators review
reservation requests.

The project is intentionally simple and console-based. Its purpose is to
demonstrate TypeScript concepts using realistic entities instead of building a
full application.

## Defined Core Types & Interfaces

The main domain entities are defined in `types/index.ts`.

- `User` represents a student or administrator.
- `StudyRoom` represents a reservable campus room.
- `Reservation` represents a booking request for a study room.
- `Role` defines the allowed user roles: `student` and `admin`.
- `ReservationStatus` defines the reservation flow: `pending`, `approved`,
  `rejected`, `completed`, and `cancelled`.
- `ApiResponse<T>` is a reusable generic interface for typed API-style results.

## TypeScript Concepts Demonstrated

This project demonstrates the following TypeScript concepts:

- Primitive types: `string`, `number`, `boolean`, `null`, and `undefined`
- Special types: `any`, `unknown`, `void`, and `never`
- Interfaces for structured objects
- Type aliases for IDs, room features, and reservation actions
- Union types for flexible values and limited options
- Intersection types through `ReservationWithDetails`
- Type narrowing with `typeof` and `switch`
- Enums for roles and reservation statuses
- Generic interface: `ApiResponse<T>`
- Generic functions: `getFirst<T>` and `getById<T extends { id: number }>`
- Utility types: `Partial<StudyRoom>`, `Pick<StudyRoom>`, `Omit<User>`, and
  `Record<ReservationStatus, number>`

## Setup and Execution

Install dependencies:

```bash
npm install
```

Run the TypeScript demo:

```bash
npx ts-node src/index.ts
```

Check TypeScript without generating files:

```bash
npx tsc --noEmit
```
