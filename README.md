# typescript-AQI

## Introduction
typescript-AQI is a set of typescript functions for calculating the EPA Air Quality Index, according to the U.S. Environmental Protection Agency's Office of Air Quality Planning and Standards. 

The calculation logic and the pollutant breakpoints are pulled mainly from the Air Quality Assessment Division's [Technical Assistance Document](https://web.archive.org/web/20230614010809/https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf).


## Usage
Create an array of objects of type `pollutantMeasurementValue`, from the `types` namespace.

Each object takes two values:
* A pollutant string, with allowed values of:
    * 8-hour or 1-hour obversed Ozone levels, in parts per million (`o3_8Hour`, `o3_1Hour`)
    * 24-hour observations of particulate Matter, 2.5μm or 10μm, in μm/m^3 (`pm_25_24Hour`, `pm_10_24Hour`)
    * 8-hour observed Carbon monoxide levels, in parts per million (`co_8Hour`)
    * 1-hour observed Sulfur dioxide, in parts per billion (`so2_1Hour`)
    * 1-hour observed Nitrogen dioxide, in parts per billion (`no2_1Hour`)
* A measurement, expressed in the units above, for the given pollutant

```
let pollutantMeasurements:types.pollutantMeasurementValues[] = [
    {pollutant: "o3_8Hour", pollutantValue: 0.0503},`
    {pollutant: "co_8Hour", pollutantValue: 0.253},
    {pollutant: "no2_1Hour", pollutantValue: 7.546},
    {pollutant: "so2_1Hour", pollutantValue: 0.916},
    {pollutant: "pm_10_24Hour", pollutantValue: 12.3},
    {pollutant: "pm_25_24Hour", pollutantValue: 11.3},
];
```
Pass the object to the `calculateAQI` function of the `main` class. 

The result will be returned with a type of `formattedAQIResults`, from the `types` namespace, and will contain a number of details:

* A summary of the current Air Quality
* The critical pollutant with the highest individual AQI value
* Expanded names for the critical pollutant
* The Air Quality Index value
* The Air Quality Index category descriptor ("Good," "Moderate," etc.)
* The AQI Category colors, and the RGB, CMYK, and Hexadecimal values of each
* The sensitive groups list for all pollutants exceding an AQI of 100
* The summary of data for each individual pollutant, including:
    * The pollutant
    * Expanded names for the pollutant
    * The pollutant's AQI
    * The cautionary statements applicable to that pollutant's AQI


```
{
  summary: 'The current Air Quality Index is 47, which is Good.',
  criticalPollutant: 'o3_8Hour',
  criticalPollutantLongName: 'Ozone, 8-hour (ppm)',
  criticalPollutantShortName: 'Ozone',
  criticalPollutantAbbreviation: 'O&#8323;',
  AQI: 47,
  categoryDescriptor: 'Good',
  color: 'Green',
  colorDescriptions: {
    RGB: { R: 0, G: 228, B: 0 },
    CMYK: { C: 40, M: 0, Y: 100, K: 0 },
    Hexadecimal: '#00E400'
  },
  sensitiveGroups: '',
  pollutantDetails: [
    {
      pollutant: 'o3_8Hour',
      pollutantLongName: 'Ozone, 8-hour (ppm)',
      pollutantShortName: 'Ozone',
      pollutantAbbreviation: 'O&#8323;',
      pollutantAQI: 47,
      cautionaryStatements: ''
    },
    {
      pollutant: 'co_8Hour',
      pollutantLongName: 'Carbon Monoxide, 8-hour (ppm)',
      pollutantShortName: 'Carbon Monoxide',
      pollutantAbbreviation: 'CO',
      pollutantAQI: 3,
      cautionaryStatements: ''
    },
    {
      pollutant: 'no2_1Hour',
      pollutantLongName: 'Nitrogen Dioxide, 1-hour (ppb)',
      pollutantShortName: 'Nitrogen Dioxide',
      pollutantAbbreviation: 'NO&#8322;',
      pollutantAQI: 7,
      cautionaryStatements: ''
    },
    {
      pollutant: 'so2_1Hour',
      pollutantLongName: 'Sulfur Dioxide, 8-hour (ppb)',
      pollutantShortName: 'Sulfur Dioxide',
      pollutantAbbreviation: 'SO&#8322;',
      pollutantAQI: 1,
      cautionaryStatements: ''
    },
    {
      pollutant: 'pm_10_24Hour',
      pollutantLongName: 'Particulate Matter, 10μm, 24-hour (μg/m&sup3;)',
      pollutantShortName: 'Particulate Matter, 10μm',
      pollutantAbbreviation: 'PM&#8321;&#8320;',
      pollutantAQI: 11,
      cautionaryStatements: ''
    },
    {
      pollutant: 'pm_25_24Hour',
      pollutantLongName: 'Particulate Matter, 2.5μm, 24-hour (μg/m&sup3;)',
      pollutantShortName: 'Particulate Matter, 2.5μm',
      pollutantAbbreviation: 'PM&#8322;.&#8325;',
      pollutantAQI: 47,
      cautionaryStatements: ''
    }
  ]
}

```

## Helper Functions

A variety of helper functions are available in the `gasCalculations` class, to convert to convert among μm/m^3 and ppm/ppb, as provided and as needed.