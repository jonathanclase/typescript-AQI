export namespace helperFunctions{

    export class gasCalculations{
        //https://www.ccohs.ca/oshanswers/chemicals/convert.html
        public static convertMicrogamPerCubicMeterToPPM(substance: "o3" | "co" | "so2" | "no2", measure: number, molarAirVolume?: number):number{
            let milligramsPerCubicMeter: number = this.convertMicrogramPerCubicMeterToMilligramPerCubicMeter(measure);
            let partsPerMillion: number = this.convertMilligramsPerCubicMeterToPPM(substance, milligramsPerCubicMeter, molarAirVolume);
            return partsPerMillion;
        }

        public static convertMicrogamPerCubicMeterToPPB(substance: "o3" | "co" | "so2" | "no2", measure: number, molarAirVolume?: number):number{
            let milligramsPerCubicMeter: number = this.convertMicrogramPerCubicMeterToMilligramPerCubicMeter(measure);
            let partsPerMillion: number = this.convertMilligramsPerCubicMeterToPPM(substance, milligramsPerCubicMeter, molarAirVolume);
            let partsPerBillion: number = this.convertPPMToPPB(partsPerMillion);
            return partsPerBillion;
        }

        public static convertMilligramsPerCubicMeterToPPM(substance: "o3" | "co" | "so2" | "no2", measure: number, molarAirVolume: number = 24.45):number{
            let substanceMolarWeight:number = this.getMolarMassBySubstance(substance); // 28.01
            return (molarAirVolume * measure) / substanceMolarWeight;
        }

        // public static convertPPMToMilligramsPerCubicMeter(substance: "o3" | "co" | "so2" | "no2", measure: number, molarAirVolume: number = 24.45): number{
        //     let substanceMolarWeight:number = this.getMolarMassBySubstance(substance); // 28.01
        //     return (substanceMolarWeight * measure) / molarAirVolume;
        // }

        public static calculateMolarAirVolume(temp_in_C: number, pressure_in_mmHG: number):number{
            const idealGasConstant: number = 62.4;
            const kelvinZeroPoint: number = 273.15
            let molarAirVolume: number = ((idealGasConstant * (kelvinZeroPoint + temp_in_C)) / pressure_in_mmHG);
            return molarAirVolume;
        }

        private static convertPPMToPPB(ppm: number):number{
            return ppm * 1000;
        }

        private static convertPPBToPPM(ppb: number):number{
            return ppb * 0.001;
        }

        private static convertMilligramPerCubicMeterToMicrogramPerCubicMeter(mgm3: number):number{
            return mgm3 * 1000;
        }

        private static convertMicrogramPerCubicMeterToMilligramPerCubicMeter(ugm3: number):number{
            return ugm3 * 0.001;
        }

        private static getMolarMassBySubstance(substance: string):number{
            const defaultValue = 0;
            const gasMolarMasses: {[key:string]: {molarMass: number}} = {
                o3: { molarMass: 48.00, },
                co: { molarMass: 28.01, },
                so2: { molarMass: 64.06, },
                no2: { molarMass: 46.01 },
            }
            return gasMolarMasses.hasOwnProperty(substance) ? gasMolarMasses[substance].molarMass : defaultValue;
        }
    }


} //Close namespace helperFunctions