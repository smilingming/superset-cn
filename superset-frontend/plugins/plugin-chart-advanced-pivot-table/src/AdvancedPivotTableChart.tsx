import React, { useEffect, useMemo, useRef } from 'react';
import {
  getNumberFormatter,
  NumberFormats,
} from '@superset-ui/core';
import styled from '@emotion/styled';
import { PivotSheet } from '@antv/s2';
import {
  AdvancedPivotMetricsLayout,
  AdvancedPivotSortOrder,
  AdvancedPivotTableTransformedProps,
} from './types';

const Wrapper = styled.div<{ cmccTheme: boolean }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;

  ${({ cmccTheme }) =>
    cmccTheme
      ? `
        .antv-s2-tooltip-container {
          border-radius: 6px;
        }
      `
      : ''}
`;

const SheetHost = styled.div`
  width: 100%;
  height: 100%;
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  font-size: 14px;
`;

const CMCC_BLUE = '#0085d0';
const NEGATIVE_RED = '#d4380d';
const ZERO_GRAY = '#8c8c8c';

const toCssColor = (value: unknown, fallback: string) => {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    const color = value as {
      r?: number;
      g?: number;
      b?: number;
      a?: number;
    };

    if (
      Number.isFinite(color.r) &&
      Number.isFinite(color.g) &&
      Number.isFinite(color.b)
    ) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ?? 1})`;
    }
  }

  return fallback;
};

const toNumericValue = (value: unknown) => {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isEmptyValue = (value: unknown) =>
  value === null || value === undefined || value === '';

const toS2LayoutWidthType = (layoutWidthType: string) => {
  if (layoutWidthType === 'compact') return 'compact';
  if (layoutWidthType === 'colAdaptive') return 'colAdaptive';
  return 'adaptive';
};

const normalizeSortValue = (value: unknown) => {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  const text = String(value ?? '').trim();

  if (!text) {
    return '';
  }

  const compactNumber = Number(text.replace(/[-_./年月\s]/g, ''));
  if (Number.isFinite(compactNumber) && /\d/.test(text)) {
    return compactNumber;
  }

  const parsed = Date.parse(text);
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return text;
};

const compareNatural = (left: unknown, right: unknown) => {
  const a = normalizeSortValue(left);
  const b = normalizeSortValue(right);

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b), 'zh-CN', {
    numeric: true,
    sensitivity: 'base',
  });
};

const sortDataRecords = (
  records: Record<string, unknown>[],
  rows: string[],
  columns: string[],
  rowSortOrder: AdvancedPivotSortOrder,
  colSortOrder: AdvancedPivotSortOrder,
) => {
  if (
    rowSortOrder === AdvancedPivotSortOrder.None &&
    colSortOrder === AdvancedPivotSortOrder.None
  ) {
    return records;
  }

  return [...records].sort((left, right) => {
    for (const field of rows) {
      const result = compareNatural(left[field], right[field]);
      if (result !== 0) {
        return rowSortOrder === AdvancedPivotSortOrder.Desc ? -result : result;
      }
    }

    for (const field of columns) {
      const result = compareNatural(left[field], right[field]);
      if (result !== 0) {
        return colSortOrder === AdvancedPivotSortOrder.Desc ? -result : result;
      }
    }

    return 0;
  });
};

const buildSortParams = (
  fields: string[],
  sortOrder: AdvancedPivotSortOrder,
) => {
  if (sortOrder === AdvancedPivotSortOrder.None) {
    return [];
  }

  return fields.map(field => ({
    sortFieldId: field,
    sortMethod: sortOrder === AdvancedPivotSortOrder.Desc ? 'DESC' : 'ASC',
  }));
};

const getSubTotalDimensions = (fields: string[]) => {
  if (fields.length <= 1) {
    return fields;
  }

  return fields.slice(0, fields.length - 1);
};

