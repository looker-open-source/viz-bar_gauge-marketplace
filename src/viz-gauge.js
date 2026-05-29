import VerticalGauge from './VerticalGauge';
import HorizontalGauge from './HorizontalGauge';
import {vizConfig} from './viz-config';
import React from 'react';
import ReactDOM from 'react-dom';
import {getBarDefaults, processData} from './helpers';

// const formattedValue = dataPoints[0].valueFormat === "" ? dataPoints[0].formattedValue : SSF.format(dataPoints[0].valueFormat, dataPoints[0].value)
looker.plugins.visualizations.add({
  ...vizConfig,
  // Set up the initial state of the visualization
  create: function (element, config) {
    this.container = element.appendChild(document.createElement('svg'));
    this.container.className = 'gauge-vis';
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    this.clearErrors();

    try {
      if (!data?.length) {
        this.addError({
          title: 'No Data',
          message: 'The query returned no results.',
        });
        done();
        return;
      }

      var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = element.clientWidth,
        height = element.clientHeight;

      // Throw some errors and exit if the shape of the data isn't what this chart needs
      if (
        queryResponse.fields?.dimension_like?.length > 1 ||
        queryResponse.fields?.measure_like?.length > 2
      ) {
        this.addError({
          title: 'Invalid Input.',
          message: 'This chart accepts up to 1 dimension and 2 measures.',
        });
        done();
        return;
      }

      // Extract value, value_label, target, target_label as a chunk
      let chunk;
      chunk = processData(data, queryResponse, config, this);

      if (!config.bar_range_max) {
        let num = Math.max(
          Math.ceil(chunk.value),
          chunk.target ? Math.ceil(chunk.target) : 0
        );
        var len = (num + '').length;
        var fac = Math.pow(10, len - 1);
        let default_max = Math.ceil(num / fac) * fac;
        config.bar_range_max = default_max;
      }

      this.barDefaults = getBarDefaults(width, height, margin, config, chunk);

      const Component =
        config.bar_style === 'vertical' ? VerticalGauge : HorizontalGauge;

      this.chart = ReactDOM.render(
        <Component {...this.barDefaults} doneRendering={done} />,
        this.container
      );
    } catch (error) {
      console.error('Bar Gauge Render Error:', error);
      this.addError({
        title: 'Rendering Error',
        message: 'An unexpected error occurred while drawing the gauge.',
      });
      done();
    }
  },
});
