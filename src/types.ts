export namespace types{
    export interface RGBcolor{R: number, G: number, B: number}
    export interface CMYKcolor{C: number, M: number, Y: number, K: number}

    export interface pollutantMeasurementValues{
        pollutant: "o3_8Hour" | "o3_1Hour" | "pm_25_24Hour" | "pm_10_24Hour" | "co_8Hour" | "so2_1Hour" | "no2_1Hour"
        pollutantValue: number,
    }

    export interface formattedPollutantResults{
        pollutant: string,
        pollutantLongName: string,
        pollutantShortName: string,
        pollutantAbbreviation: string,
        pollutantAQI: number | undefined,
        cautionaryStatements: string,
    }

    export interface formattedAQIResults{
        summary: string,
        criticalPollutant: string,
        criticalPollutantLongName: string,
        criticalPollutantShortName: string,
        criticalPollutantAbbreviation: string,
        AQI: number | undefined,
        categoryDescriptor: string,
        color: string,
        colorDescriptions: {
            RGB: RGBcolor,
            CMYK: CMYKcolor,
            Hexadecimal: string,
        },
        sensitiveGroups?:string,
        pollutantDetails?: formattedPollutantResults[],
    }
} //Close namespace types
