# PrivacyEnhancedPrizes

![System Architecture](https://raw.githubusercontent.com/lucascudo/ubi-computer-science-and-engineering-2nd-cycle-degree/main/14465%20-%20Computer%20Systems%20Security/PrivacyEnhancedPrizes.png)

## API SETUP
```
cd api
npm install
cd secrets
openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout key.pem -out cert.pem
``` 
## CLIENT_APP SETUP
```
cd clientapp
npm install
cd secrets
openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout key.pem -out cert.pem
```
 ## RUN API
```
cd api
npm run start:dev
``` 
 ## RUN CLIENT_APP
```
cd clientapp
npm run start:ssl
``` 

### extras (TODO)
- embelezar as páginas
- adicionar comentários swagger (documentação da API)
- corrigir testes unitários
- implementar pipeline de Continuous Integration com github actions
