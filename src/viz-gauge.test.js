import {getBarDefaults, processData} from './helpers';
import {
  testBarDefaultProperties,
  testChunkProperties,
  testConfig,
  testData,
  testQueryResponse,
} from './viz-gauge-test-data';
import SSF from 'ssf';

const measures = testQueryResponse['fields']['measure_like'];

describe('Should process data and return a chunk with needed configurations', () => {
  test('should return all needed properties', () => {
    const chunk = processData(
      testData,
      testQueryResponse,
      testConfig,
      undefined
    );
    const hasAllProperties = testChunkProperties.every(k =>
      chunk.hasOwnProperty(k)
    );

    expect(hasAllProperties).toBe(true);
  });
  test('should format rendered value if bar value formatting is set', () => {
    const chunk = processData(
      testData,
      testQueryResponse,
      testConfig,
      undefined
    );

    const measureId = measures[0]['name'];
    const measureData = testData[0][measureId];

    expect(chunk.value_rendered).toEqual(
      SSF.format(testConfig.bar_value_formatting, measureData.value)
    );
  });
  test('should format rendered target value if target formatting is set', () => {
    const chunk = processData(
      testData,
      testQueryResponse,
      testConfig,
      undefined
    );

    const targetId = measures[1]['name'];
    const targetData = testData[0][targetId];

    expect(chunk.target_rendered).toEqual(
      SSF.format(testConfig.bar_target_value_format, targetData.value)
    );
  });
});

describe('Should set bar defaults from processed data', () => {
  test('should return all needed properties', () => {
    const chunk = processData(
      testData,
      testQueryResponse,
      testConfig,
      undefined
    );
    const barDefaults = getBarDefaults(10, 10, 10, testConfig, chunk);

    const hasAllProperties = testBarDefaultProperties.every(k =>
      barDefaults.hasOwnProperty(k)
    );

    expect(hasAllProperties).toBe(true);
  });
});
