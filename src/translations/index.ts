import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import homeEN from "./en/home.json";
import methodsEN from "./en/methods.json";
import contactEN from "./en/contact.json";
import commonEN from "./en/common.json";
import resultsEN from "./en/results.json";
import snackbarEN from "./en/snackbars.json";
import aboutEN from "./en/about.json";

import homePL from "./pl/home.json";
import methodsPL from "./pl/methods.json";
import contactPL from "./pl/contact.json";
import commonPL from "./pl/common.json";
import resultsPL from "./pl/results.json";
import snackbarPL from "./pl/snackbars.json";
import aboutPL from "./pl/about.json";

const resources = {
  en: {
    home: homeEN,
    methods: methodsEN,
    contact: contactEN,
    common: commonEN,
    results: resultsEN,
    snackbar: snackbarEN,
    about: aboutEN,
  },
  pl: {
    home: homePL,
    methods: methodsPL,
    contact: contactPL,
    common: commonPL,
    results: resultsPL,
    snackbar: snackbarPL,
    about: aboutPL,
  },
};

const namespaces = [
  "home",
  "methods",
  "contact",
  "results",
  "common",
  "snackbar",
];

export const availableLanguages = Object.keys(resources);

i18n.use(initReactI18next).init({
  lng: window.localStorage.getItem("locale")
    ? `${window.localStorage.getItem("locale")}`
    : "en",
  fallbackLng: "en",
  resources: resources,
  ns: namespaces,
  defaultNS: "common",
});

export default i18n;
