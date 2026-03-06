import { Component, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { UserDetail } from '../../models/userdetails';
import { MsalService } from '@azure/msal-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './search-profile.html',
  styleUrls: ['./search-profile.scss']
})
export class SearchProfileComponent implements AfterViewInit {
  searchQuery = '';
  dataSource = new MatTableDataSource<UserDetail>([]);
  // displayedColumns: string[] = ['name', 'status', 'empType', 'workType', 'location', 'skills', 'percentage'];
  displayedColumns: string[] = ['action','first_name', 'visa_status', 'employment_type', 'work_type', 'preffered_location', 'skills', 'matching_percentage' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService, private dialog: MatDialog) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSearch() {
    this.apiService.RAGSearch(this.searchQuery).subscribe({
      next: (data) => {
        this.dataSource.data = data;
         setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 800);
      },
      error: (err: any) => {
          console.error('Error', err);
      }
    });
  }

   userInfo(name: string, email: string, fullName: string, user: UserDetail){
     this.apiService.RAGUserInfoSearch(fullName).subscribe({
      next: (data: any) => {
        this.dialog.open(UserInfoComponent, {
          // width: '1000px',
          disableClose: true, 
          maxWidth: "100%",
          data: {data, name, fullName, user, query: this.searchQuery }
        });
      },
      error: (err: any) => {
          console.error('Error', err);
      },
      complete: () => {
      }
    });
  }
}

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './user-info.component.html',
  styleUrls: ['./search-profile.scss']
})
export class UserInfoComponent {
  userName = '';
  fullName = '';
  searchText = '';
  profileId = '';
  data: any;
  user:any;

  constructor(@Inject(MAT_DIALOG_DATA) public js: any, private apiService: ApiService,private msalService: MsalService) {
    this.data = js.data;
    this.userName = js.name;
    this.fullName = js.fullName;
    this.searchText = js.query;
    this.user = js.user;
    this.profileId = js.user.profile_id;
  }

  connectUser()
  {
      const account = this.msalService.instance.getActiveAccount();
  
      if (account && account.idTokenClaims) {
        const claims = account.idTokenClaims as any;
  
        const name = claims.name; // or claims.given_name + " " + claims.family_name
        const email = claims.email || claims.preferred_username;
        
       

        //user details saving

        var userRequest = {
          EmployeeName: this.fullName,
          EmployeeEmail: this.user.full_email,
          EmployerName: name,
          EmployerEmail: email,
          Skills: this.user.skills,
          VisaStatus: this.user.visa_status,
          EmploymentType: this.user.employment_type,
          WorkType: this.user.work_type,
          PrefferedLocation: this.user.preffered_location,
          SearchText: this.searchText,
          ResumeTitle: this.user.resume_title,
          IsActive: true,
          Status: "In Progress",
          EmployerStatus: "Selected",
          CreatedDate: new Date(),
          UpdatedDate: new Date(),
          ProfileId:this.user.profile_id
        }
        this.apiService.submitProfileData(userRequest).subscribe({
          next: (profile: { profileId: any; }) => {
            // this.isLoading = false; 
             // email request
              var emailRequest = {
                EmployerName: name,
                JobSeekerName: this.fullName,
                Email: email,
                To: "srangu@rcrotech.com",
                Subject: "Selected user profile",
                Body: "Sample Text",
                UserId: profile.profileId
              }

              this.apiService.sendEmail(emailRequest).subscribe({
                next: (data: any) => {
                  Swal.fire({
                    title: 'Request sent successfully! Our team will get back to you soon!',
                    icon: 'success'
                  });
                },
                error: (err: any) => {
                  console.error('Error', err);
                }
              });
          },
          error: (err: any) => {
            console.error('Error', err);
          }
        });
       
      }
  }
}
