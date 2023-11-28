import { AllMethodsItem } from './dictionary';

export type CollapseItemProps = {
  open: boolean;
  forceOpen: boolean;
  methods: AllMethodsItem;
  onClick: () => void;
};
