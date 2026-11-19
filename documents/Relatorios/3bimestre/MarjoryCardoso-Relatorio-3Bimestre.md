# 📄 Relatório Individual – Marjory 

**Função:** Desenvolvedora Backend

## 1. Atividades Realizadas no Projeto

Durante este período, atuei na correção e finalização das funcionalidades de **Planos e Matrículas** do sistema GymIO, resolvendo problemas de sincronização entre o banco de dados e o frontend, além de implementar operações que ainda não estavam funcionais.

Identifiquei que o backend estava utilizando duas formas diferentes de conexão com o banco (Supabase em um controller e pool `pg` direto em outros), o que gerava inconsistências nos dados exibidos. Corrigi o método de listagem de matrículas para retornar os campos com os nomes esperados pelo frontend, resolvendo a exibição incorreta dos indicadores da tela de Planos e Matrículas (**Total de Planos, Matrículas Ativas, Vencendo em Breve e Crescimento**).

Também identifiquei e corrigi divergências de nomenclatura entre os status armazenados no banco de dados (como `"Ativo"`, `"Cancelado"`, `"Inadimplente"` e `"Inativo"`) e as comparações realizadas no código, que estavam causando contagens incorretas nos cards do sistema.

Implementei a lógica de cálculo do indicador de **"Vencendo em Breve"**, considerando matrículas ativas com vencimento nos próximos 15 dias, e do indicador de **"Crescimento"**, comparando o número de matrículas realizadas no mês atual com o mês anterior.

Além disso, implementei o relacionamento completo entre as tabelas de **Pessoa, Aluno, Plano e Assinatura** no fluxo de cadastro de matrículas. Ajustei a API de listagem de pessoas para expor o identificador correto do aluno, substituí os campos de texto livre do formulário por seleções vinculadas diretamente aos dados do banco e implementei as rotas e operações no backend (model, controller e rota) necessárias para permitir a edição de matrículas existentes, que antes não existia.

---

## 2. Conhecimentos Adquiridos

Aprofundei meus conhecimentos em **depuração de sistemas backend**, especialmente na identificação de inconsistências entre diferentes camadas de uma aplicação (banco de dados, API e frontend).

Aprendi a rastrear um problema de exibição incorreta de dados até sua causa raiz, percorrendo o fluxo completo desde a query no banco até o componente que renderiza a informação na tela.

Também desenvolvi maior compreensão sobre a importância da **padronização de dados no banco**, como grafia e capitalização de valores de status, e como pequenas divergências nesse tipo de dado podem gerar erros silenciosos que não apresentam mensagens de erro explícitas, mas retornam valores incorretos.

Aprimorei minha experiência com controle de versão utilizando **Git e GitHub**, incluindo a organização de commits seguindo o padrão de **Conventional Commits** e a criação de Pull Requests documentados, vinculando alterações às issues correspondentes do projeto.

Por fim, reforcei conhecimentos sobre **modelagem de relacionamentos entre tabelas**, especialmente ao garantir que operações de cadastro no frontend utilizassem os identificadores corretos das entidades relacionadas (aluno e plano), em vez de campos de texto que não garantiam integridade referencial.

---

## 3. Dificuldades Encontradas

A principal dificuldade foi identificar a causa de indicadores exibindo valores incorretos na tela de **Planos e Matrículas**, já que o problema não gerava nenhum erro visível — os dados apareciam, apenas estavam errados.

Isso exigiu comparar, passo a passo, os valores reais no banco de dados com o que era exibido na interface, até encontrar as divergências de nomenclatura entre os status armazenados e os comparados no código.

Também houve dificuldade relacionada à existência de **duas formas diferentes de conexão com o banco de dados** dentro do mesmo backend, o que tornava mais difícil garantir que todas as partes do sistema estivessem lendo e escrevendo dados de forma consistente.

Outro desafio foi ajustar o formulário de matrículas para trabalhar com identificadores reais do banco (`aluno_id` e `plano_id`) em vez de nomes em texto livre, já que isso exigiu alterações coordenadas entre backend, expondo os dados corretos, e frontend, consumindo esses dados corretamente.

---

## 4. Como as Dificuldades Foram Resolvidas

As divergências de nomenclatura foram resolvidas por meio de consultas diretas ao banco de dados, verificando os valores exatos armazenados nas colunas de status antes de ajustar as comparações no código.

Esse processo de verificação foi essencial para confirmar cada correção antes de segui-la.

A inconsistência entre as duas formas de conexão com o banco foi identificada e documentada para reestruturação futura, sendo mantida temporariamente conforme decisão da equipe, priorizando a entrega das funcionalidades no prazo.

A implementação do relacionamento completo entre alunos, planos e matrículas foi resolvida dividindo o trabalho em etapas menores e testáveis: primeiro corrigindo a API para expor os identificadores corretos, depois ajustando os formulários do frontend e, por fim, implementando as rotas de backend necessárias para suportar edição, testando cada etapa isoladamente antes de avançar para a próxima.

---

## 5. Considerações Finais

Este período foi marcado por um trabalho aprofundado de **depuração e correção de funcionalidades já existentes**, o que proporcionou uma compreensão mais completa do funcionamento integral do sistema, desde o banco de dados até a interface do usuário.

A experiência de identificar e corrigir inconsistências sutis entre diferentes camadas da aplicação fortaleceu minha capacidade analítica e minha atenção a detalhes durante o desenvolvimento backend.

Além disso, a implementação completa do fluxo de matrículas, incluindo criação e edição vinculadas corretamente aos dados reais do banco, representou um avanço significativo na maturidade técnica do módulo de Planos e Matrículas.

Considero que essas atividades contribuíram significativamente para minha formação como desenvolvedora backend, reforçando a importância da consistência de dados e da comunicação constante entre as camadas de um sistema.