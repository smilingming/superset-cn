import {
  ControlPanelConfig,
  D3_TIME_FORMAT_OPTIONS,
  getStandardizedControls,
  sharedControls,
} from '@superset-ui/chart-controls';
import { t } from '@apache-superset/core/translation';
import {
  ensureIsArray,
  isAdhocColumn,
  isPhysicalColumn,
  validateNonEmpty,
} from '@superset-ui/core';
import {
  AdvancedPivotHierarchyType,
  AdvancedPivotLayoutWidthType,
  AdvancedPivotMetricsLayout,
  AdvancedPivotSortOrder,
} from './types';

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('查询'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'groupbyRows',
            config: {
              ...sharedControls.groupby,
              label: t('行维度'),
              description: t('作为左侧行头展示的维度字段。'),
            },
          },
        ],
        [
          {
            name: 'groupbyColumns',
            config: {
              ...sharedControls.groupby,
              label: t('列维度'),
              description: t('横向展开为列头的维度字段。'),
            },
          },
        ],
        [
          {
            name: 'time_grain_sqla',
            config: {
              ...sharedControls.time_grain_sqla,
              visibility: ({ controls }) => {
                const dttmLookup = Object.fromEntries(
                  ensureIsArray(controls?.groupbyColumns?.options).map(
                    option => [option.column_name, option.is_dttm],
                  ),
                );

                return [
                  ...ensureIsArray(controls?.groupbyColumns?.value),
                  ...ensureIsArray(controls?.groupbyRows?.value),
                ]
                  .map(selection => {
                    if (isAdhocColumn(selection)) return true;
                    if (isPhysicalColumn(selection)) return !!dttmLookup[selection];
                    return false;
                  })
                  .some(Boolean);
              },
            },
          },
          'temporal_columns_lookup',
        ],
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              label: t('指标值'),
              validators: [validateNonEmpty],
            },
          },
        ],
        ['adhoc_filters'],
        ['series_limit'],
        [
          {
            name: 'row_limit',
            config: {
              ...sharedControls.row_limit,
              label: t('单元格上限'),
              description: t('限制本次查询返回的交叉单元格数量。'),
            },
          },
        ],
        [
          {
            name: 'series_limit_metric',
            config: {
              ...sharedControls.series_limit_metric,
              description: t(
                'Metric used to sort top series when a series or cell limit is present.',
              ),
            },
          },
        ],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('查询结果降序'),
              default: true,
              description: t('控制查询结果按降序或升序返回。'),
            },
          },
        ],
      ],
    },
    {
      label: t('透视设置'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'metricsLayout',
            config: {
              type: 'RadioButtonControl',
              label: t('指标展示位置'),
              default: AdvancedPivotMetricsLayout.Columns,
              options: [
                [AdvancedPivotMetricsLayout.Columns, t('列维度')],
                [AdvancedPivotMetricsLayout.Rows, t('行维度')],
              ],
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'hierarchyType',
            config: {
              type: 'RadioButtonControl',
              label: t('层级展示方式'),
              default: AdvancedPivotHierarchyType.Grid,
              options: [
                [AdvancedPivotHierarchyType.Grid, t('平铺')],
                [AdvancedPivotHierarchyType.Tree, t('树形')],
              ],
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'rowSortOrder',
            config: {
              type: 'SelectControl',
              label: t('行头排序'),
              default: AdvancedPivotSortOrder.Asc,
              clearable: false,
              choices: [
                [AdvancedPivotSortOrder.None, t('原始顺序')],
                [AdvancedPivotSortOrder.Asc, t('升序')],
                [AdvancedPivotSortOrder.Desc, t('降序')],
              ],
              description: t('设置行头排序。月份类字段会按自然顺序排序。'),
              renderTrigger: true,
            },
          },
          {
            name: 'colSortOrder',
            config: {
              type: 'SelectControl',
              label: t('列头排序'),
              default: AdvancedPivotSortOrder.Asc,
              clearable: false,
              choices: [
                [AdvancedPivotSortOrder.None, t('原始顺序')],
                [AdvancedPivotSortOrder.Asc, t('升序')],
                [AdvancedPivotSortOrder.Desc, t('降序')],
              ],
              description: t('设置列头排序。月份类字段会按自然顺序排序。'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'transposePivot',
            config: {
              type: 'CheckboxControl',
              label: t('行列转置'),
              default: false,
              description: t('交换行维度和列维度。'),
              renderTrigger: true,
            },
          },
        ],
      ],
    },
    {
      label: t('合计与小计'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'rowTotals',
            config: {
              type: 'CheckboxControl',
              label: t('显示行总计'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'rowSubTotals',
            config: {
              type: 'CheckboxControl',
              label: t('显示行小计'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'colTotals',
            config: {
              type: 'CheckboxControl',
              label: t('显示列总计'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'colSubTotals',
            config: {
              type: 'CheckboxControl',
              label: t('显示列小计'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'rowSubtotalPosition',
            config: {
              type: 'SelectControl',
              label: t('行小计位置'),
              default: false,
              choices: [
                [true, t('顶部')],
                [false, t('底部')],
              ],
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'colSubtotalPosition',
            config: {
              type: 'SelectControl',
              label: t('列小计位置'),
              default: false,
              choices: [
                [true, t('左侧')],
                [false, t('右侧')],
              ],
              renderTrigger: true,
            },
          },
        ],
      ],
    },
    {
      label: t('格式与样式'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'useVerboseName',
            config: {
              type: 'CheckboxControl',
              label: t('使用字段别名'),
              default: true,
              description: t('优先显示数据集字段别名，不显示物理字段名。'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'valueFormat',
            config: {
              ...sharedControls.y_axis_format,
              label: t('数值格式'),
            },
          },
        ],
        ['currency_format'],
        [
          {
            name: 'date_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('日期格式'),
              default: 'smart_date',
              choices: D3_TIME_FORMAT_OPTIONS,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'nullPlaceholder',
            config: {
              type: 'TextControl',
              label: t('空值显示'),
              default: '',
              renderTrigger: true,
              description: t('单元格为空时显示的文本。'),
            },
          },
        ],
        [
          {
            name: 'negativeRed',
            config: {
              type: 'CheckboxControl',
              label: t('负数标红'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'negativeColor',
            config: {
              type: 'ColorPickerControl',
              label: t('负数颜色'),
              default: { r: 212, g: 56, b: 13, a: 1 },
              description: t('开启负数标红后，负值使用该颜色显示。'),
              renderTrigger: true,
              visibility: ({ controls }) => Boolean(controls?.negativeRed?.value),
            },
          },
        ],
        [
          {
            name: 'zeroGray',
            config: {
              type: 'CheckboxControl',
              label: t('0 值置灰'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'headerBackgroundColor',
            config: {
              type: 'ColorPickerControl',
              label: t('列头背景色'),
              default: { r: 230, g: 244, b: 255, a: 1 },
              description: t('设置横向列头的背景颜色。'),
              renderTrigger: true,
            },
          },
          {
            name: 'headerTextColor',
            config: {
              type: 'ColorPickerControl',
              label: t('列头文字色'),
              default: { r: 0, g: 58, b: 140, a: 1 },
              description: t('设置横向列头的文字颜色。'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'rowHeaderBackgroundColor',
            config: {
              type: 'ColorPickerControl',
              label: t('行头背景色'),
              default: { r: 247, g: 251, b: 255, a: 1 },
              description: t('设置左侧行头的背景颜色。'),
              renderTrigger: true,
            },
          },
          {
            name: 'rowHeaderTextColor',
            config: {
              type: 'ColorPickerControl',
              label: t('行头文字色'),
              default: { r: 31, g: 31, b: 31, a: 1 },
              description: t('设置左侧行头的文字颜色。'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'cmccTheme',
            config: {
              type: 'CheckboxControl',
              label: t('中国移动风格'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
    {
      label: t('布局与交互'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'freezeRowHeader',
            config: {
              type: 'CheckboxControl',
              label: t('冻结行头'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'layoutWidthType',
            config: {
              type: 'SelectControl',
              label: t('列宽布局'),
              default: AdvancedPivotLayoutWidthType.Adaptive,
              clearable: false,
              choices: [
                [AdvancedPivotLayoutWidthType.Adaptive, t('自适应')],
                [AdvancedPivotLayoutWidthType.ColAdaptive, t('按列自适应')],
                [AdvancedPivotLayoutWidthType.Compact, t('紧凑')],
              ],
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'rowHeight',
            config: {
              type: 'TextControl',
              label: t('行高'),
              default: '32',
              renderTrigger: true,
            },
          },
          {
            name: 'headerHeight',
            config: {
              type: 'TextControl',
              label: t('表头高度'),
              default: '36',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'showTooltip',
            config: {
              type: 'CheckboxControl',
              label: t('显示提示框'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'enableCopy',
            config: {
              type: 'CheckboxControl',
              label: t('允许复制'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'enableResize',
            config: {
              type: 'CheckboxControl',
              label: t('允许拖拽调整大小'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
  formDataOverrides: formData => {
    const standardizedControls = getStandardizedControls();
    const groupbyColumns = standardizedControls.controls.columns.filter(
      col => !ensureIsArray(formData.groupbyRows).includes(col),
    );
    standardizedControls.controls.columns =
      standardizedControls.controls.columns.filter(
        col => !groupbyColumns.includes(col),
      );
    return {
      ...formData,
      metrics: standardizedControls.popAllMetrics(),
      groupbyColumns,
    };
  },
};

export default config;
