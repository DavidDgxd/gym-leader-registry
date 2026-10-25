import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../../gym-leader';
import { GymLeader } from '../../gym-leader.model';

@Component({
  selector: 'app-leader-form',
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css'
})
export class LeaderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leaderService = inject(GymLeaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal<boolean>(false);
  leaderId = signal<string | null>(null);

  leaderForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto' as 'Kanto' | 'Johto' | 'Hoenn', Validators.required],
    town: ['', Validators.required],
    badge: ['', Validators.required],
    specialty: ['', Validators.required],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', Validators.maxLength(150)]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.leaderId.set(id);

      this.leaderService.getLeader(id).subscribe({
        next: (leader) => {
          this.leaderForm.patchValue({
            name: leader.name,
            region: leader.region,
            town: leader.town,
            badge: leader.badge,
            specialty: leader.specialty,
            aceLevel: leader.aceLevel,
            motto: leader.motto || ''
          });
        },
        error: (err) => console.error('Failed to load leader:', err)
      });
    }
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.leaderForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  protected onSubmit(): void {
    if (this.leaderForm.invalid) {
      this.leaderForm.markAllAsTouched();
      return;
    }

    const payload: GymLeader = this.leaderForm.getRawValue();

    if (this.isEditMode() && this.leaderId()) {
      this.leaderService.updateLeader(this.leaderId()!, payload).subscribe({
        next: () => this.router.navigate(['/leaders']),
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      this.leaderService.addLeader(payload).subscribe({
        next: () => this.router.navigate(['/leaders']),
        error: (err) => console.error('Add failed:', err)
      });
    }
  }

  protected onCancel(): void {
    this.router.navigate(['/leaders']);
  }
}