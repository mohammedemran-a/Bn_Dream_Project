import { create } from "zustand";

interface BookingsState {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  statusFilter: "الكل",
  setStatusFilter: (status: string) => set({ statusFilter: status }),
}));
