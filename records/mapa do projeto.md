MAPA DO PROJETO

O objetivo do mapa do projeto é orientar no desenvolvimento do projeto. O mapa traz alguns pontos que destaquei sobre o que foi implementado durante o processo de desenvolvimento da Nyvia, como: Modelo de Negócio, Planejamento, Recursos chaves e Estratégia de implementação. Portanto o Claude precisa respeitar os marcos importantes do que foi feito nesses itens. 

1_MODELO DE NEGÓCIO =A criação do modelo de negócios nyvia com a estratégia de criar uma solução SAAS de Marketing - chamada Nyvia - que é uma analista de marketing com IA. 

	A estratégia de negócio para o Saas Nyvia tem como meta oferecer a ferramenta para o mercado B2B, onde USUÁRIOS possam criar um espaço/ambiente de tabalho para analisar o conteúdo das campanhas de marketing de seus clientes. 
	Essa solução deve perimitir ao usuário interagir com a plataforma criando ambientes "workspaces" visando reunir/concentrar/agrupar clientes, em seus ambientes, dentro da plataforma. 
	Dentro desse espaço a interação se dará como num chat, porém a previsão de que o resutlado da análise possa ser armazenado para ser reutizado
	A ferramenta deve servir como local para empresas gerenciar seus Clientes/ onde poderão  /analisar  "Campanhas" com dados, palavras-chave e métricas desse conteúdo. Ainda será permitido aos usuários nomear worspaces, de acordo com a versão utilizada, para que sejam utilizados para vários clientes. 
	O caracter de indivudualização dos workspaces visa que análises dentro de cada workspace, respeitem o conteúdo do briefing/resumo do assunto de cada segmento/atividade do cliente.
	

2_PLANEJAMENTO =o plano de desenvolver a ferrramenta envolveu a escolha do Claude LLMs (guiado pelo metodo indicado por mim nas instruções do Projeto Nyvia)

	O planejamento para o desenvolvimento do Saas Nyvia, levou em consideração a aplicação do sistema de criação de multi-agentes de IA para a orquestração de tarefas, de modo independentes, que permitam ser integradas para atingir resultados escaláveis. 
	A escolha do Claude como LLM, atende aos padrões de AI first - ia como base do desenvolvimento da plataforma - pois o Claude apresentou funcionalidades desejadas para atender princípios básicos para essa implementação.   
	Entre esses princípio, a plataforma deve prever o versionamento/manutenção e suporte para Nyvia. Para isso a escolha de recursos chaves que venham permitir que o projeto seja desenvolvido com stack tecnológico que permita a robustez do sistema, funcionando para atender demandas de B2B, crescentes, bem como para dar suporte para usuários e clientes.
	O sistema Saas conta com a inteligência artificial do Claude LLMs, diretamente embarcado em sua engine. 
	A previsão é de que esse sistema, por si só seja retroalimentado por informações de segmento dos clientes B2B, onde workspaces realizem o papel de fitro para definir/limitar a execução de mensagens geradas com base, inicialmente no briefing/resumo sobre o cliente, mas que aumentem a relevância desse conteúdo, agregando valor às análises que a ferramenta será capaz de fazer de cada conteúdo específico, contido no briefing, somado as respostas do Saas
	Para aumentar o processo de geração de análise sobre o conteúdo é previsto ainda a integração do Saas, com ferramentas como o Google Ads e MetaAds, para trazer insights dessas ferramentas para análise de Nyvia. 
	Ainda há previsão também para o uso de modelos estatísticos, com uso de RAG - Retrival Augmented Generation - que ajudem com o processo de refinamento do LLM,s - Claude, permitindo dados e informações ainda melhores evitando assim alucinações da plataforma de LLMs.
	

3_RECURSOS CHAVES= Os recursos chaves utilizados para atender as demandas do projeto foram: 

	- Linguagem: Javascritp com Node.js para de desenvolvimento de conteúdo dos arquivos, 
	- Arqutitetura de Agentes: o Saas com multi-agentes tem 2 agentes inicialmente desenvolvidos, mas com previsão de incremento dos agentes, em versões posteriores
	- Engenharia de software: a implementação das etapas, desde o planejamento, foi dividida em dev e agora em produção (próxima fase desse projeto), com backend e frontend dos arquivos independentes.  
	- DevOps: O uso do Railway (moderno) para o Backend e do Vercel (nativo em Javascript e no Next.j) para o Frontend.


4_ESTRATEGIA DE IMPLEMENTAÇÃO = Serão criadas 2 versões do projeto NYVIA-LITE , NYVIA-PRO, inicialmente. 

	-Cada versão deve contar com seu repositório de arquvos independentes, seguindo o que foi implementado em desenvolvimento, nyvia-frontend-pro e nyvia-backend-pro, a fim de facilitar a migração do ambiente dev para produção, aproveitando estrutura dos arquivos, existentes.
	-Ainda Não se falou numa etapa de Staging, para o processo de implementação, mas precisamos considerar a possibilidade de Testes intermedíarios entre dev e Produção, para que sejam realizados testes, que garantam o pleno funcionamento de nyvia, antes de seguir para produção (publicação do Saas)















