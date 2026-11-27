// Dados locais dos projetos: usados quando a API/MySQL não responde.
// Mantenha igual ao database/seed.sql.

const projects = [
  {
    slug: 'spaceform',
    title: 'Spaceform',
    status: 'in_progress',
    displayUrl: 'spaceform.com.br',
    demoUrl: null,
    repoUrl: null,
    stack: ['HTML', 'CSS', 'JavaScript', 'React', 'Express', 'MySQL', 'Stripe'],
    images: [
      { src: '/images/projects/spaceform-1.jpg', alt: { pt: 'Landing page da Spaceform', en: 'Spaceform landing page' } },
      { src: '/images/projects/spaceform-2.jpg', alt: { pt: 'Vitrine de produtos da Spaceform', en: 'Spaceform product catalog' } },
      { src: '/images/projects/spaceform-3.jpg', alt: { pt: 'Dashboard do painel administrativo', en: 'Admin panel dashboard' } },
    ],
    content: {
      pt: {
        summary: 'E-commerce completo para a Spaceform, uma marcenaria real: landing page, vitrine, pagamentos com Stripe e painel administrativo.',
        problem: 'A Spaceform precisava vender seus móveis online e centralizar pedidos, clientes e mensagens em um só lugar.',
        role: 'Desenvolvi a aplicação de ponta a ponta: interface, API, banco de dados e integração de pagamentos.',
        solution: 'Landing page e vitrine em React, API em Express com MySQL e checkout via Stripe. O painel administrativo tem dashboard, cadastro, edição e remoção de produtos, acompanhamento de vendas e da situação dos pagamentos, informações dos clientes e caixa de mensagens enviadas pelos clientes.',
        result: 'Projeto em desenvolvimento. Meu primeiro sistema completo para um cliente real, do banco de dados ao pagamento.',
      },
      en: {
        summary: 'Full e-commerce platform for Spaceform, a real woodworking shop: landing page, product catalog, Stripe payments and an admin panel.',
        problem: 'Spaceform needed to sell its furniture online and keep orders, customers and messages in one place.',
        role: 'I built the application end to end: interface, API, database and payment integration.',
        solution: 'Landing page and catalog in React, an Express API with MySQL and Stripe checkout. The admin panel includes a dashboard, product create, edit and delete, sales and payment status tracking, customer details and an inbox for customer messages.',
        result: 'In development. My first complete system for a real client, from database to payment.',
      },
    },
  },
  {
    slug: 'aws-campus-leader',
    title: 'AWS Student Builder Campus Leader',
    status: 'community',
    displayUrl: 'AWS Builder Center',
    demoUrl: null,
    repoUrl: null,
    // Itens da stack podem ser texto simples ou { pt, en } quando precisam de tradução
    stack: [
      { pt: 'Liderança', en: 'Leadership' },
      { pt: 'Comunicação', en: 'Communication' },
      { pt: 'Eventos', en: 'Events' },
      'AWS',
    ],
    images: [
      // type: 'video' faz o carrossel mostrar um player em vez de imagem
      { src: '/images/projects/aws-1.jpg', alt: { pt: 'Arthur palestrando para estudantes no auditório do campus', en: 'Arthur giving a talk to students in the campus auditorium' } },
      { src: '/images/projects/aws-2.mp4', type: 'video', alt: { pt: 'Vídeo do programa AWS no campus', en: 'Video from the AWS program on campus' } },
      { src: '/images/projects/aws-3.jpg', alt: { pt: 'Arthur apresentando a AWS Builder Center em sala de aula', en: 'Arthur presenting the AWS Builder Center in class' } },
    ],
    content: {
      pt: {
        summary: 'Liderei por 6 semanas o programa AWS Student Builder no meu campus, aproximando os estudantes da comunidade AWS Builder Center.',
        problem: 'Conectar estudantes de tecnologia, da primeira graduação à pós-graduação, com a comunidade e os recursos da AWS.',
        role: 'Líder estudantil: planejei e executei a comunicação, as ativações e as palestras do programa.',
        solution: '22 entregáveis em 6 semanas: 12 posts, 4 ativações, 2 palestras e 4 anúncios em sala de aula.',
        result: 'Mais de 700 alunos de tecnologia mobilizados no campus.',
      },
      en: {
        summary: 'For 6 weeks I led the AWS Student Builder program on my campus, bringing students closer to the AWS Builder Center community.',
        problem: 'Connect tech students, from first-year undergrads to graduate students, with the AWS community and its resources.',
        role: 'Student leader: I planned and ran the program communication, activations and talks.',
        solution: '22 deliverables in 6 weeks: 12 posts, 4 activations, 2 talks and 4 classroom announcements.',
        result: 'More than 700 tech students engaged on campus.',
      },
    },
  },
  {
    slug: 'portfolio',
    title: 'Portfólio',
    status: 'done',
    displayUrl: 'github.com/Arthurdeaguiarr',
    demoUrl: null,
    repoUrl: 'https://github.com/Arthurdeaguiarr',
    stack: ['React', 'Vite', 'CSS', 'Express', 'MySQL'],
    images: [
      { src: '/images/projects/portfolio-1.jpg', alt: { pt: 'Hero do portfólio com título, foto e degradê laranja', en: 'Portfolio hero with title, photo and orange gradient' } },
      { src: '/images/projects/portfolio-2.jpg', alt: { pt: 'Seção de tecnologias com cards de logos inclinados', en: 'Technologies section with tilted logo cards' } },
    ],
    content: {
      pt: {
        title: 'Este portfólio',
        summary: 'Portfólio bilíngue com front-end em React, API em Express e banco MySQL.',
        problem: 'Apresentar meus projetos e receber contatos com uma aplicação feita por mim, sem depender de ferramentas prontas.',
        role: 'Design e desenvolvimento completos.',
        solution: 'React com Vite e CSS próprio no front, API REST em Express, projetos e mensagens salvos em MySQL, versão em português e inglês.',
        result: 'Novos projetos são cadastrados no banco e aparecem no site sem alterar o código.',
      },
      en: {
        title: 'This portfolio',
        summary: 'Bilingual portfolio with a React front end, an Express API and a MySQL database.',
        problem: 'Show my projects and receive messages through an application I built myself, without ready-made site builders.',
        role: 'Full design and development.',
        solution: 'React with Vite and hand-written CSS on the front end, a REST API in Express, projects and messages stored in MySQL, in Portuguese and English.',
        result: 'New projects are added to the database and show up on the site without code changes.',
      },
    },
  },
];

export default projects;
