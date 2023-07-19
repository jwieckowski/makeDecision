import { colors } from "../../../common/globalStyles";

const styles = {
  navbar: {
    backgroundColor: colors.primary,
    boxShadow: "0px 5px 5px 0px rgba(66, 68, 90, 1)",
    fontFamily: "Helvetica Neue",
  },
  logo: {
    color: colors.light,
  },
  menu: {
    fontSize: "30px",
  },
  menuItem: {
    color: colors.gray,
    lineHeight: "30px",
  },
  menuItemActive: {
    color: colors.light,
    lineHeight: "30px",
  },
  sideNavbar: {
    backgroundColor: colors.dark,
  },
};

export default styles;
