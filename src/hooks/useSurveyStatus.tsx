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
    return surveyDate !== null;
  };

  const isSurveyAnsweredToday = () => {
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    return surveyDate === formattedCurrentDate;
  };

  return { recordSurveyAnswer, isSurveyAnswered, isSurveyAnsweredToday, surveyDate };
};

export default useSurveyStatus;
