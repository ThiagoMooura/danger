/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// <!DOCTYPE html>
// <html lang="pt-br">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Animação de Logo - Emanação Premium (Final)</title>
//     <style>
//         :root {
//             --bg-color: #0a0c10;
//             --logo-color: #ffffff;
//             --ring-color: rgba(255, 255, 255, 0.4);
//             --glow-color: rgba(255, 255, 255, 0.15);
//         }

//         body {
//             background-color: var(--bg-color);
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             margin: 0;
//             overflow: hidden;
//             font-family: 'Inter', sans-serif;
//         }

//         .scene {
//             position: relative;
//             width: 400px;
//             height: 400px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//         }

//         /* 1. O Quadrado Central (A Fonte) */
//         .central-logo {
//             width: 80px;
//             height: 80px;
//             background: var(--logo-color);
//             border-radius: 22px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             z-index: 10;
//             box-shadow: 0 0 30px var(--glow-color);
//             opacity: 0;
//             transform: scale(0.5);
//             /* Animação de entrada única */
//             animation: logo-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }

//         /* Ícone interno */
//         .central-logo::after {
//             content: "";
//             width: 40px;
//             height: 40px;
//             background: var(--bg-color);
//             mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E") no-repeat center;
//             -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E") no-repeat center;
//         }

//         /* 2. Os Anéis (Emanando do Centro - Sem Rotação e Estáticos no Final) */
//         .ring {
//             position: absolute;
//             border: 2px solid var(--ring-color);
//             border-radius: 30%;
//             opacity: 0;
//             transform: scale(0.2); /* Começa dentro do logo */
//             pointer-events: none;
//             z-index: 5;
//         }

//         /* Anel 1 (Sai primeiro) */
//         .ring-1 {
//             width: 130px;
//             height: 130px;
//             animation: ring-emanate 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//             animation-delay: 0.6s;
//         }

//         /* Anel 2 (Sai em seguida) */
//         .ring-2 {
//             width: 190px;
//             height: 190px;
//             animation: ring-emanate 1.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//             animation-delay: 0.8s;
//             border-style: dashed;
//             border-width: 1.5px;
//         }

//         /* Anel 3 (O maior, sai por último) */
//         .ring-3 {
//             width: 260px;
//             height: 260px;
//             animation: ring-emanate 1.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//             animation-delay: 1s;
//             opacity: 0.1;
//         }

//         /* Keyframes */
//         @keyframes logo-pop {
//             to {
//                 opacity: 1;
//                 transform: scale(1);
//             }
//         }

//         @keyframes ring-emanate {
//             0% {
//                 opacity: 0;
//                 transform: scale(0.2);
//                 filter: blur(5px);
//             }
//             30% {
//                 opacity: 1;
//                 filter: blur(0px);
//             }
//             100% {
//                 opacity: 0.6; /* Estado final sólido e estático */
//                 transform: scale(1);
//             }
//         }

//         /* Brilho de fundo sutil (Estático) */
//         .bg-glow {
//             position: absolute;
//             width: 300px;
//             height: 300px;
//             background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
//             border-radius: 50%;
//             z-index: 1;
//             opacity: 0;
//             animation: fade-in 2s ease forwards 1s;
//         }

//         @keyframes fade-in {
//             to { opacity: 1; }
//         }

//     </style>
// </head>
// <body>

//     <div class="scene">
//         <div class="bg-glow"></div>

//         <!-- Anéis (Emanando do Centro - Sem Rotação e Estáticos) -->
//         <div class="ring ring-1"></div>
//         <div class="ring ring-2"></div>
//         <div class="ring ring-3"></div>

//         <!-- Logo Central -->
//         <div class="central-logo"></div>
//     </div>

// </body>
// </html>
