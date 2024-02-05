import { useState, useEffect } from 'react';

const useSurveyStatus = () => {
  const [hasAnsweredSurvey, setHasAnsweredSurvey] = useState<boolean>(false);
  const [hoursPassed, setHoursPassed] = useState<number>(0);

  useEffect(() => {
    const checkSurveyStatus = () => {
      const storedAnsweredSurvey = localStorage.getItem('answeredSurveyMakeDecision');
      const answeredTimestamp = localStorage.getItem('lastTimestampMakeDecision');

      console.log(storedAnsweredSurvey);
      console.log(answeredTimestamp);

      if (!storedAnsweredSurvey || !answeredTimestamp) return;

      const currentTime = new Date().getTime();
      const lastAnsweredTimestamp = parseInt(answeredTimestamp, 10);
      const hours = (currentTime - lastAnsweredTimestamp) / (1000 * 60 * 60);
      console.log(hours);
      setHasAnsweredSurvey(true);
      setHoursPassed(hours);
    };

    checkSurveyStatus();
  }, []);

  const canAnswerSurvey = () => {
    console.log(hasAnsweredSurvey);
    console.log(hoursPassed);
    const answeredTimestamp = localStorage.getItem('lastTimestampMakeDecision');
    const currentTime = new Date().getTime();
    const lastAnsweredTimestamp = parseInt(answeredTimestamp ?? '0', 10);
    const hours = (currentTime - lastAnsweredTimestamp) / (1000 * 60 * 60);
    console.log(hours);
    return !hasAnsweredSurvey || hours >= 0.000002;
  };

  const updateSurveyStatus = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('lastTimestampMakeDecision', currentTime.toString());
    localStorage.setItem('answeredSurveyMakeDecision', 'true');
    setHasAnsweredSurvey(true);
  };

  return { hasAnsweredSurvey, hoursPassed, canAnswerSurvey, updateSurveyStatus };
};

export default useSurveyStatus;
