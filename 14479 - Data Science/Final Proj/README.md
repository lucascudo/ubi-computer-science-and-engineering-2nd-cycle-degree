# MEI_CD_20232024_Grupo7
# Ciência de Dados

## **Objetivos**
Este trabalho vem no âmbito da Unidade Curricular de Ciência de Dados, inserida no Mestrado de Engenharia Informática. Visa o estudo de nível de satisfação de empregos de IT em Portugal, de modo a ponderar a informação no ingresso ao mercado de trabalho, ou então na mudança para um emprego com qualidade maior.

São avaliados diversos parâmetros para poder tirar conclusões acerca do nível de estabilidade financeira, qualidade de vida, dificuldade de entrevista, etc.
Pretende-se então com este estudo responder á questão acerca se este é o melhor emprego para um individuo, ou se há oportunidades que merecem mais atenção.
## Pré Requisitos
Para este trabalho é necessário alguns componentes para poder funcionar corretamente, tal como:
> - Jupyter Notebook
> - Python(> v. 3.6)
> - Beautifull Soup
> - Requests Library
> - NumPy
> - MatPlotLib
> - OpenAI
> - SKLearn

Cada uma destas bibliotecas pode ser instalada recorrendo ao Package Installer for Python. Basta inserir os seguintes comandos no Terminal
(Nota: o PIP deve estar atualizado):

```python -m pip install jupyter```

As restantes bibliotecas são instaladas de forma semelhante:
```python -m pip install numpy```
```python -m pip install scikit-learn```
```python -m pip install matplotlib```
```python -m pip install openai```


## Dataset

### Teamlyzer_Raw
Este trata-se dos dados brutos provenientes do *Web Scrapping* inseridos no ficheiro CSV que sofrerão alterações de limpeza.
### Teamlyzer_Clean
O ficheiro CSV formatado com a remoção de empresas com menos de duas avaliações ou que os dados essenciais ao estudo não constam lá.
### Teamlyzer_Tranformed
São adicionadas mais quatro colunas que se trata da faixa salarial (Minima e Máxima), média salarial e numero de minutos trabalhado. 
### Teamlyzer_Tranformed_Filled
É o ficheiro que contém os valores imputados pelo processo de *machine learning* onde estes estão em falta na faixa salarial.
## Retrival Augmented Generation
No final do notebook, encontra-se uma ferramenta de RAG, que pode passar *prompts* ao programa com recurso da OpenAI para geração de respostas. Na última célula, a **vaiável pergunta_exemplo** pode ser alterada para responder a uma outra questão, basta alterar o seu valor.