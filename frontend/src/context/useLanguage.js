import { useContext } from "react";
import { LanguageContext } from "./languageContextObject.js";

export function useLanguage() {
  return useContext(LanguageContext);
}
