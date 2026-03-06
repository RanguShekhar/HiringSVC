import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { SessionStorageService } from '../../core/services/session-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-seeker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './job-seeker.html',
  styleUrls: ['./job-seeker.scss']
})
export class JobSeekerComponent {
  jobForm: FormGroup;
  selectedFile: File | null = null;

  visaTypeOptions =  [
    { value: 'US Citizen', label: 'US Citizen' },
    { value: 'GC', label: 'GC' },
    { value: 'GC EAD', label: 'GC EAD' },
    { value: 'H1B', label: 'H1B' },
    { value: 'L2S', label: 'L2S' },    
    { value: 'H4 EAD', label: 'H4 EAD' },
    { value: 'OPT EAD', label: 'OPT EAD' },
    { value: 'Other', label: 'Other' }
  ];

  empTypeOptions =  [
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Contract', label: 'Contract' }
  ];

  workTypeOptions =  [
    { value: 'On Site', label: 'On Site' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  constructor(private fb: FormBuilder, private apiService: ApiService, private session: SessionStorageService) {
    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      visaType: ['', Validators.required],
      employmentType: ['', Validators.required],
      workType: ['', Validators.required],
      expectedSalary: ['', Validators.required],
      preferredLocation: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.jobForm.valid && this.selectedFile) {
      const formData = new FormData();
      // Object.keys(this.jobForm.value).forEach(key => {
      //   formData.append(key, this.jobForm.value[key]);
      // });
      formData.append('file', this.selectedFile);

      const resumeUploadInfo = {
        employeeName: this.jobForm.value.name,
        EmployeeEmail: this.jobForm.value.email,
        EmployeePhone: this.jobForm.value.phone,
        visaType: this.jobForm.value.visaType,
        empType: this.jobForm.value.employmentType.join(","),
        expectedSalary: this.jobForm.value.expectedSalary,
        workType: this.jobForm.value.workType.join(","),
        workLocation: this.jobForm.value.preferredLocation,
        employerEmail: this.session.getItem('email') || '',
        employerName: this.session.getItem('userName') || ''
      };
      formData.append('resumeUploadInfo', JSON.stringify(resumeUploadInfo));

      this.apiService.submitJobSeeker(formData).subscribe({
        next: (res: any) => {
           Swal.fire({
              title: 'Resume uploaded successfully!',
              icon: 'success',
              timer: 3000,
            });
          this.onClear();
        },
        error: (err: any) => {
          // console.error('Error', err);
           Swal.fire({
              title: 'Resume already exists! Please try again with a different resume.',
              icon: 'error',
              timer: 4000,
            });
          this.onClear();
        }
      });
    } else {
       Swal.fire({
              title: 'Please complete all required fields and upload your resume.',
              icon: 'warning',
              timer: 4000,
            });
    }
  }

  onClear() {
    this.jobForm.reset();
    this.selectedFile = null;
    const fileInput = document.getElementById('resume') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
