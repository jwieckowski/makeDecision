import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { MethodsDescriptionType } from "../../../redux/types";
import MarkdownText from "../../MarkdownText";

interface DescriptionProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function DescriptionItem(props: DescriptionProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 2,
            width: "100%",
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function DescriptionMethodPanel(props: DescriptionProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ width: "100%" }}>{children}</Box>}
    </div>
  );
}

function ariaProps(index: number) {
  return {
    id: `panel-item-${index}`,
    "aria-controls": `panel item ${index}`,
  };
}

type BigMenuProps = {
  methods: [] | MethodsDescriptionType[];
  typeIndex: number;
  methodIndex: number;
  handleTypeChange: (e: React.SyntheticEvent, newValue: number) => void;
  handleMethodChange: (e: React.SyntheticEvent, newValue: number) => void;
};

export default function BigMenu({
  methods,
  typeIndex,
  methodIndex,
  handleTypeChange,
  handleMethodChange,
}: BigMenuProps) {
  return (
    <>
      {/* BIG SCREEN items */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
        }}
      >
        <Tabs
          variant="scrollable"
          value={typeIndex}
          onChange={handleTypeChange}
          aria-label="Menu of methods with their mathematical descriptions"
          // centered
        >
          {methods.map((method) => {
            return <Tab label={method.key} {...ariaProps(method.id)} />;
          })}
        </Tabs>
      </Box>
      {methods.length > 0 &&
        methods.map((method, idx) => {
          return (
            <DescriptionItem value={typeIndex} index={idx}>
              <Box>
                <Tabs
                  variant="scrollable"
                  value={methodIndex}
                  onChange={handleMethodChange}
                  aria-label="Menu of techniques from selected methods"
                  // centered
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: "100vw",
                    overflow: "auto",
                  }}
                >
                  {method.data.map((data, id) => {
                    return <Tab label={data.name} {...ariaProps(id)} />;
                  })}
                </Tabs>
                {method.data.map((data, id) => {
                  return (
                    <DescriptionMethodPanel value={methodIndex} index={id}>
                      <Box sx={{ width: "60%", margin: "20px auto" }}>
                        {data.description.map((d) => {
                          return (
                            <MarkdownText text={d.text} key={`text${d.id}`} />
                          );
                        })}
                        {data.description.length === 0 && (
                          <Typography>No description available yet</Typography>
                        )}
                      </Box>
                    </DescriptionMethodPanel>
                  );
                })}
              </Box>
            </DescriptionItem>
          );
        })}
    </>
  );
}
