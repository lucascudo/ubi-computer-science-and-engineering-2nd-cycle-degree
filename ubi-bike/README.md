# UbiBike

https://ubi-bike-7866d.firebaseapp.com/

<img src="https://github.com/lucascudo/ubi-bike/raw/main/src/assets/qrcode.png" alt="QRCode" width="320">

## RF's
 RF01 – utilizadores não registados na plataforma, não terão acesso a qualquer tipo de informação, nem funcionalidade da plataforma;

 RF02 – a plataforma, não permite o registo de novos utilizadores, uma vez que, apenas pessoas autorizadas e qualificadas pela instituição UBI poderão ter acesso;

 RF03 – a plataforma, deve apresentar uma página de autenticação (página login), sempre antes de qualquer acesso por completo às funcionalidades da plataforma;

 RF04 – a plataforma deverá atualizar automaticamente, passados trezentos segundos;

 RF05 – após o utilizador efetuar a autenticação, a plataforma deverá apresentar a página principal com a barra de tarefas;

 RF06 – a barra de tarefas, deve apresentar seis funcionalidades, nomeadamente, redirecionamento para a página principal, redirecionamento para a página loja, redirecionamento para a página achievements, redireccionamento para a página pedidos, redirecionamento para a página utilizadores e botão terminar sessão (logout);

 RF07 – a página principal, deverá mostrar uma descrição da plataforma;

 RF08.1 – a página loja, deverá listar todos os produtos que estejam inseridos na base de dados, com a informação do nome, pontos e quantidade existente em stock;

 RF08.2 – a página loja, deverá permitir adicionar novos produtos, através de três parâmetros, nomeadamente “nome do produto”, “pontos” e “quantidade”, atualizando automaticamente a lista dos produtos;

 RF08.3 – a página loja, deverá permitir eliminar produtos existentes, atualizando automaticamente a lista dos produtos;

 RF08.4 – a página loja, deverá permitir editar em cada produto a quantidade em stock, atualizando automaticamente a lista dos produtos;

 RF09.1 – a página achievements, deverá listar todos os achivements que estejam inseridos na base de dados, com a informação da descrição, pontos e ID;

 RF09.2 – a página achievements, deverá permitir adicionar novos achivements, atualizando automaticamente a lista de achivements;

 RF09.3 – a página achivements, deverá permitir eliminar achievements existentes, atualizando automaticamente a lista de achievements;

 RF10 – a página utilizadores, deverá apenas listar os utilizadores registados na aplicação móvel, com a informação do nome, da data de nascimento, do email, da distância percorrida, do ID da bicicleta e dos pontos obtidos;

 RF11 – o botão logout, deverá terminar a sessão do utilizador.


## Setup

`npm install`
## Serve

`npm start`
## Build

`npm run build`
## Deploy

`npm run deploy`
