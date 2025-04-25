import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/about')
  @Render('about')
  getAboutPage() {
    return {
      layout: 'main',
      title: 'egorsufiyarov | about',
      meta: {
        keywords: 'software,cv,github,about',
        description: 'page about me',
      },
      styles: ['about.css'],
      scripts: [
        'https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js',
        'js/timeline.js',
      ],
      downloadedStyles: [
        'https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css',
      ],
    };
  }

  @Get('/hobbies')
  @Render('hobbies')
  getHobbiesPage() {
    return {
      layout: 'main',
      title: 'egorsufiyarov | hobbies',
      meta: {
        keywords: 'github,portfolio,frontend,hobbies',
        description: 'page with my hobbies'
      },
      styles: ['hobbies.css'],
    };
  }

  @Get('/')
  @Render('index')
  getIndexPage() {
    return {
      layout: 'main',
      title: 'egorsufiyarov | index',
      meta: {
        keywords: 'software,cv,github,index',
        description: 'cv site with my projects'
      },
      styles: ['index.css'],
      isAuthenticated: true,
      user: {
        name: 'Егор Суфияров',
        avatar: '/pics/my_photo.jpg',
        profileLink: '/about'
      }
    };
  }

  @Get('/projects')
  @Render('projects')
  getProjectsPage() {
    return {
      layout: 'main',
      title: 'egorsufiyarov | projects',
      meta: {
        keywords: 'software,cv,github,projects',
        description: 'page with my projects'
      },
      styles: ['projects.css'],
      projects: [
        {
          title: "Мессенджер",
          description: "Реализация чата с end-to-end шифрованием",
          stack: ["C#", "Postgres", "Kafka", "ASP.NET Core"],
          githubLink: "https://github.com/krbyhome",
          demoLink: "https://telegram.org"
        },
        {
          title: "Библиотека для трейсинга",
          description: "Высокопроизводительная библиотека для логирования",
          stack: ["С++", "CMake", "Google Test"],
          demoLink: "https://opentelemetry.io"
        },
        {
          title: "Модель банка",
          description: "Микросервисная архитектура банковской системы",
          stack: ["C#", "Docker", "Kubernetes", "RabbitMQ"],
          githubLink: "https://github.com/krbyhome",
          demoLink: "https://sber.ru"
        }
      ]
    };
  }

  @Get('/schedule')
  @Render('schedule')
  getSchedulePage() {
    return {
      layout: 'main',
      title: 'egorsufiyarov | schedule',
      meta: {
        keywords: 'schedule,meetings,calendar',
        description: 'page with my schedule'
      },
      styles: ['schedule.css'],
      scripts: ['js/schedule.js'],
      days: [
        { name: 'Понедельник', events: [] },
        { name: 'Вторник', events: [] },
        { name: 'Среда', events: [] },
        { name: 'Четверг', events: [] },
        { name: 'Пятница', events: [] }
      ]
    };
  }

  @Get('/technologies')
  @Render('posts')
  getTechnologiesPage() {
    return {
      layout: 'main',
      title: 'egorsufiyarov | stack',
      meta: {
        keywords: 'github,portfolio,frontend,stack',
        description: 'page with my stack'
      },
      styles: ['technologies.css'],
      stackSections: [
        {
          title: 'Языки',
          items: [
            'C++, Python - для работы',
            'Go, C# - для пет проектов',
            '<del>Java - для кайфа</del>'
          ]
        },
        {
          title: 'ДБшки',
          items: [
            'Postgres',
            'YDB',
            'MongoDB'
          ]
        },
        {
          title: 'Всякое другое',
          items: [
            'Grafana, Prometheus',
            'Docker',
            'Kubernetes',
            'Все, что я могу найти в интернете'
          ]
        }
      ]
    };
  }
}
