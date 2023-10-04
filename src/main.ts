import {types} from "./types";
import {AQICalculations} from "./AQICalculations";
import {output} from "./output";
import {helperFunctions} from "./helperFunctions";

namespace main{
    export class main{
        public static calculateAQI(pollutantMeasurements:types.pollutantMeasurementValues[]):types.formattedAQIResults{
            let pollutantResults:AQICalculations.pollutantIndex[] = [];

            for(const measurement of pollutantMeasurements){
                let pollutantResult = new AQICalculations.pollutantIndex(measurement);
                pollutantResult.calculatePollutantIndex();
                pollutantResults.push(pollutantResult);
            }
        
            let AQIResults = new AQICalculations.AQICalculations(pollutantResults);
            AQIResults.calculateResponsiblePollutant();
            AQIResults.createAQIDetails();
        
            let AQIReport = new output.formatAQIReport(pollutantResults, AQIResults);
            let formattedAQIReport:types.formattedAQIResults = AQIReport.getformattedAQIReport();
            
            return formattedAQIReport
        }
    }
}

let co:number = helperFunctions.gasCalculations.convertMicrogamPerCubicMeterToPPM('co', 290.4);
let o31:number = helperFunctions.gasCalculations.convertMicrogamPerCubicMeterToPPM('o3', 98.7);
let no2:number = helperFunctions.gasCalculations.convertMicrogamPerCubicMeterToPPB('no2', 14.2);
let so2:number = helperFunctions.gasCalculations.convertMicrogamPerCubicMeterToPPB('so2', 2.4);


let pollutantMeasurements:types.pollutantMeasurementValues[] = [
    {pollutant:"o3_8Hour", pollutantValue:o31},
    {pollutant: "co_8Hour", pollutantValue: co},
    {pollutant: "no2_1Hour", pollutantValue: no2},
    {pollutant: "so2_1Hour", pollutantValue: so2},
    {pollutant: "pm_10_24Hour", pollutantValue: 12.3},
    {pollutant: "pm_25_24Hour", pollutantValue: 11.3},  
];


let AQI:types.formattedAQIResults = main.main.calculateAQI(pollutantMeasurements);
console.log(AQI);
