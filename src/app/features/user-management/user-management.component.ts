import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { SessionStorageService } from '../../core/services/session-storage.service';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface UserProfileData {
  profileId: number;
  visaStatus: string;
  employmentType: string;
  workType: string;
  location: string;
  createdDate: string;
  resumeTitle: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss']
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<UserProfileData>([]);
  // displayedColumns: string[] = ['name', 'visaStatus', 'empType', 'workType', 'location', 'createdDate'];
  displayedColumns: string[] = ['action', 'resumeTitle', 'visaStatus', 'employmentType', 'workType', 'location', 'createdDate'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  email: string = '';

  constructor(private apiService: ApiService, private session: SessionStorageService) { }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    this.email = this.session.getItem('email') || '';
    this.apiService.getUserProfilesByEmployer(this.email).subscribe({
      next: (data) => {
        var resData = new Array<UserProfileData>();
        data.forEach((profile: any) => {
          resData.push({
            profileId: profile.profileId,
            visaStatus: profile.jobSeeker?.visaStatus, 
            employmentType: profile.jobSeeker?.employmentType,
            workType: profile.jobSeeker?.workType,
            location: profile.jobSeeker?.address,
            createdDate: new Date(profile.createdDate).toLocaleDateString(),
            resumeTitle: profile.resumeTitle
          });
        });
        this.dataSource.data = resData;
      },
      error: (err: any) => {
          console.error('Error', err);
      }
    });
  }

  deleteUser(id: number)
  {
    this.apiService.deleteUserProfilesById(id).subscribe({       
      next: (data) => {
        Swal.fire({
          title: 'User profile deleted successfully!',
          icon: 'success',
          timer: 2000,
        });
        this.loadData();
      },
      error: (err: any) => {
          console.error('Error', err);
      }
    });
  }
}
