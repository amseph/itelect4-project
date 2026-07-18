// Core domain types for the Campus Study Room Reservation System.

export enum Role {
  Student = "student",
  Admin = "admin",
}

export enum ReservationStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface StudyRoom {
  id: number;
  name: string;
  building: string;
  capacity: number;
  hasProjector: boolean;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  userId: number;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: ReservationStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type ID = number | string;
export type StringOrNumber = string | number;
export type RoomFeature = "projector" | "whiteboard" | "quiet-zone";
export type ReservationAction = "approve" | "reject" | "cancel";

export type ReservationWithDetails = Reservation & {
  user: User;
  room: StudyRoom;
};

export type StudyRoomUpdate = Partial<StudyRoom>;
export type StudyRoomPreview = Pick<
  StudyRoom,
  "id" | "name" | "building" | "capacity"
>;
export type PublicUser = Omit<User, "email" | "isActive">;
export type ReservationStatusCount = Record<ReservationStatus, number>;
