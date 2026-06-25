import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrailEntry {
  path: string;
  label: string;
  timestamp: number;
}

interface UserTrailState {
  trail: TrailEntry[];
  addVisit: (path: string, label: string) => void;
  getCurrentPage: () => TrailEntry | null;
  getHistory: () => TrailEntry[];
  clearTrail: () => void;
}

export const useUserTrailStore = create<UserTrailState>()(
  persist(
    (set, get) => ({
      trail: [],

      addVisit: (path: string, label: string) => {
        set((state) => {
          const existing = state.trail.filter((entry) => entry.path !== path);
          return {
            trail: [
              ...existing,
              { path, label, timestamp: Date.now() },
            ],
          };
        });
      },

      getCurrentPage: () => {
        const { trail } = get();
        if (trail.length === 0) return null;
        return trail.reduce((latest, entry) =>
          entry.timestamp > latest.timestamp ? entry : latest
        );
      },

      getHistory: () => {
        const { trail } = get();
        return [...trail].sort((a, b) => a.timestamp - b.timestamp);
      },

      clearTrail: () => {
        set({ trail: [] });
      },
    }),
    {
      name: 'user-trail-storage',
    }
  )
);
