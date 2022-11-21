export const BASE_URL = process.env.REACT_APP_API_URL;

export const REPORTS = `${BASE_URL}/report/`;
export const ANSWER_REPORT = (id) => `${BASE_URL}/report/${id}/answer/`;
export const ANSWERED_REPORTS = `${BASE_URL}/report/answered/`;
export const EVALUATION_BY_ID = (id) => `${BASE_URL}/evaluation/${id}`;
