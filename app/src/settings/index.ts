/*
 ** Основные константы проекта
 */

import { OptionsObject } from 'notistack';

export const serviceURL = 'https://immense-sea-07745.herokuapp.com';

export const TOKEN_AUTH_LOCALSTORAGE = 'kanban-token';
export const AVATAR_INDEX_LOCALSTORAGE = 'kanban-avatar';
export const LANGUAGE_LOCALSTORAGE = 'kanban-language';
export const CLOSE_SNACKBAR_TIME = 5000;
export const SIZE_DESCRIPTION_TASK_IN_COLUMN = 40;
export const APP_LANGUAGES = ['en', 'ru'];

/*
 ** TODO: CHANGE THE VALIDATION VALUES BEFORE BUILD PRODUCTION
 */
// Validation user
export const USER_NAME_MIN_LENGTH = 5;
export const USER_NAME_MAX_LENGTH = 30;
export const USER_LOGIN_MIN_LENGTH = 5;
export const USER_LOGIN_MAX_LENGTH = 30;
export const USER_PASSWORD_MIN_LENGTH = 5;
export const USER_PASSWORD_MAX_LENGTH = 30;

// Validation boards
export const BOARDS_TITLE_MIN_LENGTH = 5;
export const BOARDS_TITLE_MAX_LENGTH = 40;
export const BOARDS_DESCRIPTION_MIN_LENGTH = 5;
export const BOARDS_DESCRIPTION_MAX_LENGTH = 80;
export const COLUMNS_TITLE_MIN_LENGTH = 5;
export const COLUMNS_TITLE_MAX_LENGTH = 20;
export const TASKS_TITLE_MIN_LENGTH = 5;
export const TASKS_TITLE_MAX_LENGTH = 30;
export const TASKS_DESCRIPTION_MIN_LENGTH = 5;
export const TASKS_DESCRIPTION_MAX_LENGTH = 200;

// options show SNACKBAR
const commonMessageOptions: OptionsObject = {
  autoHideDuration: CLOSE_SNACKBAR_TIME,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};
export const messageErrorOptions: OptionsObject = {
  ...commonMessageOptions,
  variant: 'error',
};

export const messageSuccessOptions: OptionsObject = {
  ...commonMessageOptions,
  variant: 'success',
};
