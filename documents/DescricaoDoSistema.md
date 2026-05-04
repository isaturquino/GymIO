# Descrição Inicial do Sistema

O **GymIO - Sistema de Gestão Interna para Academias** é uma solução desenvolvida para automatizar e centralizar a administração de academias. O sistema permite o controle completo de alunos, planos, matrículas, pagamentos, acesso por catraca, equipamentos e geração de relatórios. Seu principal objetivo é otimizar processos internos, reduzir erros operacionais e melhorar o controle financeiro e administrativo da academia. Além disso, fornece informações estratégicas por meio de um dashboard com indicadores importantes para auxiliar na tomada de decisão.

## Funcionalidades Principais

### Autenticação e Acesso

O sistema permite que usuários realizem login utilizando e-mail e senha. Após a validação das credenciais, o acesso às funcionalidades é liberado de acordo com o perfil do usuário. Usuários não autenticados não possuem acesso ao sistema.

### Gestão de Alunos

Permite cadastrar, editar, excluir e listar alunos. Também possibilita a filtragem por status (ativo, inadimplente, cancelado). O sistema armazena dados como nome, CPF, telefone e situação do aluno.

### Gestão de Planos e Matrículas

Permite o cadastro e edição de planos (mensal, trimestral e anual). O sistema possibilita associar alunos a planos por meio de matrículas, registrando datas de início e fim e atualizando automaticamente o status da matrícula.

### Gestão Financeira

O sistema registra contas a receber (mensalidades) e contas a pagar (despesas). Também permite editar e excluir registros financeiros, controlar o status de pagamentos e manter um histórico completo, além de fornecer controle de caixa.

### Controle de Acesso (Catraca)

O sistema registra entradas e saídas dos alunos. O acesso é liberado automaticamente para alunos adimplentes e bloqueado para inadimplentes. Todas as tentativas de acesso são registradas em logs.

### Gestão de Equipamentos

Permite cadastrar e editar equipamentos, atualizar seu status (funcionando ou em manutenção), registrar manutenções e manter histórico.

### Relatórios

O sistema gera relatórios de alunos ativos e inativos, inadimplência, receita mensal, frequência de alunos e equipamentos em manutenção.

### Dashboard

Apresenta indicadores resumidos, como total de alunos ativos, receita mensal, quantidade de alunos inadimplentes e número de acessos no dia.

## Tecnologias Utilizadas

As tecnologias adotadas no desenvolvimento do projeto foram escolhidas com base nos conhecimentos prévios da equipe, com o objetivo de otimizar o tempo de desenvolvimento e garantir maior produtividade, evitando a necessidade de aprendizado de novas ferramentas durante a execução do projeto.
No back-end, foi utilizado o Node.js, permitindo a construção de uma API eficiente e alinhada com o ecossistema JavaScript já dominado pelo grupo.
No front-end, foram empregadas as tecnologias HTML, CSS e JavaScript, com o uso da biblioteca React, possibilitando a criação de interfaces dinâmicas e organizadas em componentes reutilizáveis.
Para o banco de dados, foi adotado o Supabase, que oferece uma solução prática e moderna, facilitando a integração com o sistema.
O controle de versão foi realizado por meio do GitHub, permitindo a colaboração entre os membros da equipe, organização das tarefas e acompanhamento do progresso do projeto.
Além disso, foram utilizadas bibliotecas auxiliares como o lucide-react, para a implementação de ícones na interface, e o react-router-dom, responsável pelo gerenciamento das rotas da aplicação.
A escolha dessas tecnologias contribuiu diretamente para a eficiência do desenvolvimento, permitindo que a equipe focasse na implementação das funcionalidades e na qualidade do sistema, em vez de investir tempo na aprendizagem de novas ferramentas.
