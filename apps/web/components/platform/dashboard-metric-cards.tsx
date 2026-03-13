"use client";

import { DashboardMetricWindowEnum, type DashboardMetricWindow } from "@crown/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const metricWindowDescriptions: Record<DashboardMetricWindow, string> = {
  [DashboardMetricWindowEnum.WEEK]: "past 7 days",
  [DashboardMetricWindowEnum.MONTH]: "past 30 days",
  [DashboardMetricWindowEnum.YEAR]: "past 365 days"
};

const formatMetricWindowLabel = (window: DashboardMetricWindow) => window.slice(0, 1).toUpperCase() + window.slice(1);

export const formatGrowthRateValue = (value: number) => `${Number.isInteger(value) ? value : value.toFixed(2)}%`;

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
  <Card className="rounded-3xl border-stone-200 bg-stone-50/90 shadow-sm">
    <CardContent className="p-5">
      <h4 className="mt-3 text-lg font-semibold text-stone-950">{title}</h4>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">{value}</p>
      <p className="mt-4 text-sm leading-6 text-stone-600">{description}</p>
    </CardContent>
  </Card>
);

export const WindowMetricCard = ({
  title,
  description,
  selectedWindow,
  onSelectWindow,
  value
}: WindowMetricCardProps) => (
  <Card className="rounded-3xl border-stone-200 bg-stone-50/90 shadow-sm">
    <CardContent className="p-5">
      <div className="flex flex-nowrap gap-1.5 xl:gap-2">
        {[DashboardMetricWindowEnum.WEEK, DashboardMetricWindowEnum.MONTH, DashboardMetricWindowEnum.YEAR].map((window) => {
          const isSelected = selectedWindow === window;

          return (
            <Button
              key={window}
              aria-pressed={isSelected}
              className="min-w-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] xl:px-3"
              onClick={() => onSelectWindow(window)}
              size="sm"
              type="button"
              variant={isSelected ? "default" : "outline"}
            >
              {formatMetricWindowLabel(window)}
            </Button>
          );
        })}
      </div>
      <h4 className="mt-4 text-lg font-semibold text-stone-950">{title}</h4>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">{value}</p>
      <p className="mt-4 text-sm leading-6 text-stone-600">{description}</p>
    </CardContent>
  </Card>
);
