import { HIDE_DURATION } from "../common/const";
import { useSnackbar, VariantType } from "notistack";

const useSnackbars = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (
    msg: string,
    variant: VariantType,
    duration?: number
  ) => {
    enqueueSnackbar(msg, {
      variant: variant,
      autoHideDuration: duration ? duration : HIDE_DURATION,
    });
  };

  return { showSnackbar };
};

export default useSnackbars;
