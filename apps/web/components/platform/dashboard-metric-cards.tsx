'use client';

import { DashboardMetricWindowEnum, type DashboardMetricWindow } from '@crown/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const metricWindowDescriptions: Record<DashboardMetricWindow, string> = {
  [DashboardMetricWindowEnum.WEEK]: 'past 7 days',
  [DashboardMetricWindowEnum.MONTH]: 'past 30 days',
  [DashboardMetricWindowEnum.YEAR]: 'past 365 days',
};

const formatMetricWindowLabel = (window: DashboardMetricWindow) =>
  window.slice(0, 1).toUpperCase() + window.slice(1);

export const formatGrowthRateValue = (value: number) =>
  `${Number.isInteger(value) ? value : value.toFixed(2)}%`;

export const getNewTenantDescription = (window: DashboardMetricWindow) =>
  `Trailing window count based on the ${metricWindowDescriptions[window]}.`;

export const getGrowthRateDescription = (window: DashboardMetricWindow) =>
  `Tenant growth across the ${metricWindowDescriptions[window]} compared with the previous window of the same length.`;

type SummaryMetricCardProps = {
  title: string;
  value: string;
  description: string;
};

type WindowMetricCardProps = {
  title: string;
  description: string;
  selectedWindow: DashboardMetricWindow;
  onSelectWindow: (window: DashboardMetricWindow) => void;
  value: string;
};

export const SummaryMetricCard = ({ title, value, description }: SummaryMetricCardProps) => (
  <Card className="platform-metric-card rounded-3xl shadow-sm">
    <CardContent className="p-4 sm:p-5">
      <h4 className="platform-metric-label">{title}</h4>
      <p className="platform-metric-value mt-3 tabular-nums">{value}</p>
      <p className="platform-metric-description mt-3">{description}</p>
    </CardContent>
  </Card>
);

export const WindowMetricCard = ({
  title,
  description,
  selectedWindow,
  onSelectWindow,
  value,
}: WindowMetricCardProps) => (
  <Card className="platform-metric-card rounded-3xl shadow-sm">
    <CardContent className="p-4 sm:p-5">
      <div className="platform-window-switcher">
        {[
          DashboardMetricWindowEnum.WEEK,
          DashboardMetricWindowEnum.MONTH,
          DashboardMetricWindowEnum.YEAR,
        ].map((window) => {
          const isSelected = selectedWindow === window;

          return (
            <Button
              key={window}
              aria-pressed={isSelected}
              className="platform-window-button min-w-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] xl:px-3"
              onClick={() => onSelectWindow(window)}
              size="sm"
              type="button"
              variant={isSelected ? 'default' : 'ghost'}
            >
              {formatMetricWindowLabel(window)}
            </Button>
          );
        })}
      </div>
      <h4 className="platform-metric-label mt-4">{title}</h4>
      <p className="platform-metric-value mt-3 tabular-nums">{value}</p>
      <p className="platform-metric-description mt-3">{description}</p>
    </CardContent>
  </Card>
);
