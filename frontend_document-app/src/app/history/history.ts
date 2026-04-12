import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService, PdfSession } from '../document.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  session: PdfSession | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private docService: DocumentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.docService.getSession(id).subscribe({
      next: data => {
        this.zone.run(() => {
          this.session = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack() {
    window.history.back();
  }

  goToAsk() {
    this.router.navigate(['/ask-existing', this.session?.id]);
  }
}
