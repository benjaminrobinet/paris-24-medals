import countryContinentAttribution from "../mocks/country-continent-attribution.json";

export type ContinentMedal = {
    continentCode: string;
    continentName: string;

    gold: number;
    silver: number;
    bronze: number;

    total: number;
    rank: number;
};

export type CountryMedal = {
    /**
     * Country code (NOC)
     * @example "USA", "FRA", etc.
     */
    noc: string;

    /**
     * Country name
     * @example "United States", "France", etc.
     */
    description: string;

    /**
     * Country name
     * @example "United States", "France", etc.
     */
    longDescription: string;
    rank: number;
    sortRank: number;
    rankTotal: number;
    sortTotalRank: number;
    nocSlug: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
    disciplines: null;
};

export type CountryMedals = {
    country: {
        code: string;
        iso_alpha_2: string;
        iso_alpha_3: string;
        name: string;
    };
    medals: {
        bronze: number;
        gold: number;
        silver: number;
        total: number;
    };
    rank: number;
};

export const splitByContinent = (medals: CountryMedals[]): ContinentMedal[] => {
    return medals
        .reduce<ContinentMedal[]>((acc, medal) => {
            const continentAttribution = countryContinentAttribution.find((country) => country.Three_Letter_Country_Code === medal.country.iso_alpha_3);

            if (!continentAttribution) {
                console.warn(`Continent attribution not found for ${medal.country.iso_alpha_3}`);
                return acc;
            }

            const currentContinent = acc.find((continent) => continent.continentCode === continentAttribution.Continent_Code);

            if (!currentContinent) {
                acc.push({
                    continentCode: continentAttribution.Continent_Code,
                    continentName: continentAttribution.Continent_Name,

                    gold: medal.medals.gold,
                    silver: medal.medals.silver,
                    bronze: medal.medals.bronze,

                    total: medal.medals.total,
                    rank: medal.rank,
                });
            } else {
                currentContinent.gold += medal.medals.gold;
                currentContinent.silver += medal.medals.silver;
                currentContinent.bronze += medal.medals.bronze;
                currentContinent.total += medal.medals.total;
            }

            return acc;
        }, [])
        .sort((a, b) => b.total - a.total);
};
