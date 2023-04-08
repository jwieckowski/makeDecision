import * as React from "react";
import Box from "@mui/material/Box";
import { Typography, Button } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { useAppDispatch } from "../../redux/";

import { useTranslation } from "react-i18next";

type ErrorContentProps = {
  message?: string;
  cb?: Function;
};

export default function ErrorContent({ message, cb }: ErrorContentProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: "700px",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" textAlign="center">
        {message !== undefined ? message : t("common:general-error")}
      </Typography>
      {cb !== undefined && (
        <Button
          sx={{ margin: "20px 0" }}
          variant="contained"
          onClick={() => dispatch(cb())}
        >
          <ReplayIcon />
          {t("common:reload")}
        </Button>
      )}
    </Box>
  );
}
