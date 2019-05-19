# EVENT MANAGER API  

- Steps to run application
1. Run `yarn install` to install all dependencies  
2. Create your deveopment environment variables. Add `config/env/development.js` with the following snippet 
```javascript
    module.exports = {
        DB_URI: <YOUR_DB_URI>,
        JWT_SECRET: <YOUR_JWT_SECRET>,
        TOKEN_EXPIRY: <YOUR_PREFERRED_TOKEN_EXPIRY_TIME>
    };
```
`You can skip this step and let the application use config/env/development.default.js`  
3. Run `yarn test` to run the tests (Make sure you have MongoDB running)  
4. Run `yarn start` to launch the app (Make sure you have MongoDB running)    
