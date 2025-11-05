import { create } from "zustand";
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/api/orders";
import { toast } from "sonner";

interface Order {
  id: number;
  user: { name: string; phone?: string } | null;
  total: number;
  status: string;
  created_at: string;
  products: {
    id: number;
    name: string;
    pivot: { quantity: number; price: number };
  }[];
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  updateStatus: (id: number, status: string) => Promise<void>;
  removeOrder: (id: number) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,

  setOrders: (orders) => set({ orders }),
  setLoading: (loading) => set({ loading }),

  fetchOrders: async () => {
    try {
      set({ loading: true });
      const data = await getAllOrders();
      set({ orders: data });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء جلب الطلبات ❌");
    } finally {
      set({ loading: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("تم تحديث حالة الطلب ✅");

      // تحديث الحالة محليًا بدون إعادة جلب كل الطلبات
      set({
        orders: get().orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
      });
    } catch (error) {
      console.error(error);
      toast.error("فشل تحديث حالة الطلب ❌");
    }
  },

  removeOrder: async (id) => {
    try {
      await deleteOrder(id);
      toast.success("تم حذف الطلب بنجاح ✅");

      // حذف الطلب محليًا بدون إعادة جلب كل الطلبات
      set({
        orders: get().orders.filter((order) => order.id !== id),
      });
    } catch (error) {
      console.error(error);
      toast.error("فشل حذف الطلب ❌");
    }
  },
}));
