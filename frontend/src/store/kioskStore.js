import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useKioskStore = create(
    persist(
        (set) => ({
            officeId: null,
            officeName: null,
            setOffice: (officeId, officeName) => set({ officeId, officeName }),
            clearOffice: () => set({ officeId: null, officeName: null })
        }),
        {
            name: "kiosk-storage",
        }
    )
)
