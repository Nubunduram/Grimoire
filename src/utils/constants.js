const API_URL = 'https://mon-vieux-grimoire-back-2984d53afe51.herokuapp.com';

export const API_ROUTES = {
  SIGN_UP: `${API_URL}/api/auth/signup`,
  SIGN_IN: `${API_URL}/api/auth/login`,
  BOOKS: `${API_URL}/api/books`,
  BEST_RATED: `${API_URL}/api/books/bestrating`,
};

// Other routes...

export const APP_ROUTES = {
  HOME: '/Grimoire',
  SIGN_UP: '/Grimoire/Inscription',
  SIGN_IN: '/Grimoire/Connexion',
  ADD_BOOK: '/Grimoire/Ajouter',
  BOOK: '/Grimoire/livre/:id',
  UPDATE_BOOK: '/Grimoire/livre/modifier/:id',
};
