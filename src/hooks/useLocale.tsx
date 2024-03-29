import { useState, useEffect } from "react";

export default function useLocale() {
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    setLocale(
      window.localStorage.getItem("locale")
        ? (window.localStorage.getItem("locale") as string)
        : "en"
    );
  }, []);

  useEffect(() => {
    setLocale(
      window.localStorage.getItem("locale")
        ? (window.localStorage.getItem("locale") as string)
        : "en"
    );
  }, [window.localStorage.getItem("locale")]);

  return {
    locale,
  };
}
