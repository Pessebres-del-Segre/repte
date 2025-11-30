import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  alt?: string;
}

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
})
export class TutorialComponent {
  steps: TutorialStep[] = [
    {
      title: 'Passeja i compra per les botigues d’Artesa',
      description:
        'Gaudeix dels carrers i entra als comerços participants. Cada botiga pot amagar un fragment del Pessebre Perdut!',
      image: '/BotigaQuadrat.png',
      alt: 'Il·lustració d’una botiga d’Artesa',
    },
    {
      title: 'Troba els diorames i escaneja el QR',
      description:
        'Busca pels aparadors els diorames del Pessebre Perdut. Quan en trobis un, acosta’t i escaneja el codi QR amb el teu mòbil.',
      image: '/DioramaQuadrat.png',
      alt: 'Diorama del Pessebre dins un pot',
    },
    {
      title: 'Desbloqueja els fragments del conte!',
      description:
        'Cada QR et desbloqueja un nou fragment del conte del Pessebre Perdut dins l’app. Completa tots els diorames per descobrir la història sencera.',
      image: '/Llibre.png',
      alt: 'Fragment del Pessebre Perdut',
    },
  ];
}
