import SSF from 'ssf';

export function processData(data, queryResponse, config, viz) {
  const dims = queryResponse['fields']['dimension_like'];
  const meas = queryResponse['fields']['measure_like'];

  let dimID, dimData;
  let mesID, mesData, mesLabel, mesRendered;
  let tarID, tarData, tarValue, tarLabel, tarBase, tarRendered, tarDim;

  if (dims.length > 0) {
    dimID = dims[0]['name'];
    dimData = data[0][dimID];
  }
  if (
    config.bar_value_label_type === 'dim' ||
    config.bar_value_label_type === 'dboth'
  ) {
    if (dims.length === 0 && viz) {
      viz.addError({
        title: 'Invalid Input.',
        message: 'Add a dimension or modify label type.',
      });
    }
  }
  if (
    config.bar_target_label_type === 'dim' ||
    config.bar_target_label_type === 'dboth'
  ) {
    if (dims.length === 0 && viz) {
      viz.addError({
        title: 'Invalid Input.',
        message: 'Add a dimension or modify label type.',
      });
    }
  }
  mesID = meas[0]['name'];
  mesData = data[0][mesID];
  mesLabel =
    meas[0]['label_short'] === undefined
      ? meas[0]['label']
      : meas[0]['label_short'];
  mesRendered =
    mesData.rendered === undefined ? mesData.value : mesData.rendered;

  if (config.bar_target_source === 'second') {
    if (meas.length < 2 && viz) {
      viz.addError({
        title: 'Invalid Input.',
        message: 'Add a second measure or modify label type.',
      });
    }
    tarID = meas[1]['name'];
    tarData = data[0][tarID];
    tarValue = tarData.value;
    tarLabel =
      meas[1]['label_short'] === undefined
        ? meas[1]['label']
        : meas[1]['label_short'];
    tarBase = tarData.rendered === undefined ? tarData.value : tarData.rendered;
    tarRendered =
      config.bar_target_value_format === undefined ||
      config.bar_target_value_format === ''
        ? tarBase
        : SSF.format(config.bar_target_value_format, tarValue);
    if (dims.length > 0) {
      tarDim =
        config.bar_target_label_override === undefined ||
        config.bar_target_label_override === ''
          ? data[0][dimID].value
          : config.bar_target_label_override;
    }
  } else if (config.bar_target_source === 'first') {
    if (data.length < 2 && viz) {
      viz.addError({
        title: 'Invalid Input.',
        message: 'No value to target. Add a second row or modify label type.',
      });
    }
    tarData = data[1][mesID];
    tarValue = tarData.value;
    tarBase =
      tarData.rendered === undefined || tarData.rendered === ''
        ? tarValue
        : tarData.rendered;
    tarLabel = mesLabel;
    tarRendered =
      config.bar_target_value_format === undefined ||
      config.bar_target_value_format === ''
        ? tarBase
        : SSF.format(config.bar_target_value_format, tarValue);
    if (dims.length > 0) {
      tarDim =
        config.bar_target_label_override === undefined ||
        config.bar_target_label_override === ''
          ? data[1][dimID].value
          : config.bar_target_label_override;
    }
  } else if (config.bar_target_source === 'override') {
    if (
      config.bar_target_value_override === undefined ||
      (config.bar_target_value_override === '' && viz)
    ) {
      viz.addError({
        title: 'Invalid Input.',
        message:
          'No target override. Add an override value or modify label type.',
      });
    }
    tarValue = parseFloat(config.bar_target_value_override);
    tarBase = tarValue;
    tarLabel = config.bar_target_label_override;
    tarRendered =
      config.bar_target_value_format === undefined ||
      config.bar_target_value_format === ''
        ? tarBase
        : SSF.format(config.bar_target_value_format, tarValue);
    if (dims.length > 0) {
      tarDim =
        config.bar_target_label_override === undefined ||
        config.bar_target_label_override === ''
          ? data[0][dimID].value
          : config.bar_target_label_override;
    }
  }

  let chunk = {
    value: mesData.value,
    value_links: mesData.links,
    value_label:
      config.bar_value_label_override === undefined ||
      config.bar_value_label_override === ''
        ? mesLabel
        : config.bar_value_label_override,
    value_rendered:
      config.bar_value_formatting === undefined ||
      config.bar_value_formatting === ''
        ? mesRendered
        : SSF.format(config.bar_value_formatting, mesData.value),
    value_dimension:
      dims.length > 0
        ? config.bar_value_label_override === undefined ||
          config.bar_value_label_override === ''
          ? data[0][dimID].value
          : config.bar_value_label_override
        : null,
    value_formatting: config.bar_value_formatting,
    target: tarValue,
    target_rendered: tarRendered,
    target_label:
      config.bar_target_label_override === undefined ||
      config.bar_target_label_override === ''
        ? tarLabel
        : config.bar_target_label_override,
    target_dimension: tarDim,
  };
  return chunk;
}

export function getBarDefaults(width, height, margin, config, chunk) {
  return {
    w: width, // GAUGE SETTINGS
    h: height,
    limiting_aspect: width < height ? 'vw' : 'vh',
    margin: margin,
    style: config.bar_style,
    angle: config.bar_angle,
    cutout: config.bar_cutout,
    color: config.bar_fill_color,
    gauge_background: config.bar_background_color,
    range: [config.bar_range_min, config.bar_range_max],
    value:
      chunk.value > config.bar_range_max ? config.bar_range_max : chunk.value,
    value_rendered: chunk.value_rendered,
    target:
      chunk.target > config.bar_range_max ? config.bar_range_max : chunk.target,
    value_label: chunk.value_label,
    target_label: chunk.target_label,
    value_dimension: chunk.value_dimension,
    target_dimension: chunk.target_dimension,
    target_rendered: chunk.target_rendered,
    value_links: chunk.value_links,
    label_font: config.bar_label_font_size,
    // If no range formatting set, use the same as bar value
    range_formatting: config.bar_range_formatting ?? chunk.value_formatting,
    range_x: config.bar_range_x,
    range_y: config.bar_range_y,
    gauge_fill_type: config.bar_gauge_fill_type,
    fill_colors: config.bar_fill_colors,
    range_color: config.bar_range_color,

    spinner: config.bar_spinner_length, // SPINNER SETTINGS
    spinner_weight: config.bar_spinner_weight,
    spinner_background: config.bar_spinner_color,

    arm: config.bar_arm_length, // ARM SETTINGS
    arm_weight: config.bar_arm_weight,

    target_length: config.bar_target_length, // TARGET SETTINGS
    target_gap: config.bar_target_gap,
    target_weight: config.bar_target_weight,
    target_background: '#282828',
    target_source: config.bar_target_source,

    value_label_type: config.bar_value_label_type, // LABEL SETTINGS
    value_label_font: config.bar_value_label_font,
    value_label_padding: config.bar_value_label_padding,
    target_label_type: config.bar_target_label_type,
    target_label_font: config.bar_target_label_font,
    target_label_padding: config.bar_target_label_padding,
    wrap_width: 100,
  };
}
