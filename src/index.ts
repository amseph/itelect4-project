import type {
  ApiResponse,
  ID,
  PublicUser,
  Reservation,
  ReservationAction,
  ReservationStatusCount,
  ReservationWithDetails,
  RoomFeature,
  StringOrNumber,
  StudyRoom,
  StudyRoomPreview,
  StudyRoomUpdate,
  User,
} from "../types/index";

import { ReservationStatus, Role } from "../types/index";

// Primitive types
const systemName: string = "Campus Study Room Reservation System";
const currentYear: number = 2026;
const isOnline: boolean = true;
const maintenanceNote: null = null;
const selectedRoom: undefined = undefined;

function buildWelcomeMessage(name: string, year: number): string {
  return `${name} is ready for AY ${year}.`;
}

function logSection(title: string): void {
  console.log(`\n=== ${title} ===`);
}

logSection("System");
console.log(buildWelcomeMessage(systemName, currentYear));
console.log("Online:", isOnline);
console.log("Maintenance note:", maintenanceNote);
console.log("Selected room:", selectedRoom);

// Special types
let importedValue: any = "Room 204";
importedValue = 204;

let searchInput: unknown = "projector";
if (typeof searchInput === "string") {
  console.log("Search keyword:", searchInput.toUpperCase());
}

function failReservation(message: string): never {
  throw new Error(message);
}

// Interfaces and enums
const users: User[] = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@student.edu",
    role: Role.Student,
    isActive: true,
  },
  {
    id: 2,
    name: "Ana Reyes",
    email: "ana.admin@campus.edu",
    role: Role.Admin,
    isActive: true,
  },
];

const studyRooms: StudyRoom[] = [
  {
    id: 101,
    name: "Innovation Room",
    building: "Library",
    capacity: 6,
    hasProjector: true,
    isAvailable: true,
  },
  {
    id: 102,
    name: "Quiet Study Pod",
    building: "Engineering Hall",
    capacity: 4,
    hasProjector: false,
    isAvailable: false,
  },
];

const reservations: Reservation[] = [
  {
    id: 5001,
    userId: 1,
    roomId: 101,
    date: "2026-07-20",
    startTime: "09:00",
    endTime: "11:00",
    purpose: "Capstone group meeting",
    status: ReservationStatus.Pending,
  },
  {
    id: 5002,
    userId: 1,
    roomId: 102,
    date: "2026-07-21",
    startTime: "14:00",
    endTime: "15:30",
    purpose: "Exam review",
    status: ReservationStatus.Approved,
  },
];

logSection("Sample Data");
console.log("Users:", users);
console.log("Study rooms:", studyRooms);
console.log("Reservations:", reservations);

// Type aliases and unions
const reservationCode: ID = "RSV-5001";
const roomFeature: RoomFeature = "projector";

function formatIdentifier(value: StringOrNumber): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return `#${value.toFixed(0)}`;
}

function describeFeature(feature: RoomFeature): string {
  switch (feature) {
    case "projector":
      return "Good for presentations.";
    case "whiteboard":
      return "Good for group planning.";
    case "quiet-zone":
      return "Good for focused study.";
  }
}

logSection("Aliases, Unions, and Narrowing");
console.log("Reservation code:", formatIdentifier(reservationCode));
console.log("Room number:", formatIdentifier(101));
console.log("Feature:", describeFeature(roomFeature));

// Intersection type
const detailedReservation: ReservationWithDetails = {
  ...(reservations[0] ?? failReservation("Reservation was not found.")),
  user: users[0] ?? failReservation("User was not found."),
  room: studyRooms[0] ?? failReservation("Study room was not found."),
};

console.log("Reservation with details:", detailedReservation);

// Generic functions
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

function getById<T extends { id: number }>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id);
}

const firstRoom = getFirst(studyRooms);
const foundReservation = getById(reservations, 5002);

logSection("Generics");
console.log("First room:", firstRoom?.name);
console.log("Found reservation:", foundReservation?.purpose);

const roomsResponse: ApiResponse<StudyRoom[]> = {
  success: true,
  data: studyRooms,
  message: "Study rooms loaded.",
};

const reservationResponse: ApiResponse<Reservation> = {
  success: true,
  data: detailedReservation,
  message: "Reservation loaded.",
};

console.log("API room count:", roomsResponse.data.length);
console.log("API reservation status:", reservationResponse.data.status);

// Utility types
const roomUpdate: StudyRoomUpdate = {
  isAvailable: false,
  hasProjector: true,
};

const roomPreview: StudyRoomPreview = {
  id: 101,
  name: "Innovation Room",
  building: "Library",
  capacity: 6,
};

const publicUser: PublicUser = {
  id: 1,
  name: "Juan Dela Cruz",
  role: Role.Student,
};

const reservationStatusCount: ReservationStatusCount = {
  [ReservationStatus.Pending]: 1,
  [ReservationStatus.Approved]: 1,
  [ReservationStatus.Rejected]: 0,
  [ReservationStatus.Completed]: 0,
  [ReservationStatus.Cancelled]: 0,
};

logSection("Utility Types");
console.log("Room update:", roomUpdate);
console.log("Room preview:", roomPreview);
console.log("Public user:", publicUser);
console.log("Reservation status count:", reservationStatusCount);

// Enum-driven workflow
function applyReservationAction(
  reservation: Reservation,
  action: ReservationAction
): Reservation {
  if (action === "approve") {
    return { ...reservation, status: ReservationStatus.Approved };
  }

  if (action === "reject") {
    return { ...reservation, status: ReservationStatus.Rejected };
  }

  return { ...reservation, status: ReservationStatus.Cancelled };
}

const approvedReservation = applyReservationAction(
  reservations[0] ?? failReservation("Reservation was not found."),
  "approve"
);

logSection("Reservation Workflow");
console.log("Updated reservation:", approvedReservation);
