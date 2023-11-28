export type DescriptionType = {
  id: number;
  text: string;
};

export type DataDescriptionType = {
  id: number;
  name: string;
  description: [] | DescriptionType[];
};

export type MethodsDescriptionType = {
  id: number;
  key: string;
  data: [] | DataDescriptionType[];
};

export type DescriptionsSliceState = {
  home: [] | DescriptionType[];
  methods: [] | MethodsDescriptionType[];
  loading: boolean;
  error: null | string;
};
