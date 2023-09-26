import { AllMethodsItem } from '.';

export type CollapseItemProps = {
  open: boolean;
  forceOpen: boolean;
  methods: AllMethodsItem;
  onClick: () => void;
};
