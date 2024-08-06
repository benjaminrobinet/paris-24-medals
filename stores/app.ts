type AppStoreState = {
    hoverContinent: null | string;
    currentContinent: null | string;
};

export const useAppStore = defineStore("app", {
    state: (): AppStoreState => ({ hoverContinent: null, currentContinent: null }),
    actions: {
        setHoverContinent(continent: string | null) {
            this.hoverContinent = continent;
        },
        setCurrentContinent(continent: string | null) {
            this.currentContinent = continent;
        },
    },
});
