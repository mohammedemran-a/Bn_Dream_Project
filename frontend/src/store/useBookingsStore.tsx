// import { create } from "zustand";
// import { getBookings, updateBooking, deleteBooking } from "@/api/bookings";

// interface Booking {
//   id: number;
//   user?: { name: string };
//   room?: { name: string };
//   user_id?: number;
//   room_id?: number;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   total_price: number;
//   status: string;
// }

// interface BookingsStore {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (status?: string) => Promise<void>;
//   updateStatus: (id: number, status: string) => Promise<void>;
//   deleteBooking: (id: number) => Promise<void>;
// }

// export const useBookingsStore = create<BookingsStore>((set, get) => ({
//   bookings: [],
//   loading: false,

//   fetchBookings: async (status = "الكل") => {
//     try {
//       set({ loading: true });
//       const res = await getBookings(status);
//       set({ bookings: res.data || [] });
//     } catch (error) {
//       console.error("فشل في جلب الحجوزات:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   updateStatus: async (id, status) => {
//     await updateBooking(id, { status });
//     await get().fetchBookings();
//   },

//   deleteBooking: async (id) => {
//     await deleteBooking(id);
//     await get().fetchBookings();
//   },
// }));

import { create } from "zustand";

interface BookingsState {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  statusFilter: "الكل",
  setStatusFilter: (status: string) => set({ statusFilter: status }),
}));
