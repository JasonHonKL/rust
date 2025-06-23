
// API Configuration
const getApiBaseUrl = (): string => {
  // Use HTTPS now that backend supports it
  return 'https://spysearch.org:8000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    STREAM_COMPLETION: `${getApiBaseUrl()}/api/stream_completion`,
    REPORT: `${getApiBaseUrl()}/api/report`,
    VERIFY: `${getApiBaseUrl()}/api/verify`,
    GOOGLE_LOGIN: `${getApiBaseUrl()}/api/google/login`,
    TOKEN_STATUS: `${getApiBaseUrl()}/api/tokens/status`,
    CREATE_FOLDER: `${getApiBaseUrl()}/api/create_folder`,
    GET_TITLES: `${getApiBaseUrl()}/api/get_titles`,
    LOAD_MESSAGE: `${getApiBaseUrl()}/api/load_message`,
    DELETE_MESSAGE: `${getApiBaseUrl()}/api/delete_message`,
    APPEND_MESSAGE: `${getApiBaseUrl()}/api/append_message`,
    FOLDER_LIST: `${getApiBaseUrl()}/api/folder_list`,
    DELETE_FOLDER: `${getApiBaseUrl()}/api/delete_folder`,
    DELETE_FILE: `${getApiBaseUrl()}/api/delete_file`,
    SELECT_FOLDER: `${getApiBaseUrl()}/api/select_folder`,
    UPLOAD_FILE: `${getApiBaseUrl()}/api/upload_file`,
  },
  // Default headers for CORS
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
} as const;
