import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngFor

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for directives like ngFor
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardwrap') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('light') lightRef!: ElementRef<HTMLDivElement>;

  @Input() cards: string[] = ['Card 1', 'Card 2', 'Card 3'];

  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private animationFrameId: number | undefined;
  activeIndex: number = 1; // começa no do meio
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Initialize light position to the middle card
    this.initializeLightPosition();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeLightPosition(): void {
    if (this.containerRef && this.lightRef && this.cards.length > 0) {
      const container = this.containerRef.nativeElement;
      // Find the actual card elements within the container
      const cardElements = Array.from(container.children).filter(child => child.classList.contains('card')) as HTMLDivElement[];

      const middleCardIndex = Math.floor(cardElements.length / 2);
      const middleCardElement = cardElements[middleCardIndex];

      if (middleCardElement) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = middleCardElement.getBoundingClientRect();

        this.currentX = this.targetX = cardRect.left - containerRect.left + cardRect.width / 2 + 140;
        this.currentY = this.targetY = cardRect.top - containerRect.top + cardRect.height + 100;

        this.lightRef.nativeElement.style.setProperty('--x', this.currentX + 'px');
        this.lightRef.nativeElement.style.setProperty('--y', this.currentY + 'px');
      }
    }
  }

  private animate = () => {
    this.currentX += (this.targetX - this.currentX) * 0.08;
    this.currentY += (this.targetY - this.currentY) * 0.08;

    if (this.lightRef) {
      this.lightRef.nativeElement.style.setProperty('--x', this.currentX + 'px');
      this.lightRef.nativeElement.style.setProperty('--y', this.currentY + 'px');
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  onCardMouseEnter(event: MouseEvent): void {
    const card = event.currentTarget as HTMLDivElement;
    if (this.containerRef) {
      const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      this.targetX = cardRect.left - containerRect.left + cardRect.width / 2 + 140;
      this.targetY = cardRect.top - containerRect.top + cardRect.height + 100;
    }
  }

  
}
