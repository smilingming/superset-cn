import {
  DataRecord,
  ensureIsArray,
  getColumnLabel,
  getMetricLabel,
} from '@superset-ui/core';
import {
  AdvancedPivotHierarchyType,
  AdvancedPivotLayoutWidthType,
  AdvancedPivotMetricsLayout,
  AdvancedPivotSortOrder,
  AdvancedPivotTableProps,
  AdvancedPivotTableTransformedProps,
} from './types';

const toPositiveNumber = (
  value: string | number | null | undefined,
  fallback: number,
) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const cleanField = (field: string) => String(field || '').trim();

const dedupe = (items: string[]) =>
  Array.from(new Set(items.map(cleanField).filter(Boolean)));

const normalizeVerboseMap = (verboseMap: unknown): Record<string, string> => {
  if (!verboseMap || Array.isArray(verboseMap) || typeof verboseMap !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(verboseMap as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
      .map(([key, value]) => [key, String(value)]),
  );
};

export default function transformProps(
  chartProps: AdvancedPivotTableProps,
): AdvancedPivotTableTransformedProps {
  const {
    height,
    width,
    rawFormData: formData,
    queriesData = [],
    datasource: { verboseMap = {} } = {} as any,
  } = chartProps as AdvancedPivotTableProps & {
    datasource?: { verboseMap?: Record<string, string> };
  };

  const rows = dedupe(ensureIsArray(formData.groupbyRows).map(getColumnLabel));
  const columns = dedupe(
    ensureIsArray(formData.groupbyColumns).map(getColumnLabel),
  );
  const values = dedupe(ensureIsArray(formData.metrics).map(getMetricLabel));
  const transposePivot = Boolean(formData.transposePivot);
  const normalizedVerboseMap = normalizeVerboseMap(verboseMap);

  return {
    height,
    width,
    data: ((queriesData[0]?.data || []) as DataRecord[]).map(record => ({
      ...record,
    })),
    rows: transposePivot ? columns : rows,
    columns: transposePivot ? rows : columns,
    values,
    verboseMap: normalizedVerboseMap,
    useVerboseName: formData.useVerboseName !== false,
    rowSortOrder: formData.rowSortOrder || AdvancedPivotSortOrder.Asc,
    colSortOrder: formData.colSortOrder || AdvancedPivotSortOrder.Asc,
    transposePivot,

    metricsLayout:
      formData.metricsLayout || AdvancedPivotMetricsLayout.Columns,
    hierarchyType:
      formData.hierarchyType || AdvancedPivotHierarchyType.Grid,

    rowTotals: Boolean(formData.rowTotals),
    rowSubTotals: Boolean(formData.rowSubTotals),
    colTotals: Boolean(formData.colTotals),
    colSubTotals: Boolean(formData.colSubTotals),
    rowSubtotalPosition: Boolean(formData.rowSubtotalPosition),
    colSubtotalPosition: Boolean(formData.colSubtotalPosition),

    valueFormat: formData.valueFormat,
    nullPlaceholder: formData.nullPlaceholder ?? '',
    negativeRed: formData.negativeRed !== false,
    negativeColor: formData.negativeColor || { r: 212, g: 56, b: 13, a: 1 },
    zeroGray: formData.zeroGray !== false,
    headerBackgroundColor:
      formData.headerBackgroundColor || { r: 230, g: 244, b: 255, a: 1 },
    headerTextColor: formData.headerTextColor || { r: 0, g: 58, b: 140, a: 1 },
    rowHeaderBackgroundColor:
      formData.rowHeaderBackgroundColor || { r: 247, g: 251, b: 255, a: 1 },
    rowHeaderTextColor:
      formData.rowHeaderTextColor || { r: 31, g: 31, b: 31, a: 1 },
    cmccTheme: formData.cmccTheme !== false,

    freezeRowHeader: formData.freezeRowHeader !== false,
    layoutWidthType:
      formData.layoutWidthType || AdvancedPivotLayoutWidthType.Adaptive,
    rowHeight: toPositiveNumber(formData.rowHeight, 32),
    headerHeight: toPositiveNumber(formData.headerHeight, 36),

    showTooltip: formData.showTooltip !== false,
    enableCopy: formData.enableCopy !== false,
    enableResize: formData.enableResize !== false,
  };
}
