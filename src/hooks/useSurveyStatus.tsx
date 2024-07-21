import { useEffect, useState } from 'react';

const useSurveyStatus = (localStorageKey = 'usageSurveyStatus') => {
  const [surveyDate, setSurveyDate] = useState<string | null>(null);

  useEffect(() => {
    const storedStatus = localStorage.getItem(localStorageKey);
    if (storedStatus) {
      const parsedStatus = JSON.parse(storedStatus);
      setSurveyDate(parsedStatus.date);
    }
  }, [localStorageKey]);

  const recordSurveyAnswer = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const surveyStatus = { date: formattedDate };

    localStorage.setItem(localStorageKey, JSON.stringify(surveyStatus));
    setSurveyDate(formattedDate);
  };

  const isSurveyAnswered = () => {
    return localStorage.getItem(localStorageKey) !== null;
  };

  const isSurveyAnsweredToday = () => {
    const storedStatus = localStorage.getItem(localStorageKey);
    let surveyDateStore = surveyDate;
    if (storedStatus) {
      surveyDateStore = JSON.parse(storedStatus).date;
    }
    const currentDate = new Date();

    const formattedCurrentDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    return surveyDateStore === formattedCurrentDate;
  };

  return { recordSurveyAnswer, isSurveyAnswered, isSurveyAnsweredToday, surveyDate };
};

export default useSurveyStatus;
