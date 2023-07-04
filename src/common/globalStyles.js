export const colors = {
  primary: "#424949",
  secondary: "#5DADE2",
  light: "#F4F4F4",
  lightMuted: "rgba(244, 244, 244, 0.7)",
  gray: "#D0D0D0",
  dark: "#181818",
  darkBackground: "rgba(24, 24, 24, 0.7)",
  darkBackgroundFooter: "rgba(24, 24, 24, 0.6)",
  success: "#55F73B",
  successBackground: "rgba(85, 247, 59, 0.7)",
  error: "#F92A2A",
  errorBackground: "rgba(249, 42, 42, 0.7)",
  info: "#2AABDF",
  infoBackground: "rgba(42, 171, 223, 0.7)",
};

const globalStyles = {
  navbar: {
    backgroundColor: colors.primary,
    boxShadow: "0px 5px 5px 0px rgba(66, 68, 90, 1)",
    fontFamily: "Helvetica Neue",
  },
  logo: {
    color: colors.light,
  },
  menuItem: {
    color: colors.gray,
  },
  menuItemActive: {
    color: colors.light,
  },
  methodsDrawer: {
    padding: 0,
    margin: 0,
    backgroundColor: colors.light,
  },

  actionButtonsWrapper: {
    display: "flex",
    width: "100%",
    backgroundColor: colors.gray,
  },
  actionButtonsRow: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    margin: "5px 0",
  },
  settingsWrapper: {
    width: "100%",
    margin: 0,
    padding: 0,
  },
  settingsItem: {
    width: "100%",
    margin: 0,
    padding: 0,
    border: 0,
  },
  settingsItemHeader: {
    margin: 0,
    padding: 0,
  },
  settingsButtonWrapper: {
    height: "50px",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    gap: 10,
  },
  scaleSettingsWrapper: {
    gap: 5,
    width: "140px",
    zIndex: 1000,
  },
  justifyContentEnd: {
    justifyContent: "end",
  },
  buttonPrimary: {
    backgroundColor: colors.darkBackground,
    width: "110px",
    height: "35px",
    padding: 0,
    margin: 0,
    fontSize: "14px",
    border: `2px solid ${colors.darkBackground}`,
  },
  buttonPrimaryText: {
    fontSize: "14px",
    color: colors.light,
  },
  buttonSuccess: {
    backgroundColor: colors.successBackground,
    width: "110px",
    height: "35px",
    padding: 0,
    margin: 0,
    fontSize: "14px",
    border: `2px solid ${colors.success}`,
  },
  buttonDanger: {
    backgroundColor: colors.errorBackground,
    width: "110px",
    height: "35px",
    padding: 0,
    margin: 0,
    fontSize: "14px",
    border: `2px solid ${colors.error}`,
  },
  buttonInfo: {
    backgroundColor: colors.infoBackground,
    width: "110px",
    height: "35px",
    padding: 0,
    margin: 0,
    fontSize: "14px",
    border: `2px solid ${colors.info}`,
  },
  inputForm: {},
  textInputLabel: {
    fontSize: "12px",
    marginBottom: "0px",
  },
  uploadFileLabel: {
    textAlign: "center",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
    cursor: "pointer",
  },
  textInput: {
    width: "60px",
    fontSize: "14px",
  },
  checkbox: { fontSize: "14px", width: "60px" },
  iconButton: {
    backgroundColor: colors.darkBackground,
    color: colors.light,
    width: "30px",
    height: "30px",
    borderRadius: "15px",
    margin: 0,
    padding: 0,
    fontSize: "14px",
    border: `2px solid ${colors.darkBackground}`,
  },
  textBold: {
    fontWeight: "bold",
  },
  settingsSelect: {
    height: "30px",
    width: "75px",
    fontSize: "12px",
    textAlign: "start",
  },
  settingsColorPicker: {
    height: "30px",
    width: "45px",
  },
  draggableItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    margin: 0,
    padding: 0,
  },
  table: {},
  tooltip: {},
  linkItem: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    cursor: "pointer",
    color: colors.dark,
  },
  iconItem: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    color: colors.dark,
  },
  linkIcon: {
    fontSize: "30px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  contactWrapper: { width: "60%", marginTop: "50px" },
  contactLinksWrapper: {
    margin: "50px 0px",
  },
  contactAffiliationWrapper: {
    margin: "55px 0px",
    fontSize: "14px",
  },
  criteriaTypesWrapper: {
    display: "flex",
    width: "100%",
    minWidth: "100%",
    maxWidth: "50vw",
    overflow: "auto",
  },
  criteriaTypesLabel: {
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  resultsTableCardWrapper: {
    backgroundColor: colors.darkBackgroundFooter,
    boxShadow: "0px 5px 5px 0px rgba(66, 68, 90, 1)",
  },
  resultsTableWrapper: {
    width: "80%",
    margin: "0 10%",
  },
  footerWrapper: {
    margin: 0,
    padding: 0,
    height: "150px",
    width: "100%",
    backgroundColor: colors.darkBackgroundFooter,
    display: "flex",
  },
  footerSection: {
    width: "35%",
    height: "60%",
    display: "flex",
  },
  footerLinkHeader: {
    color: colors.light,
  },
  footerLinkItem: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "12px",
  },
  footerLinkIcon: {
    fontSize: "20px",
  },
};

export default globalStyles;
