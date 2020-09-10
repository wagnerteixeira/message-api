if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
  }
  
  import App from './app';
  
  const port = process.env.PORT || 3001;
  
  /* tslint:disable:no-console */
  App.express.listen(port, () => console.log(`Server running on port ${port}`));