// import { create } from "zustand";
// import { getProducts, createProduct, updateProduct, deleteProduct } from "@/api/products";

// // -------------------------
// // واجهات TypeScript
// // -------------------------
// interface Product {
//   id: number;
//   name: string;
//   price: string | number;
//   stock: string | number;
//   category: string;
//   type: string;
//   image?: string | null;
// }

// interface Form {
//   type: string;
//   name: string;
//   price: string;
//   stock: string;
//   category: string;
//   image: File | null;
// }

// interface ProductStore {
//   products: Product[];
//   isDialogOpen: boolean;
//   editingProduct: Product | null;
//   form: Form;

//   setProducts: (products: Product[]) => void;
//   fetchProducts: () => Promise<void>;

//   setIsDialogOpen: (val: boolean) => void;
//   setEditingProduct: (product: Product | null) => void;

//   setForm: (form: Form) => void;
//   updateFormField: (key: keyof Form, value: string | File | null) => void;
//   resetForm: () => void;

//   saveProduct: () => Promise<void>;
//   deleteProductById: (id: number) => Promise<void>;
// }

// // -------------------------
// // إنشاء Zustand store
// // -------------------------
// export const useProductStore = create<ProductStore>((set, get) => ({
//   products: [],
//   isDialogOpen: false,
//   editingProduct: null,
//   form: {
//     type: "البقالة",
//     name: "",
//     price: "",
//     stock: "",
//     category: "",
//     image: null,
//   },

//   setProducts: (products) => set({ products }),
  
//   fetchProducts: async () => {
//     try {
//       const { data } = await getProducts();
//       set({ products: data });
//     } catch (error) {
//       console.error("خطأ أثناء جلب المنتجات:", error);
//     }
//   },

//   setIsDialogOpen: (val) => set({ isDialogOpen: val }),
//   setEditingProduct: (product) => set({ editingProduct: product }),

//   setForm: (form) => set({ form }),
//   updateFormField: (key, value) =>
//     set((state) => ({ form: { ...state.form, [key]: value } })),
//   resetForm: () =>
//     set({
//       form: {
//         type: "البقالة",
//         name: "",
//         price: "",
//         stock: "",
//         category: "",
//         image: null,
//       },
//     }),

//   saveProduct: async () => {
//     const { form, editingProduct, fetchProducts, resetForm } = get();
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== null) {
//         // TS: ضمان نوع صحيح
//         if (key === "image" && value instanceof File) {
//           formData.append(key, value);
//         } else {
//           formData.append(key, String(value));
//         }
//       }
//     });

//     try {
//       if (editingProduct) {
//         await updateProduct(editingProduct.id, formData);
//       } else {
//         await createProduct(formData);
//       }
//       await fetchProducts();
//       set({ isDialogOpen: false, editingProduct: null });
//       resetForm();
//     } catch (error) {
//       console.error("خطأ أثناء الحفظ:", error);
//     }
//   },

//   deleteProductById: async (id) => {
//     if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
//       try {
//         await deleteProduct(id);
//         await get().fetchProducts();
//       } catch (error) {
//         console.error("خطأ أثناء الحذف:", error);
//       }
//     }
//   },
// }));
