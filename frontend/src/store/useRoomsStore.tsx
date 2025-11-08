// import { create } from "zustand";
// import { getRooms, createRoom, updateRoom, deleteRoom } from "@/api/rooms";

// interface Room {
//   id?: number;
//   category: string;
//   name: string;
//   price: number;
//   capacity: number;
//   status: string;
//   description: string;
//   features: string;
//   image?: File | null;
//   image_path?: string;
// }

// interface RoomsStore {
//   rooms: Room[];
//   loading: boolean;
//   fetchRooms: () => Promise<void>;
//   createRoom: (data: FormData) => Promise<void>;
//   updateRoom: (id: number, data: FormData) => Promise<void>;
//   deleteRoom: (id: number) => Promise<void>;
//   updateRoomStatus: (id: number, status: string) => void;
// }

// export const useRoomsStore = create<RoomsStore>((set, get) => ({
//   rooms: [],
//   loading: false,

//   fetchRooms: async () => {
//     try {
//       set({ loading: true });
//       const { data } = await getRooms();
//       set({ rooms: data });
//     } catch (e) {
//       console.error("خطأ أثناء جلب الغرف:", e);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   createRoom: async (formData) => {
//     await createRoom(formData);
//     await get().fetchRooms();
//   },

//   updateRoom: async (id, formData) => {
//     await updateRoom(id, formData);
//     await get().fetchRooms();
//   },

//   deleteRoom: async (id) => {
//     await deleteRoom(id);
//     await get().fetchRooms();
//   },

//   updateRoomStatus: (id, status) => {
//     set({
//       rooms: get().rooms.map(room =>
//         room.id === id ? { ...room, status } : room
//       )
//     });
//   },
// }));
