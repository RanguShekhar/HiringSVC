import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface UserDetail {
  profileId: number;
  jobSeekerName: string;
  status: string;
  employerStatus: string;
  visaStatus: string;
  employmentType: string;
  workType: string;
  location: string;
  createdDate: string;
  updatedDate: string;
  skills: string;
}

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './profile-management.html',
  styleUrls: ['./profile-management.scss']
})
export class ProfileManagementComponent implements OnInit, AfterViewInit {
  // dataSource: any[] = [];
  // displayedColumns: string[] = ['name', 'status', 'visaStatus', 'empType', 'workType', 'location', 'skills', 'createdDate'];
  userDetails: UserDetail[] = [];
  displayedColumns: string[] = ['action','jobSeekerName', 'employerStatus', 'visaStatus', 'employmentType', 'workType', 'location', 'skills', 'createdDate'];
  // dataSource!: MatTableDataSource<UserDetail>;
  dataSource = new MatTableDataSource<UserDetail>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  query = '';
  response = false;
  isAdmin = false;

  totalElements = 0;
  pageSize = 5;
  currentPage = 0;

  constructor(private apiService: ApiService, private msalService: MsalService, private session: SessionStorageService, public router: Router) { }

  ngOnInit() {
    this.GetUsersList();
  }

  // loadProfiles() {
  //   this.apiService.getProfiles(this.currentPage, this.pageSize).subscribe({
  //     next: (data) => {
  //       this.dataSource = data.content || data;
  //       this.totalElements = data.totalElements || data.length;
  //     },
  //     error: (err: any) => {
  //         console.error('Error', err);
  //     }
  //     error: () => {
  //       // Fallback
  //       this.apiService.getDummyData('profiles').subscribe(data => {
  //         const startIndex = this.currentPage * this.pageSize;
  //         const endIndex = startIndex + this.pageSize;
  //         this.dataSource = data.slice(startIndex, endIndex);
  //         this.totalElements = data.length;
  //       });
  //     }
  //   });
  // }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    // this.loadProfiles();
  }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async GetUsersList() {
    this.isAdmin = this.session.getItem('isAdmin') || false;
    if(this.isAdmin)
    {
      this.apiService.getProfileDataBySearch(this.query).subscribe((users) => {
        debugger;
        var resData = new Array<UserDetail>();
        users.forEach((profile: any) => {
          resData.push({
              profileId: profile.profileId,
              jobSeekerName: profile.jobSeeker?.firstName,
              status: profile.interview?.interviewStatusByRecruiter,
              employerStatus: profile.interview?.interviewStatusByRecruiter,
              visaStatus: profile.jobSeeker?.visaStatus,
              employmentType: profile.jobSeeker?.employmentType,
              workType: profile.jobSeeker?.workType,
              location: profile.jobSeeker?.address,
              createdDate: new Date(profile.createdDate).toLocaleDateString(),
              updatedDate: new Date(profile.updatedDate).toLocaleDateString(),
              skills: profile.jobSeeker?.skills
          });
        });
        this.dataSource.data = resData;

        // this.userDetails = users;
        // this.dataSource = new MatTableDataSource(this.userDetails);
        this.response = true;
        if(resData.length ==0)
          {
            Swal.fire({
              title: 'Users not found',
              icon: 'warning',
              timer: 2000,
            });
          }
        // setTimeout(() => {
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // }, 800);
      });
    }else{
        const name = this.session.getItem('userName') || ""; 
        const email = this.session.getItem('email') || "";
        

        const req = {
          Name: name,
          Email: email,
          Search: this.query
        };

        this.apiService.getProfileDataEmp(req).subscribe((users) => {
          this.userDetails = users;
          this.dataSource = new MatTableDataSource(this.userDetails);
          this.response = true;
          if(this.userDetails.length ==0)
            {
              Swal.fire({
                title: 'Users not found',
                icon: 'warning',
                timer: 2000,
              });
            }
          // setTimeout(() => {
          //   this.dataSource.paginator = this.paginator;
          //   this.dataSource.sort = this.sort;
          // }, 800);
        });
    }
  }

  
   playAudio(profileId: number)
  {    
    this.apiService.downloadAudio(profileId).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${profileId}.mp3`;
        anchor.click();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          title: 'Audio file downloaded successfully!',
          icon: 'success',
          timer: 2000,
        });
      },
      error: (error) => {
          Swal.fire({
            title: 'ResuAudio file download failed!',
            icon: 'error',
            timer: 2000,
          });
      }
    });
  }
  download(fileName: string)
  {    
    this.apiService.downloadResume(fileName).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          title: 'Resume downloaded successfully!',
          icon: 'success',
          timer: 2000,
        });
      },
      error: (error) => {
          Swal.fire({
            title: 'Resume download failed!',
            icon: 'error',
            timer: 2000,
          });
      }
    });
  }

  async toggleDetails11(employee: any) {

    const isEmployer = this.session.getItem('isEmployer');
    const isAdmin = this.session.getItem('isAdmin');
    var options = {};
    if(isAdmin){
      options  =  {       
        Hold: "Hold",
        Selected: "Selected",
        Rejected: "Rejected",
        "In Progress": "In Progress",
        "Scheduled Interivew":"Scheduled Interivew",
        "Candidate not available":"Candidate not available",
        "Feedback": "Feedback"
      };
    }
    else{
      options  =  {       
        Hold: "Hold",
        Selected: "Selected",
        Rejected: "Rejected",
        "Feedback": "Feedback"
      };
    }

    const { value: status } = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want change the status of the profile?",
      icon: "warning",
      input: "select",
      inputOptions: options,
      inputPlaceholder: "Select status",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update",

      inputValidator: (value) => {''
        return new Promise((resolve) => {
          if (value) {
            resolve();
          } else {
            resolve("You need to choose something!");
          }
        });
      }
    });

    if (status) {
      var userRequest = {};
      if(isAdmin){
        userRequest = {
          ProfileId: employee.profileId,
          EmployeeName: employee.jobSeekerName,
          EmployeeEmail: employee.jobSeekerEmail,
          EmployerName: employee.employerName,
          EmployerEmail: employee.employerEmail,
          Skills: employee.skills,
          EmployerStatus: employee.employerStatus,
          VisaStatus: employee.visaStatus,
          EmploymentType: employee.employmentType,
          WorkType: employee.workType,
          PrefferedLocation: employee.prefferedLocation,
          IsActive: true,
          Status: status,
          CreatedDate: employee.createdDate,
          UpdatedDate: new Date()
        }
      }else{
        userRequest = {
          ProfileId: employee.profileId,
          EmployeeName: employee.jobSeekerName,
          EmployeeEmail: employee.jobSeekerEmail,
          EmployerName: employee.employerName,
          EmployerEmail: employee.employerEmail,
          Skills: employee.skills,
          VisaStatus: employee.visaStatus,
          EmploymentType: employee.employmentType,
          WorkType: employee.workType,
          PrefferedLocation: employee.prefferedLocation,
          IsActive: true,
          EmployerStatus: status,
          Status: employee.status,
          CreatedDate: employee.createdDate,
          UpdatedDate: new Date()
        }
      }

      this.apiService.updateProfileData(employee.profileId,userRequest).subscribe({
        next: (data: any) => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/manage']);
          });
        },
        error: (err) => {
        },
        complete: () => {
        }
      });
    }
  }

  async toggleDetails(employee: any) {

   
    const isEmployer = this.session.getItem('isEmployer');
    const isAdmin = this.session.getItem('isAdmin');
    var options: any = {};
    if(isAdmin){
      options  =  { 
        "Feedback": "Feedback",    
        Hold: "Hold",
        Selected: "Selected",
        Rejected: "Rejected",
        "In Progress": "In Progress",
        "Scheduled Interivew":"Scheduled Interivew",
        "Agent Interview": "Agent Interview",
        "Candidate not available":"Candidate not available"
      };
    }
    else{
      options  =  { 
        "Feedback": "Feedback",    
        Hold: "Hold",
        Selected: "Selected",
        Rejected: "Rejected"       
      };
    }

    const dropdownHtml = `
        <select id="feedbackType" class="swal2-select">
          <option value="">-- Select Status --</option>
          ${Object.keys(options)
            .map(key => `<option value="${key}">${options[key]}</option>`)
            .join('')}
        </select>

        <textarea id="feedbackText" class="swal2-textarea" rows="8"
          placeholder="Enter feedback here..."
          style="display:none; margin-top:1rem; width:85%"></textarea>
      `;

       
    Swal.fire({
      title: "Do you want change the status of the profile?",
      // text: "Do you want change the status of the profile?",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      html: dropdownHtml,
      showCancelButton: true,
      width: '800px',
      confirmButtonText: 'Update',
      didOpen: () => {
        const dropdown = document.getElementById('feedbackType') as HTMLSelectElement;
        const textarea = document.getElementById('feedbackText') as HTMLTextAreaElement;

        dropdown.addEventListener('change', () => {
          if (dropdown.value === 'Feedback') {
            textarea.style.display = 'block';
          } else {
            textarea.style.display = 'none';
          }
        });
      },
      preConfirm: () => {
        const dropdown = (document.getElementById('feedbackType') as HTMLSelectElement).value;
        const feedback = (document.getElementById('feedbackText') as HTMLTextAreaElement).value;

        if (!dropdown) {
          Swal.showValidationMessage('Please select a status type');
          return false;
        }

        if (dropdown === 'Feedback' && !feedback.trim()) {
          Swal.showValidationMessage('Please enter details for feedback');
          return false;
        }

        return { dropdown, feedback };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('Selected Type:', result.value.dropdown);
        // console.log('Feedback Text:', result.value.feedback);
        if (result.value.dropdown !== 'Feedback' && result.value.dropdown !== "Agent Interview") {
          var userRequest = {};
          if(isAdmin){
            userRequest = {
              ProfileId: employee.profileId,
              JobSeekerName: employee.jobSeekerName,
              JobSeekerEmail: employee.jobSeekerEmail,
              EmployerName: employee.employerName,
              EmployerEmail: employee.employerEmail,
              Skills: employee.skills,
              EmployerStatus: employee.employerStatus,
              VisaStatus: employee.visaStatus,
              EmploymentType: employee.employmentType,
              WorkType: employee.workType,
              PrefferedLocation: employee.prefferedLocation,
              IsActive: true,
              Status: result.value.dropdown,
              CreatedDate: employee.createdDate,
              UpdatedDate: new Date(),
              UserInfo: employee.userInfo,
              Interview: employee.interview,
              JobSeeker: employee.jobSeeker

            }
          }else{
            userRequest = {
              ProfileId: employee.profileId,
              JobSeekerName: employee.jobSeekerName,
              JobSeekerEmail: employee.jobSeekerEmail,
              EmployerName: employee.employerName,
              EmployerEmail: employee.employerEmail,
              Skills: employee.skills,
              VisaStatus: employee.visaStatus,
              EmploymentType: employee.employmentType,
              WorkType: employee.workType,
              PrefferedLocation: employee.prefferedLocation,
              IsActive: true,
              EmployerStatus: result.value.dropdown,
              Status: employee.status,
              CreatedDate: employee.createdDate,
              UpdatedDate: new Date(),
               UserInfo: employee.userInfo,
              Interview: employee.interview,
              JobSeeker: employee.jobSeeker
            }
          }

          this.apiService.updateProfileData(employee.profileId,userRequest).subscribe({
            next: (data: any) => {
              Swal.fire('Thank you!', 'Status updated successfully.', 'success');
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/manage']);
              });
            },
            error: (err) => {
            },
            complete: () => {
            }
          });
        }
        else if(result.value.dropdown === "Agent Interview")
        {

            console.log('employee:', employee.profileId);
           this.apiService.scheduleInterviewById(employee.profileId).subscribe({
            next: (data: any) => {
              Swal.fire('Thank you!', 'An agent call was sent to the user.', 'success');
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/manage']);
              });
            },
            error: (err) => {
            },
            complete: () => {
            }
          });
        }
        else{

          const feedbackRequest = {
              ProfileId: employee.profileId,
              FeedbackText : result.value.feedback,
              CreatedDate: new Date()
            }

            this.apiService.submitUserFeedback(feedbackRequest).subscribe({
            next: (data: any) => {
              Swal.fire('Thank you!', 'Your feedback has been submitted.', 'success');
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/manage']);
              });
            },
            error: (err) => {
            },
            complete: () => {
            }
          });
          
        }
      }
    });
  }

  getFeedback(profileId: number)
  {
    this.apiService.getUserFeedbackById(profileId).subscribe({
      next: (data: any) => {

        const feedbackHtml = data.length > 0
      ? `
        <div class="feedback-list">
          ${data.map((f: { feedbackText: any; createdDate: string | number | Date; }) => `
            <div class="feedback-card">
              <div class="feedback-date">${new Date(f.createdDate).toLocaleDateString()}</div>
              <div class="feedback-text">"${f.feedbackText}"</div>
            </div>
          `).join('')}
        </div>
      `
      : `<p style="text-align:center;">No feedback available for this user.</p>`;

        Swal.fire({
          title: 'User Feedbacks',
          html: feedbackHtml,
          width: "100%",
          showCloseButton: true,
          showConfirmButton: false,
          customClass: {
            popup: 'feedback-popup'
          }
        });
      },
      error: (error) => {
          Swal.fire({
            title: 'Failed to fetch feedback!',
            icon: 'error',
            timer: 2000,
          });
      }
    });
  }
}
