import { create } from "zustand";

interface SidebarStoreProps {
  refreshMenuList: () => void;
  setRefreshMenuList: (refreshMenuList: () => void) => void;
}

export const useSidebarStore = create<SidebarStoreProps>((set) => ({
  refreshMenuList: function () {},
  setRefreshMenuList: (refreshMenuList) => set({ refreshMenuList }),
}));

interface LoadingStoreProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingStoreProps>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
