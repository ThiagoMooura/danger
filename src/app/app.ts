import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class App {
  protected readonly title = signal('danger');
}
