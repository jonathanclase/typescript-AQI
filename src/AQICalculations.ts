import {types} from "./types";

export namespace AQICalculations{
    /*Data from Technical Assistance Document (TAD) for the Reporting of Daily Air Quality – the Air Quality Index (AQI) U.S. Environmental Protection Agency Office of Air Quality Planning and Standards Air Quality Assessment Division Research Triangle Park, NC, September, 2018
        https://web.archive.org/web/20230614010809/https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf */

    interface breakpointValues {
        low: number,
        high: number,
    }

    interface pollutantBreakpointValue extends breakpointValues{       
        AQIlow: number,
        AQIhigh: number
        cautionaryStatement?: string,
    }

    class emptyPollutantBreakpointValue implements pollutantBreakpointValue{
        low: number = 0;
        high: number = 0;
        AQIhigh: number = 0;
        AQIlow: number = 0;

        constructor(){}
    }

    interface pollutantBreakpointData {
        [key: string]: {
            truncateToDecimals: number,
            pollutantBreakpoint: pollutantBreakpointValue[],
            SensitiveGroups: string[]
        }
    }
    
    interface AQICategories extends breakpointValues {
        category: {
            descriptor: string,
            color: string
            colorRGB: {R: number, G: number, B: number},
            colorCMYK: {C: number, M: number, Y: number, K: number}
            colorHexidecimal: string,
        }
    }

    class emptyAQICategory implements AQICategories{
        low: number = 0;
        high: number = 0;
        category: {
            descriptor: string,
            color: string
            colorRGB: {R: number, G: number, B: number},
            colorCMYK: {C: number, M: number, Y: number, K: number}
            colorHexidecimal: string,
        } =  
        {
            descriptor: "",
            color: "",
            colorRGB: {R: 0, G: 0, B: 0},
            colorCMYK: {C: 0, M: 0, Y: 0, K: 0},
            colorHexidecimal: ""
        };

        constructor(){};
    }

    const AQIBreakpoints: breakpointValues[] = 
    [
        {low:0, high: 50 },   //TAD p. 14, "Table 5: Breakpoints for the AQI"
        {low:51, high: 100 },
        {low:101, high: 150 },
        {low:151, high: 200 },
        {low:201, high: 300 },
        {low:301, high: 400 },
        {low:401, high: 500 }        
    ]

