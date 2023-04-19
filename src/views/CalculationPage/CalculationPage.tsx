import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { areResultsAvailable } from "../../utilities/filtering";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import DragStory from "../../components/DragAndDrop/DragStory";
import CustomModal from "../../components/CustomModal";
import WeightsResults from "../../components/Results/Weights";
import PreferencesResults from "../../components/Results/Preferences";
import PreferencesCorrelationsResults from "../../components/Results/PreferencesCorrelations";
import RankingResults from "../../components/Results/Ranking";
import RankingCorrelationsResults from "../../components/Results/RankingCorrelations";
import Loader from "../../components/Loader";
import ErrorContent from "../../components/ErrorContent";

import { useTranslation } from "react-i18next";

export default function CalculationPage() {
  const { results, loading, error } = useSelector(
    (state: RootState) => state.calculation
  );

  const { t } = useTranslation();

  useEffect(() => {
    if (error === null) return;
    const element = document.getElementById("calculation-error");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [error]);

  const generateResultsFile = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(results, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "results.json";

    link.click();
  };

  let content = <Loader />;
  if (!loading) {
    if (!error) {
      content = (
        <Box
          sx={{
            width: "90%",
            mx: "auto",
            marginTop: "300px",
            backgroundColor: "grey",
            borderRadius: 5,
          }}
        >
          {areResultsAvailable(results) && (
            <Box sx={{ p: 4 }}>
              <Box sx={{}}>
                <Typography textAlign="center" variant="h6">
                  {t("results:results")}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button variant="contained" onClick={generateResultsFile}>
                    <SaveAltIcon />
                    {t("results:download-results")}
                  </Button>
                </Box>
              </Box>

              <>
                <WeightsResults />
                <PreferencesResults />
                <PreferencesCorrelationsResults />
                <RankingResults />
                <RankingCorrelationsResults />
              </>
            </Box>
          )}
        </Box>
      );
    } else {
      content = (
        <Box sx={{ width: "80%", margin: "0px 10%" }} id="calculation-error">
          <ErrorContent message={error} />
        </Box>
      );
    }
  }

  return (
    <Box sx={{ minHeight: "90%", height: "60vh" }}>
      <DragStory />
      <CustomModal />
      {content}
    </Box>
  );
}
