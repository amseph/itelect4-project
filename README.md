# Campus Study Room Reservation System

## Project Concept

The Campus Study Room Reservation System is a React and TypeScript application that allows students to view campus study rooms and reservation information. It demonstrates reusable typed components, React state management, lifecycle effects, typed DOM events, DOM references, and custom hooks.

## Current React Components

- `UserCard` displays a user's name, email, role, active status, and selection action.
- `StudyRoomCard` displays room details and allows available rooms to be selected for reservation.
- `ReservationBadge` displays the date, time, purpose, and status of a reservation.

## React Hooks Implemented

- `useState<T>` manages users, rooms, reservations, loading state, search input, selected user, and selected room.
- `useEffect` simulates loading mock data when the application first mounts.
- `useRef<HTMLInputElement>` provides a typed reference used to focus the room search input.
- `useToggle` is a custom hook used to show or hide reservation details.
- `usePrevious<T>` is a generic custom hook used to remember the previous room search value.

## Dynamic Features

- Mock data loads dynamically after a short loading state.
- Users and study rooms are rendered from typed array state.
- The room search filters results by room name or building.
- Selecting a user or reserving a room updates the visible selection summary.
- Reservation details can be shown or hidden.
- The previous search value is displayed using a custom hook.

## Setup and Execution

Install dependencies:

```bash
npm install