    const pollutantBreakpoints: pollutantBreakpointData = {
        o3_8Hour: {
            SensitiveGroups: [ //TAD p. 7 "Table 3: Pollutant-Specific Sensitive Groups"
                "people with lung disease",
                "children",
                "older adults",
                "people who are active outdoors (including outdoor workers)",
                "people with certain genetic variants",
                "people with diets limited in certain nutrients",
            ],
            truncateToDecimals: 3, //TAD p.13 "Identify the highest concentration among all of the monitors within each reporting area and truncate as follows"
            pollutantBreakpoint: [ //TAD p.14, "Table 5: Breakpoints for the AQI"
                {low: 0, high: 0.054, AQIlow: AQIBreakpoints[0].low, AQIhigh: AQIBreakpoints[0].high },
                {low: 0.055, high: 0.07, AQIlow: AQIBreakpoints[1].low, AQIhigh: AQIBreakpoints[1].high, cautionaryStatement: "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion." },
                {low: 0.071, high: 0.085, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with lung disease (such as asthma), children, older adults, people who are active outdoors (including outdoor workers), people with certain genetic variants, and people with diets limited in certain nutrients should reduce prolonged or heavy outdoor exertion."},
                {low: 0.086, high: 0.105, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "People with lung disease (such as asthma), children, older adults, people who are active outdoors (including outdoor workers), people with certain genetic variants, and people with diets limited in certain nutrients should avoid prolonged or heavy outdoor exertion; everyone else should reduce prolonged or heavy outdoor exertion." },
                {low: 0.106, high: 0.200, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "People with lung disease (such as asthma), children, older adults, people who are active outdoors (including outdoor workers), people with certain genetic variants, and people with diets limited in certain nutrients should avoid all outdoor exertion; everyone else should reduce outdoor exertion."},
            ],
        },
        o3_1Hour: {
            SensitiveGroups: [
                "people with lung disease",
                "children",
                "older adults",
                "people who are active outdoors (including outdoor workers)",
                "people with certain genetic variants",
                "people with diets limited in certain nutrients",
            ],
            truncateToDecimals: 3,
            pollutantBreakpoint: [
                {low: 0.125, high: 0.164, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with lung disease (such as asthma), children, older adults, people who are active outdoors (including outdoor workers), people with certain genetic variants, and people with diets limited in certain nutrients should reduce prolonged or heavy outdoor exertion." },
                {low: 0.165, high: 0.204, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "People with lung disease (such as asthma), children, older adults, people who are active outdoors (including outdoor workers), people with certain genetic variants, and people with diets limited in certain nutrients should avoid prolonged or heavy outdoor exertion; everyone else should reduce prolonged or heavy outdoor exertion." },
                {low: 0.205, high: 0.404, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "People with lung disease (such as asthma), children, older adults, people who are active outdoors (including outdoor workers), people with certain genetic variants, and people with diets limited in certain nutrients should avoid all outdoor exertion; everyone else should reduce outdoor exertion."},
                {low: 0.405, high: 0.504, AQIlow: AQIBreakpoints[5].low, AQIhigh: AQIBreakpoints[5].high, cautionaryStatement: "Everyone should avoid all outdoor exertion."},
                {low: 0.505, high: 0.604, AQIlow: AQIBreakpoints[6].low, AQIhigh: AQIBreakpoints[6].high, cautionaryStatement: "Everyone should avoid all outdoor exertion."},
            ]
        },
        pm_25_24Hour: {
            SensitiveGroups: [
                "people with lung disease",
                "people with heart disease",
                "older adults",
                "children",
                "people of lower socioeconomic status",
            ],
            truncateToDecimals: 1,
            pollutantBreakpoint: [
                {low: 0.0, high: 12.0, AQIlow: AQIBreakpoints[0].low, AQIhigh: AQIBreakpoints[0].high},
                {low: 12.1, high: 35.4, AQIlow: AQIBreakpoints[1].low, AQIhigh: AQIBreakpoints[1].high, cautionaryStatement: "Unusually sensitive people should consider reducing prolonged or heavy exertion."},
                {low: 35.5, high: 55.4, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with heart or lung disease, older adults, children, and people of lower socioeconomic status should reduce prolonged or heavy exertion."},
                {low: 55.5, high: 150.4, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "People with heart or lung disease, older adults, children, and people of lower socioeconomic status should avoid prolonged or heavy exertion; everyone else should reduce prolonged or heavy exertion."},
                {low: 150.5, high: 250.4, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "People with heart or lung disease, older adults, children, and people of lower socioeconomic status should avoid all physical activity outdoors. Everyone else should avoid prolonged or heavy exertion."},
                {low: 250.5, high: 350.4, AQIlow: AQIBreakpoints[5].low, AQIhigh: AQIBreakpoints[5].high, cautionaryStatement: "Everyone should avoid all physical activity outdoors; people with heart or lung disease, older adults, children, and people of lower socioeconomic status should remain indoors and keep activity levels low."},
                {low: 350.5, high: 500.4, AQIlow: AQIBreakpoints[6].low, AQIhigh: AQIBreakpoints[6].high, cautionaryStatement: "Everyone should avoid all physical activity outdoors; people with heart or lung disease, older adults, children, and people of lower socioeconomic status should remain indoors and keep activity levels low."},
            ]
        },
        pm_10_24Hour: {
            SensitiveGroups: [
                "people with lung disease",
                "people with heart disease",
                "older adults",
                "children",
                "people of lower socioeconomic status",
            ],            
            truncateToDecimals: 0,
            pollutantBreakpoint: [
                {low: 0, high: 54, AQIlow: AQIBreakpoints[0].low, AQIhigh: AQIBreakpoints[0].high},
                {low: 55, high: 154, AQIlow: AQIBreakpoints[1].low, AQIhigh: AQIBreakpoints[1].high, cautionaryStatement: "Unusually sensitive people should consider reducing prolonged or heavy exertion."},
                {low: 155, high: 254, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with heart or lung disease, older adults, children, and people of lower socioeconomic status should reduce prolonged or heavy exertion."},
                {low: 255, high: 354, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "People with heart or lung disease, older adults, children, and people of lower socioeconomic status should avoid prolonged or heavy exertion; everyone else should reduce prolonged or heavy exertion."},
                {low: 355, high: 424, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "People with heart or lung disease, older adults, children, and people of lower socioeconomic status should avoid all physical activity outdoors. Everyone else should avoid prolonged or heavy exertion."},
                {low: 425, high: 504, AQIlow: AQIBreakpoints[5].low, AQIhigh: AQIBreakpoints[5].high, cautionaryStatement: "Everyone should avoid all physical activity outdoors; people with heart or lung disease, older adults, children, and people of lower socioeconomic status should remain indoors and keep activity levels low."},
                {low: 505, high: 604, AQIlow: AQIBreakpoints[6].low, AQIhigh: AQIBreakpoints[6].high, cautionaryStatement: "Everyone should avoid all physical activity outdoors; people with heart or lung disease, older adults, children, and people of lower socioeconomic status should remain indoors and keep activity levels low."},
            ]
        },
        co_8Hour: {
            SensitiveGroups: [
                "people with heart disease",
            ],
            truncateToDecimals: 1,
            pollutantBreakpoint: [
                {low: 0.0, high: 4.4, AQIlow: AQIBreakpoints[0].low, AQIhigh: AQIBreakpoints[0].high},
                {low: 4.5, high: 9.4, AQIlow: AQIBreakpoints[1].low, AQIhigh: AQIBreakpoints[1].high},
                {low: 9.5, high: 12.4, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with heart disease, such as angina, should limit heavy exertion and avoid sources of CO, such as heavy traffic."},
                {low: 12.5, high: 15.4, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "People with heart disease, such as angina, should limit moderate exertion and avoid sources of CO, such as heavy traffic."},
                {low: 15.5, high: 30.4, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "People with heart disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic."},
                {low: 30.5, high: 40.4, AQIlow: AQIBreakpoints[5].low, AQIhigh: AQIBreakpoints[5].high, cautionaryStatement: "People with heart disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic; everyone else should limit heavy exertion."},
                {low: 40.5, high: 50.4, AQIlow: AQIBreakpoints[6].low, AQIhigh: AQIBreakpoints[6].high, cautionaryStatement: "People with heart disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic; everyone else should limit heavy exertion."},
            ]
        },
        so2_1Hour: { //SO2 has an exception case for 1-hour AQIs above 200, not yet implemented here
            SensitiveGroups: [
                "people with asthma",
                "children",
                "older adults",
            ],
            truncateToDecimals: 0,
            pollutantBreakpoint: [
                {low: 0, high: 35, AQIlow: AQIBreakpoints[0].low, AQIhigh: AQIBreakpoints[0].high},
                {low: 36, high: 75, AQIlow: AQIBreakpoints[1].low, AQIhigh: AQIBreakpoints[1].high},
                {low: 76, high: 185, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with asthma should consider limiting outdoor exertion."},
                {low: 186, high: 304, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "Children, people with asthma, or other lung diseases, should limit outdoor exertion."},
                {low: 305, high: 604, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "Children, people with asthma, or other lung diseases should avoid outdoor exertion; everyone else should reduce outdoor exertion"},
                {low: 605, high: 804, AQIlow: AQIBreakpoints[5].low, AQIhigh: AQIBreakpoints[5].high, cautionaryStatement: "Children, people with asthma, or other lung diseases, should remain indoors; everyone else should avoid outdoor exertion."},
                {low: 805, high: 1004, AQIlow: AQIBreakpoints[6].low, AQIhigh: AQIBreakpoints[6].high, cautionaryStatement: "Children, people with asthma, or other lung diseases, should remain indoors; everyone else should avoid outdoor exertion."},
            ]
        },        
        no2_1Hour: {
            SensitiveGroups: [
                "people with asthma",
                "children",
                "older adults",
            ],
            truncateToDecimals: 0,
            pollutantBreakpoint: [
                {low: 0, high: 53, AQIlow: AQIBreakpoints[0].low, AQIhigh: AQIBreakpoints[0].high},
                {low: 54, high: 100, AQIlow: AQIBreakpoints[1].low, AQIhigh: AQIBreakpoints[1].high, cautionaryStatement: "Unusually sensitive individuals should consider limiting prolonged exertion especially near busy roads."}, 
                {low: 101, high: 360, AQIlow: AQIBreakpoints[2].low, AQIhigh: AQIBreakpoints[2].high, cautionaryStatement: "People with asthma, children and older adults should limit prolonged exertion especially near busy roads."},
                {low: 361, high: 649, AQIlow: AQIBreakpoints[3].low, AQIhigh: AQIBreakpoints[3].high, cautionaryStatement: "People with asthma, children and older adults should avoid prolonged exertion near roadways; everyone else should limit prolonged exertion especially near busy roads."},
                {low: 650, high: 1249, AQIlow: AQIBreakpoints[4].low, AQIhigh: AQIBreakpoints[4].high, cautionaryStatement: "People with asthma, children and older adults should avoid all outdoor exertion; everyone else should avoid prolonged exertion especially near busy roads."},
                {low: 1250, high: 1649, AQIlow: AQIBreakpoints[5].low, AQIhigh: AQIBreakpoints[5].high, cautionaryStatement: "People with asthma, children and older adults should remain indoors; everyone else should avoid all outdoor exertion."},
                {low: 1650, high: 2049, AQIlow: AQIBreakpoints[6].low, AQIhigh: AQIBreakpoints[6].high, cautionaryStatement: "People with asthma, children and older adults should remain indoors; everyone else should avoid all outdoor exertion."},
            ]
        },
    } //Close pollutantBreakpoints

    const AQIRanges: AQICategories[] = [    
        {low:0, high: 50,
			category:{descriptor: "Good", color:"Green",     //TAD p. 6, "Table 1. Names and colors for the six AQI categories"
            colorRGB:{R:0, G: 228, B: 0},                    //TAD p. 6, "Table 2. AQI color formulas"
            colorCMYK:{C:40, M:0, Y:100, K:0},
            colorHexidecimal:"#00E400"}
        },
        {low:51, high: 100,
			category: {descriptor: "Moderate", color:"Yellow", 
            colorRGB:{R:255, G: 255, B: 0},
            colorCMYK:{C:0, M:0, Y:100, K:0},
            colorHexidecimal:"FFFF00"}
        },
        {low:101, high: 150,
			category: {descriptor: "Unhealthy for Sensitive Groups", color:"Orange",
            colorRGB:{R:255, G: 126, B: 0},
            colorCMYK:{C:0, M:52, Y:100, K:0},
            colorHexidecimal:"#FF7E00"}
        },
        {low:151, high: 200,
			category: {descriptor: "Unhealthy", color:"Red",
            colorRGB:{R:255, G: 0, B: 0},
            colorCMYK:{C:0, M:100, Y:100, K:0}, colorHexidecimal:"#FF0000"}
        },
        {low:201, high: 300,
			category: {descriptor: "Very Unhealthy", color:"Purple",
            colorRGB:{R:143, G: 63, B: 151},
            colorCMYK:{C:51, M:89, Y:0, K:0},
            colorHexidecimal:"#8F3F97"}
        },
        {low:301, high: 500,
			category: {descriptor: "Hazardous", color:"Maroon",
            colorRGB:{R:126, G:0, B:35},
            colorCMYK:{C:30, M:100, Y:100, K:30},
            colorHexidecimal:"#7E0023"}
        },
    ]    

    export class pollutantIndex{    

        private _measurement: number;
        private _pollutant: string;
        private _pollutantAQIValue?: number;
        private _cautionaryStatement?: string;

        constructor(pollutantMeasurement:types.pollutantMeasurementValues){
            this._measurement = pollutantMeasurement.pollutantValue;
            this._pollutant = pollutantMeasurement.pollutant;
        }

        public getPollutant():string{
            return this._pollutant;
        }

        public getMeasurement():number{
            return this._measurement;
        }

        public getPollutantAQIValue(): number | undefined{
            return this._pollutantAQIValue;
        }

        public getAQI100SensitiveGroups():string[]{
            if(typeof this._pollutantAQIValue !== 'undefined'){
                const defaultValue:string[] = [];
                if(this._pollutantAQIValue > 100){
                    return this.getPollutantSensitiveGroupsByPollutant(this._pollutant);
                }
                else{
                    return defaultValue;
                }
            }
            else{
                throw new Error("Cannot derive sensitive groups before the pollutant AQI has been calculated".);
            }
        }

        public getCautionaryStatement():string{
            if(typeof this._pollutantAQIValue !== 'undefined'){
                const defaultValue:string = "";
                if(typeof this._cautionaryStatement !== 'undefined'){
                    return this._cautionaryStatement;
                }
                else{
                    return defaultValue;
                }
            }
            else{
                throw new Error("Cannot get cautionary statement before the pollutant AQI has been calculated.");
            }
        }

        //TAD p. 13, "II. CALCULATING THE AQI"
        public calculatePollutantIndex():void{
            let truncateToDecimalValue:number = this.getPollutantTruncateToDecaimalValueByPollutant(this._pollutant);
            let truncatedDecimalValue:number = this.truncateDecimalValueToPlaces(this._measurement, truncateToDecimalValue);

            let pollutantBreakpoints:pollutantBreakpointValue[] = this.getPollutantBreakpointsByPollutant(this._pollutant);

            let breakpointRange:pollutantBreakpointValue = this.getPollutantBreakpointRangeThatIncludesValue(this._measurement, pollutantBreakpoints);
            this._cautionaryStatement = breakpointRange.cautionaryStatement;
            
            let AQIIndex:number = this.calculateAQIIndex(this._measurement, breakpointRange);
            
            let roundedAQIIndex:number = Math.round(AQIIndex);
            
            this._pollutantAQIValue = roundedAQIIndex;
        }
        
        //TAD p. 13, "II. CALCULATING THE AQI" - Step a
        private truncateDecimalValueToPlaces(originalValue:number, truncateToDecimalvalue:number):number{
            let regExp: RegExp = new RegExp("-?\\d+(?:.\\d{0," + truncateToDecimalvalue + "})?")
            let truncatedString:string = originalValue.toString().match(regExp)?.[0] || "";
            return parseFloat(truncatedString);
        }
        
        private getPollutantBreakpointRangeThatIncludesValue(originalValue:number, breakpoint:pollutantBreakpointValue[]):pollutantBreakpointValue{
            return breakpointSearch.getBreakpointRangeThatIncludesValue(originalValue, breakpoint);
        }
        
        //TAD p. 13, "Equation 1"
        private calculateAQIIndex(originalValue:number, pollutantBreakpoints: pollutantBreakpointValue):number{
            let cp:number = originalValue;
            let bphi:number = pollutantBreakpoints.high;
            let bplo:number = pollutantBreakpoints.low;
            let ihi:number = pollutantBreakpoints.AQIhigh;
            let ilo:number = pollutantBreakpoints.AQIlow
            let index:number = ((((ihi - ilo) / (bphi - bplo)) * (cp - bplo)) + ilo);
            return isNaN(index) ? 0 : index;
        }

        private getPollutantBreakpointsByPollutant(pollutant: string): pollutantBreakpointValue[]{
            const defaultValue: pollutantBreakpointValue[] = [new emptyPollutantBreakpointValue()];
            return pollutantBreakpoints.hasOwnProperty(pollutant) ? pollutantBreakpoints[pollutant].pollutantBreakpoint : defaultValue;
        }
        
        private getPollutantTruncateToDecaimalValueByPollutant(pollutant: string): number{
            const defaultValue: number = 0;
            return pollutantBreakpoints.hasOwnProperty(pollutant) ? pollutantBreakpoints[pollutant].truncateToDecimals: defaultValue;
        }
        
        private getPollutantSensitiveGroupsByPollutant(pollutant: string): string[]{
            const defaultValue: string[] = [];
            return pollutantBreakpoints.hasOwnProperty(pollutant) ? pollutantBreakpoints[pollutant].SensitiveGroups : defaultValue;
        }
    } //Close pollutantIndex

    export class AQICalculations{

        private _responsiblePollutant:string = "";
        private _responsiblePollutantIndex: number | undefined;
        private _sensitiveGroups: string[] = [""];
        private _pollutantIndexes:AQICalculations.pollutantIndex[];
        private _AQICategoryInfo:AQICategories = new emptyAQICategory();

        constructor(pollutantIndexes:AQICalculations.pollutantIndex[]){
            this._pollutantIndexes = pollutantIndexes;
        }

        public getSensitiveGroupsList():string[]{
            return this._sensitiveGroups;
        }

        public getResponsiblePollutant():string{
            return this._responsiblePollutant;
        }

        public getResponsiblePollutantIndex():number | undefined{
            return this._responsiblePollutantIndex;
        }

        public getAQICategoryDescriptor():string{
            return this._AQICategoryInfo.category.descriptor;
        }

        public getAQICategoryColor():string{
            return this._AQICategoryInfo.category.color;
        }

        public getAQICategoryColorRGB():types.RGBcolor{
            return this._AQICategoryInfo.category.colorRGB;
        }

        public getAQICategoryColorCMYK():types.CMYKcolor{
            return this._AQICategoryInfo.category.colorCMYK;
        }

        public getAQICategoryHex():string{
            return this._AQICategoryInfo.category.colorHexidecimal;
        }

        public calculateResponsiblePollutant():void{ //Move to AQI class
            let responsiblePollutant:AQICalculations.pollutantIndex = this.sortAQIIndexes(this._pollutantIndexes)[0];

            this._responsiblePollutant = responsiblePollutant.getPollutant();
            this._responsiblePollutantIndex = responsiblePollutant.getPollutantAQIValue();
        }

        public createAQIDetails():void{
            this._AQICategoryInfo = this.findAQIBreakpointforCritcalPollutant()
            this._sensitiveGroups = this.createSensitiveGroupsList();
        }

        private createSensitiveGroupsList():string[]{
            let sensitiveGroupsList:string[] = []
            for(const pollutantIndex of this._pollutantIndexes){
                sensitiveGroupsList.push(...pollutantIndex.getAQI100SensitiveGroups())
            }
            return sensitiveGroupsList;
        }

        private sortAQIIndexes(pollutantIndexes: pollutantIndex[]):pollutantIndex[]{
            let sortedPollutantIndex:pollutantIndex[] = [...pollutantIndexes] //Create a copy of the array so that we don't change the sort order of the original
            sortedPollutantIndex.sort(function(a, b){
                let aValue:number = ((typeof a.getPollutantAQIValue() !== 'undefined' ? a.getPollutantAQIValue() : 0) as number);
                let bValue:number = ((typeof b.getPollutantAQIValue() !== 'undefined' ? b.getPollutantAQIValue() : 0) as number);
                return bValue - aValue;
            })
            return sortedPollutantIndex;
        }

        private findAQIBreakpointforCritcalPollutant():AQICategories{
            if (typeof this._responsiblePollutantIndex !== 'undefined'){
                return breakpointSearch.getBreakpointRangeThatIncludesValue(this._responsiblePollutantIndex, AQIRanges);
            }
            else{
                throw new Error("Cannot find breakponit before the responsible pollutant has been calculated");
            }
        }

    } //Close AQICalculations class

    class breakpointSearch{
        public static getBreakpointRangeThatIncludesValue<T extends breakpointValues>(originalValue:number, breakpoint:T[]):T{
            let left:number = 0;
            let max:number = breakpoint.length - 1;
            let right:number = max;
            let rangeIndex:number = 0;
            
            while (left < right) {
                const mid:number = Math.floor((left + right) / 2);
                const range:T = breakpoint[mid];
                
                if (originalValue >= range.low && originalValue <= range.high){
                    rangeIndex = mid;
                    break;
                }
                else if (originalValue < range.low){
                    right = Math.max(mid - 1, 0);
                }
                else{
                    left = Math.min(mid + 1, max);
                }
            }

            if(left >= max && rangeIndex == 0){
                rangeIndex = max; //TAD p. 10 "What health effects and cautionary statements should I use if the AQI goes above 500? If the AQI is higher than 500, it is called “Beyond the AQI.” Use the same information that is for the Hazardous category."
            }

            return breakpoint[rangeIndex];
        }        
    } //Close breakpointSearch
    
} //Close namespace AQICalculations
