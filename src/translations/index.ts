import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import homeEN from "./en/home.json";
import aboutEN from "./en/about.json";
import methodsEN from "./en/methods.json";
import contactEN from "./en/contact.json";
import commonEN from "./en/common.json";
import resultsEN from "./en/results.json";

import homePL from "./pl/home.json";
import aboutPL from "./pl/about.json";
import methodsPL from "./pl/methods.json";
import contactPL from "./pl/contact.json";
import commonPL from "./pl/common.json";
import resultsPL from "./pl/results.json";

const resources = {
  en: {
    home: homeEN,
    about: aboutEN,
    methods: methodsEN,
    contact: contactEN,
    common: commonEN,
    results: resultsEN,
  },
  pl: {
    home: homePL,
    about: aboutPL,
    methods: methodsPL,
    contact: contactPL,
    common: commonPL,
    results: resultsPL,
  },
};

const namespaces = ["home", "about", "methods", "contact", "results", "common"];

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
