import {
  ChartDataResponseResult,
  ChartProps,
  DataRecord,
  QueryFormColumn,
  QueryFormData,
  QueryFormMetric,
} from '@superset-ui/core';

export enum AdvancedPivotMetricsLayout {
  Columns = 'columns',
  Rows = 'rows',
}

export enum AdvancedPivotHierarchyType {
  Grid = 'grid',
  Tree = 'tree',
}

export enum AdvancedPivotLayoutWidthType {
  Adaptive = 'adaptive',
  Compact = 'compact',
  ColAdaptive = 'colAdaptive',
}

export enum AdvancedPivotSortOrder {
  None = 'none',
  Asc = 'asc',
  Desc = 'desc',
}

export type AdvancedPivotColorValue =
  | string
  | {
      r?: number;
      g?: number;
      b?: number;
      a?: number;
    };

export type AdvancedPivotTableFormData = QueryFormData & {
  groupbyRows?: QueryFormColumn[] | null;
  groupbyColumns?: QueryFormColumn[] | null;
  metrics?: QueryFormMetric[] | null;

  metricsLayout?: AdvancedPivotMetricsLayout;
  hierarchyType?: AdvancedPivotHierarchyType;
  transposePivot?: boolean;

  rowTotals?: boolean;
  rowSubTotals?: boolean;
  colTotals?: boolean;
  colSubTotals?: boolean;
  rowSubtotalPosition?: boolean;
  colSubtotalPosition?: boolean;

  valueFormat?: string;
  useVerboseName?: boolean;
  rowSortOrder?: AdvancedPivotSortOrder;
  colSortOrder?: AdvancedPivotSortOrder;
  nullPlaceholder?: string;
  negativeRed?: boolean;
  negativeColor?: AdvancedPivotColorValue;
  zeroGray?: boolean;
  headerBackgroundColor?: AdvancedPivotColorValue;
  headerTextColor?: AdvancedPivotColorValue;
  rowHeaderBackgroundColor?: AdvancedPivotColorValue;
  rowHeaderTextColor?: AdvancedPivotColorValue;
  cmccTheme?: boolean;

  freezeRowHeader?: boolean;
  layoutWidthType?: AdvancedPivotLayoutWidthType;
  rowHeight?: string | number | null;
  headerHeight?: string | number | null;

  showTooltip?: boolean;
  enableCopy?: boolean;
  enableResize?: boolean;

  row_limit?: number;
  series_limit?: number;
  series_limit_metric?: QueryFormMetric | QueryFormMetric[] | null;
  order_desc?: boolean;
};

export interface AdvancedPivotTableProps extends ChartProps {
  rawFormData: AdvancedPivotTableFormData;
  queriesData: ChartDataResponseResult[];
}

export interface AdvancedPivotTableTransformedProps {
  height: number;
  width: number;
  data: DataRecord[];

  rows: string[];
  columns: string[];
  values: string[];
  verboseMap: Record<string, string>;
  useVerboseName: boolean;
  rowSortOrder: AdvancedPivotSortOrder;
  colSortOrder: AdvancedPivotSortOrder;

  metricsLayout: AdvancedPivotMetricsLayout;
  hierarchyType: AdvancedPivotHierarchyType;
  transposePivot: boolean;

  rowTotals: boolean;
  rowSubTotals: boolean;
  colTotals: boolean;
  colSubTotals: boolean;
  rowSubtotalPosition: boolean;
  colSubtotalPosition: boolean;

  valueFormat?: string;
  nullPlaceholder: string;
  negativeRed: boolean;
  negativeColor: AdvancedPivotColorValue;
  zeroGray: boolean;
  headerBackgroundColor: AdvancedPivotColorValue;
  headerTextColor: AdvancedPivotColorValue;
  rowHeaderBackgroundColor: AdvancedPivotColorValue;
  rowHeaderTextColor: AdvancedPivotColorValue;
  cmccTheme: boolean;

  freezeRowHeader: boolean;
  layoutWidthType: AdvancedPivotLayoutWidthType;
  rowHeight: number;
  headerHeight: number;

  showTooltip: boolean;
  enableCopy: boolean;
  enableResize: boolean;
}
