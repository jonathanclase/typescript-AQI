import {types} from "./types";
import {AQICalculations} from "./AQICalculations";

export namespace output{
    
    interface pollutantNames {
        [key: string]: {
            abbreviatedName: string,
            shortName: string,
            longName: string,
        }
    }

    const pollutantNames:pollutantNames = {
        o3_8Hour: {
            abbreviatedName: "O&#8323;",
            shortName: "Ozone",
            longName: "Ozone, 8-hour (ppm)"
        },
        o3_1Hour: {
            abbreviatedName: "O&#8323;",
            shortName: "Ozone",
            longName: "Ozone, 1-hour (ppm)"
        },
        pm_25_24Hour: {
            abbreviatedName: "PM&#8322;.&#8325;",
            shortName: "Particulate Matter, 2.5μm",
            longName: "Particulate Matter, 2.5μm, 24-hour (μg/m&sup3;)"
        },
        pm_10_24Hour: {
            abbreviatedName: "PM&#8321;&#8320;",
            shortName: "Particulate Matter, 10μm",
            longName: "Particulate Matter, 10μm, 24-hour (μg/m&sup3;)"
        },
        co_8Hour: {
            abbreviatedName: "CO",
            shortName: "Carbon Monoxide",
            longName: "Carbon Monoxide, 8-hour (ppm)"
        },
        so2_1Hour: {
            abbreviatedName: "SO&#8322;",
            shortName: "Sulfur Dioxide",
            longName: "Sulfur Dioxide, 8-hour (ppb)"
        },
        no2_1Hour: {
            abbreviatedName: "NO&#8322;",
            shortName: "Nitrogen Dioxide",
            longName: "Nitrogen Dioxide, 1-hour (ppb)"
        },
    }

    export class formatAQIReport{
        private _pollutantResults:AQICalculations.pollutantIndex[];
        private _AQIResults:AQICalculations.AQICalculations;


        constructor(pollutantResults:AQICalculations.pollutantIndex[], AQIResults:AQICalculations.AQICalculations){
            this._pollutantResults = pollutantResults;
            this._AQIResults = AQIResults;
        }

        public getformattedAQIReport():types.formattedAQIResults{

            let responsiblePollutant: string = this._AQIResults.getResponsiblePollutant();
            let AQI: number | undefined = this._AQIResults.getResponsiblePollutantIndex();
            let descriptor: string = this._AQIResults.getAQICategoryDescriptor();

            let formattedAQIResult:types.formattedAQIResults = {
                summary: this.formatSummary(AQI, descriptor),
                criticalPollutant: responsiblePollutant,
                criticalPollutantLongName: this.getPollutantLongName(responsiblePollutant),
                criticalPollutantShortName: this.getPollutantShortName(responsiblePollutant),
                criticalPollutantAbbreviation: this.getPollutantAbbreviation(responsiblePollutant),
                AQI:AQI,
                categoryDescriptor: descriptor,
                color: this._AQIResults.getAQICategoryColor(),
                colorDescriptions: {
                    RGB: this._AQIResults.getAQICategoryColorRGB(),
                    CMYK: this._AQIResults.getAQICategoryColorCMYK(),
                    Hexadecimal: this._AQIResults.getAQICategoryHex(),
                },
                sensitiveGroups: this.getAndFormatSensitiveGroupsList(),
                pollutantDetails: this.getFormattedPollutantResults(this._pollutantResults),
            }

            return formattedAQIResult;
        }

        private formatSummary(AQI:number | undefined, description:string):string{
            return `The current Air Quality Index is ${AQI}, which is ${description}.`
        }

        private getFormattedPollutantResults(pollutantResults:AQICalculations.pollutantIndex[]):types.formattedPollutantResults[]{
            let formattedPollutantResults:types.formattedPollutantResults[] = [];

            for(const pollutantResult of pollutantResults){
                let pollutant:string = pollutantResult.getPollutant();
                let formattedPollutantResult:types.formattedPollutantResults = {
                    pollutant: pollutant,
                    pollutantLongName: this.getPollutantLongName(pollutant),
                    pollutantShortName: this.getPollutantShortName(pollutant),
                    pollutantAbbreviation: this.getPollutantAbbreviation(pollutant),
                    pollutantAQI: pollutantResult.getPollutantAQIValue(),
                    cautionaryStatements: pollutantResult.getCautionaryStatement(),
                }
                formattedPollutantResults.push(formattedPollutantResult);
            }
            return formattedPollutantResults;
        }

        private getAndFormatSensitiveGroupsList():string{
            let sensitiveGroupsList:string[] = this._AQIResults.getSensitiveGroupsList();
            let sensitiveGroupsListDistinct:string[] = this.getDistinctSensitiveGroupValues(sensitiveGroupsList);
            let sentitiveGroupsListFormatted:string = this.formatSensitiveGroups(sensitiveGroupsListDistinct);
            return sentitiveGroupsListFormatted;
        }

        private getDistinctSensitiveGroupValues(unfilteredListOfSensitiveGroups:string[]):string[]{
            let listOfSensitiveGroups = unfilteredListOfSensitiveGroups.filter(function(value, index, array){return array.indexOf(value) === index;});
            return listOfSensitiveGroups;
        }

        private formatSensitiveGroups(sensitiveGroups:string[]):string{           
            if(sensitiveGroups.length > 0){
                let sensitiveGroupsList:string = this.formatListWithCommas(sensitiveGroups);
                sensitiveGroupsList = this.capitalizeList(sensitiveGroupsList);                

                if (sensitiveGroups.length > 1){
                    return `${sensitiveGroupsList} are the groups most at risk.`
                }
                else{
                    return `${sensitiveGroupsList} is the group most at risk.`
                }
            }
            else {
                return "";
            }
        }

        private formatListWithCommas(list:string[]):string{
            if (list.length > 1){
                list[list.length - 1] = `and ${list[list.length - 1]}`;
            }
            return list.join(', ');
        }

        private capitalizeList(list: string):string{
            return list[0].toUpperCase() + list.slice(1);
        }

        private getPollutantLongName(pollutant:string):string{
            const defaultValue: string = "";
            return pollutantNames.hasOwnProperty(pollutant) ? pollutantNames[pollutant].longName : defaultValue; 
        }

        private getPollutantShortName(pollutant:string):string{
            const defaultValue: string = "";
            return pollutantNames.hasOwnProperty(pollutant) ? pollutantNames[pollutant].shortName : defaultValue; 
        }

        private getPollutantAbbreviation(pollutant:string):string{
            const defaultValue: string = "";
            return pollutantNames.hasOwnProperty(pollutant) ? pollutantNames[pollutant].abbreviatedName : defaultValue; 
        }
    }
} //Close namespace output
