type BaseUsageOption = {
  id: number;
  label: string;
  name: string;
  type: 'select' | 'radio';
};

export type UsageOption = BaseUsageOption & {
  title?: string;
  options?: BaseUsageOption[];
};

export type SurveyUsage = {
  title: string;
  options: UsageOption[];
};

export type SurveyRating = {
  helpful: string;
  easyInterface: string;
  easeOfUse: number;
  overallRating: number;
  changeSuggestion: string;
  features: string;
};
