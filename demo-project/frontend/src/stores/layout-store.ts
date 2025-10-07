/**
 * Layout Store - Final Fix Attempt
 * Using different export patterns to avoid Vite issues
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Export types first
export type LayoutType = 'sidebar' | 'top';

export type LayoutConfig = {
  type: LayoutType;
  collapsed?: boolean;
  theme?: 'light' | 'dark';
  fixed?: boolean;
  width?: number;
  height?: number;
};

export type LayoutContextType = {
  layout: LayoutConfig;
  setLayout: (layout: LayoutConfig) => void;
  toggleLayout: () => void;
  toggleCollapse: () => void;
  isSidebar: boolean;
  isTop: boolean;
  isCollapsed: boolean;
  isLoading: boolean;
};

// Constants
const STORAGE_KEYS = {
  LAYOUT_CONFIG: 'layoutConfig',
  LAYOUT_HISTORY: 'layoutHistory',
  USER_PREFERENCES: 'userPreferences',
} as const;

// Internal types
type LayoutState = {
  layout: LayoutConfig;
  isLoading: boolean;
  error: string | null;
};

type LayoutActions = {
  setLayout: (config: Partial<LayoutConfig>) => void;
  toggleCollapse: () => void;
  toggleLayoutType: () => void;
  resetLayout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

type LayoutStore = LayoutState & LayoutActions & {
  isSidebar: boolean;
  isTop: boolean;
  isCollapsed: boolean;
};

// Default config
const defaultLayout: LayoutConfig = {
  type: 'sidebar',
  collapsed: false,
  theme: 'light',
  fixed: true,
  width: 240,
  height: 64,
};

// Store implementation
export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      layout: defaultLayout,
      isLoading: false,
      error: null,

      get isSidebar() {
        return get().layout.type === 'sidebar';
      },
      get isTop() {
        return get().layout.type === 'top';
      },
      get isCollapsed() {
        return get().layout.collapsed || false;
      },

      setLayout: (config: Partial<LayoutConfig>) => {
        const newLayout = { ...get().layout, ...config };
        console.log('LayoutStore: setLayout called', { old: get().layout, new: newLayout });
        set({ layout: newLayout, error: null });
      },

      toggleLayoutType: () => {
        const currentLayout = get().layout;
        const newType: LayoutType = currentLayout.type === 'sidebar' ? 'top' : 'sidebar';

        set({
          layout: {
            ...currentLayout,
            type: newType,
            collapsed: newType === 'top' ? false : currentLayout.collapsed,
          },
          error: null,
        });
      },

      toggleCollapse: () => {
        const currentLayout = get().layout;
        if (currentLayout.type === 'sidebar') {
          set({
            layout: {
              ...currentLayout,
              collapsed: !currentLayout.collapsed,
            },
            error: null,
          });
        }
      },

      resetLayout: () => set({ layout: defaultLayout, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: STORAGE_KEYS.LAYOUT_CONFIG,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          console.log('LayoutStore: getItem', { name, value: str });
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          console.log('LayoutStore: setItem', { name, value });
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          console.log('LayoutStore: removeItem', { name });
          localStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

// Selectors
export const selectLayout = (state: LayoutStore) => state.layout;
export const selectIsSidebar = (state: LayoutStore) => state.isSidebar;
export const selectIsTop = (state: LayoutStore) => state.isTop;
export const selectIsCollapsed = (state: LayoutStore) => state.isCollapsed;
export const selectIsLoading = (state: LayoutStore) => state.isLoading;
