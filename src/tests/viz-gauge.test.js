import { getBarDefaults, processData } from "../viz-gauge";
import { testBarDefaultProperties, testChunkProperties, testConfig, testData, testQueryResponse } from "./viz-gauge-test-data";
import SSF from 'ssf';

describe('Should process data and return a chunk with needed configurations', () => {
  test('should return all needed properties', () => {
    var chunk = processData(testData, testQueryResponse, testConfig, undefined);
    var hasAllProperties = testChunkProperties.every((k) => chunk.hasOwnProperty(k));

    expect(hasAllProperties).toBe(true);
  });
  test('should format rendered value if bar value formatting is set', () => {
    var chunk = processData(testData, testQueryResponse, testConfig, undefined);

    expect(chunk.value_rendered).toEqual(SSF.format(config.bar_value_formatting, testData[0][mesID]));
  });
  test('should format rendered target value if target formatting is set', () => {
    var chunk = processData(testData, testQueryResponse, testConfig, undefined);

    expect(chunk.target_rendered).toEqual(SSF.format(config.bar_target_value_format, testData[0][tarID].value));
  });
});

describe('Should set bar defaults from processed data', () => {
  test('should return all needed properties', () => {
    var chunk = processData(testData, testQueryResponse, testConfig, undefined);
    var barDefaults = getBarDefaults(10, 10, 10, testConfig, chunk)

    var hasAllProperties = testBarDefaultProperties.every((k) => barDefaults.hasOwnProperty(k));

    expect(hasAllProperties).toBe(true);
  });
});