const buildTotalsConfig = ({
  rows,
  columns,
  rowTotals,
  rowSubTotals,
  colTotals,
  colSubTotals,
  rowSubtotalPosition,
  colSubtotalPosition,
}: {
  rows: string[];
  columns: string[];
  rowTotals: boolean;
  rowSubTotals: boolean;
  colTotals: boolean;
  colSubTotals: boolean;
  rowSubtotalPosition: boolean;
  colSubtotalPosition: boolean;
}) => ({
  row: {
    showGrandTotals: rowTotals,
    showSubTotals: rowSubTotals,
    subTotalsDimensions: rowSubTotals ? getSubTotalDimensions(rows) : [],
    reverseGrandTotalsLayout: rowSubtotalPosition,
    reverseSubTotalsLayout: rowSubtotalPosition,
    calcGrandTotals: {
      aggregation: 'SUM',
    },
    calcSubTotals: {
      aggregation: 'SUM',
    },
    grandTotalsLabel: '总计',
    subTotalsLabel: '小计',
  },
  col: {
    showGrandTotals: colTotals,
    showSubTotals: colSubTotals,
    subTotalsDimensions: colSubTotals ? getSubTotalDimensions(columns) : [],
    reverseGrandTotalsLayout: colSubtotalPosition,
    reverseSubTotalsLayout: colSubtotalPosition,
    calcGrandTotals: {
      aggregation: 'SUM',
    },
    calcSubTotals: {
      aggregation: 'SUM',
    },
    grandTotalsLabel: '总计',
    subTotalsLabel: '小计',
  },
});

