import { t } from '@apache-superset/core/translation';
import { Behavior, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import thumbnail from '../../plugin-chart-pivot-table/src/images/thumbnail.png';
import thumbnailDark from '../../plugin-chart-pivot-table/src/images/thumbnail-dark.png';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import { AdvancedPivotTableFormData, AdvancedPivotTableProps } from './types';

export * from './types';

const metadata = new ChartMetadata({
  behaviors: [
    Behavior.InteractiveChart,
    Behavior.DrillToDetail,
    Behavior.DrillBy,
  ],
  category: t('表格'),
  canBeAnnotationTypes: ['EVENT', 'INTERVAL'],
  description: t(
    '高级数据透视表，基于 AntV S2，支持行维度、列维度、多指标、汇总、小计、转置、冻结、格式化和中国移动风格。',
  ),
  name: t('高级数据透视表'),
  tags: [
    t('经营分析'),
    t('报表'),
    t('表格'),
    t('透视表'),
    t('矩阵'),
    t('推荐'),
  ],
  thumbnail,
  thumbnailDark,
});

export default class AdvancedPivotTableChartPlugin extends ChartPlugin<
  AdvancedPivotTableFormData,
  AdvancedPivotTableProps
> {
  constructor() {
    super({
      loadChart: () => import('./AdvancedPivotTableChart'),
      metadata,
      transformProps,
      controlPanel,
      buildQuery,
    });
  }
}
