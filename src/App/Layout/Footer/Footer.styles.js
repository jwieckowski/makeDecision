import { colors } from "../../../common/globalStyles";

const styles = {
  footerWrapper: {
    margin: 0,
    padding: 0,
    minHeight: "150px",
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

export default styles;