export default function AdvancedPivotTableChart(
  props: AdvancedPivotTableTransformedProps,
) {
  const {
    height,
    width,
    data,
    rows,
    columns,
    values,
    verboseMap,
    useVerboseName,
    rowSortOrder,
    colSortOrder,
    metricsLayout,
    hierarchyType,

    rowTotals,
    rowSubTotals,
    colTotals,
    colSubTotals,
    rowSubtotalPosition,
    colSubtotalPosition,

    valueFormat,
    nullPlaceholder,
    negativeRed,
    negativeColor,
    zeroGray,
    headerBackgroundColor,
    headerTextColor,
    rowHeaderBackgroundColor,
    rowHeaderTextColor,
    cmccTheme,

    freezeRowHeader,
    layoutWidthType,
    rowHeight,
    headerHeight,

    showTooltip,
    enableCopy,
    enableResize,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<any>(null);

  const formatter = useMemo(
    () => getNumberFormatter(valueFormat || NumberFormats.SMART_NUMBER),
    [valueFormat],
  );

  const getDisplayName = (field: string) =>
    useVerboseName ? verboseMap[field] || field : field;

  const negativeColorCss = toCssColor(negativeColor, NEGATIVE_RED);
  const headerBackgroundColorCss = toCssColor(
    headerBackgroundColor,
    '#e6f4ff',
  );
  const headerTextColorCss = toCssColor(headerTextColor, '#003a8c');
  const rowHeaderBackgroundColorCss = toCssColor(
    rowHeaderBackgroundColor,
    '#f7fbff',
  );
  const rowHeaderTextColorCss = toCssColor(rowHeaderTextColor, '#1f1f1f');

  const sortedData = useMemo(
    () =>
      sortDataRecords(
        data as Record<string, unknown>[],
        rows,
        columns,
        rowSortOrder,
        colSortOrder,
      ),
    [data, rows, columns, rowSortOrder, colSortOrder],
  );

  const dataCfg = useMemo(
    () => ({
      fields: {
        rows,
        columns,
        values,
        valueInCols: metricsLayout !== AdvancedPivotMetricsLayout.Rows,
      },
      data: sortedData,
      sortParams: [
        ...buildSortParams(rows, rowSortOrder),
        ...buildSortParams(columns, colSortOrder),
      ],
      meta: [
        ...rows.map(field => ({ field, name: getDisplayName(field) })),
        ...columns.map(field => ({ field, name: getDisplayName(field) })),
        ...values.map(field => ({
          field,
          name: getDisplayName(field),
          formatter(value: unknown) {
            if (isEmptyValue(value)) {
              return nullPlaceholder;
            }

            const numericValue = toNumericValue(value);
            if (numericValue !== undefined) {
              return formatter(numericValue);
            }

            return String(value);
          },
        })),
      ],
    }),
    [
      rows,
      columns,
      values,
      sortedData,
      metricsLayout,
      formatter,
      nullPlaceholder,
      verboseMap,
      useVerboseName,
      rowSortOrder,
      colSortOrder,
    ],
  );

  const options = useMemo(
    () => ({
      width,
      height,
      hierarchyType,
      frozen: {
        rowHeader: freezeRowHeader,
      },
      totals: buildTotalsConfig({
        rows,
        columns,
        rowTotals,
        rowSubTotals,
        colTotals,
        colSubTotals,
        rowSubtotalPosition,
        colSubtotalPosition,
      }),
      style: {
        layoutWidthType: toS2LayoutWidthType(layoutWidthType),
        rowCell: {
          height: rowHeight,
        },
        colCell: {
          height: headerHeight,
        },
        dataCell: {
          height: rowHeight,
        },
      },
      interaction: {
        enableCopy,
        hoverHighlight: true,
        selectedCellsSpotlight: true,
        resize: enableResize,
      },
      tooltip: {
        showTooltip,
      },
      conditions: {
        text: values.map(field => ({
          field,
          mapping(value: unknown) {
            const numericValue = toNumericValue(value);

            if (numericValue === undefined) {
              return {};
            }

            if (negativeRed && numericValue < 0) {
              return { fill: negativeColorCss };
            }

            if (zeroGray && numericValue === 0) {
              return { fill: ZERO_GRAY };
            }

            return {};
          },
        })),
      },
    }),
    [
      width,
      height,
      hierarchyType,
      freezeRowHeader,
      rowTotals,
      rowSubTotals,
      colTotals,
      colSubTotals,
      rowSubtotalPosition,
      colSubtotalPosition,
      layoutWidthType,
      rowHeight,
      headerHeight,
      enableCopy,
      enableResize,
      showTooltip,
      values,
      rows,
      columns,
      negativeRed,
      zeroGray,
      negativeColorCss,
    ],
  );

  const themeCfg = useMemo(
    () => ({
      theme: {
        rowCell: {
          cell: {
            backgroundColor: rowHeaderBackgroundColorCss,
          },
          text: {
            fill: rowHeaderTextColorCss,
          },
          bolderText: {
            fill: rowHeaderTextColorCss,
            fontWeight: 600,
          },
        },
        colCell: {
          cell: {
            backgroundColor: headerBackgroundColorCss,
          },
          text: {
            fill: headerTextColorCss,
            fontWeight: 600,
          },
          bolderText: {
            fill: headerTextColorCss,
            fontWeight: 600,
          },
          measureText: {
            fill: headerTextColorCss,
            fontWeight: 600,
          },
        },
        cornerCell: {
          cell: {
            backgroundColor: headerBackgroundColorCss,
          },
          text: {
            fill: headerTextColorCss,
            fontWeight: 600,
          },
          bolderText: {
            fill: headerTextColorCss,
            fontWeight: 600,
          },
        },
        dataCell: {
          text: {
            fill: '#262626',
          },
        },
      },
      palette: {
        basicColors: [
          headerTextColorCss,
          rowHeaderBackgroundColorCss,
          '#d9f7be',
          headerBackgroundColorCss,
          headerBackgroundColorCss,
          '#f0f5ff',
          CMCC_BLUE,
          CMCC_BLUE,
          '#ffffff',
          '#d9e8ff',
          '#b7d4ff',
          '#b7d4ff',
          '#d9e8ff',
          '#262626',
          rowHeaderTextColorCss,
        ],
        semanticColors: {
          red: negativeColorCss,
          green: '#52c41a',
          yellow: '#faad14',
        },
        others: {
          results: headerBackgroundColorCss,
          highlight: CMCC_BLUE,
        },
      },
    }),
    [
      headerBackgroundColorCss,
      headerTextColorCss,
      rowHeaderBackgroundColorCss,
      rowHeaderTextColorCss,
      negativeColorCss,
    ],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || (!rows.length && !columns.length) || !values.length) {
      return undefined;
    }

    container.innerHTML = '';

    const sheet = new PivotSheet(container, dataCfg as any, options as any);
    sheetRef.current = sheet;

    if (typeof sheet.setThemeCfg === 'function') {
      sheet.setThemeCfg(themeCfg as any);
    }

    sheet.render();

    return () => {
      try {
        if (sheet && typeof sheet.destroy === 'function') {
          sheet.destroy();
        }
      } finally {
        if (sheetRef.current === sheet) {
          sheetRef.current = null;
        }
        container.innerHTML = '';
      }
    };
  }, [dataCfg, options, themeCfg, rows.length, columns.length, values.length]);

  if (!rows.length && !columns.length) {
    return (
      <Wrapper cmccTheme={cmccTheme} style={{ height, width }}>
        <EmptyState>请选择行维度或列维度</EmptyState>
      </Wrapper>
    );
  }

  if (!values.length) {
    return (
      <Wrapper cmccTheme={cmccTheme} style={{ height, width }}>
        <EmptyState>请选择指标</EmptyState>
      </Wrapper>
    );
  }

  return (
    <Wrapper cmccTheme={cmccTheme} style={{ height, width }}>
      <SheetHost ref={containerRef} />
    </Wrapper>
  );
}
