let API_URL = 'http://localhost:4000';

if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://mon-vieux-grimoire-back-2984d53afe51.herokuapp.com/';
}

export const API_ROUTES = {
  SIGN_UP: `${API_URL}/api/auth/signup`,
  SIGN_IN: `${API_URL}/api/auth/login`,
  BOOKS: `${API_URL}/api/books`,
  BEST_RATED: `${API_URL}/api/books/bestrating`,
};

// Other routes...

export const APP_ROUTES = {
  SIGN_UP: '/Inscription',
  SIGN_IN: '/Connexion',
  ADD_BOOK: '/Ajouter',
  BOOK: '/livre/:id',
  UPDATE_BOOK: 'livre/modifier/:id',
};
