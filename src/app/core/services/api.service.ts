import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, finalize, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoaderService } from './loader.service';

export class SearchModel {
  question!: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private loaderService: LoaderService) { }

    // 1. Job Seeker Submit
    submitJobSeeker(data: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/File`, data);
    }

    // 2. Search Profile
    searchProfiles(query: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/search-profile`, { params: { query } });
    }

    // 3. Profile Management
    getProfiles(page: number, size: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/profiles`, { params: { page, size } });
    }

    // 4. User Management
    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }

    // 5. Interview Questions
    searchInterviewQuestions(query: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/interview-questions`, { params: { query } });
    }

    // Dummy Data for demonstration if API is not available
    getDummyData(type: string): Observable<any[]> {
        this.loaderService.show();
        const dummyProfiles = [
            { name: 'John Doe', status: 'Active', empType: 'FullTime', workType: 'Remote', location: 'NYC', skills: 'Angular, Node', percentage: '95', createdDate: new Date() },
            { name: 'Jane Smith', status: 'Pending', empType: 'Contract', workType: 'Hybrid', location: 'SF', skills: 'React, Java', percentage: '88', createdDate: new Date() },
            { name: 'John Doe', status: 'Active', empType: 'FullTime', workType: 'Remote', location: 'NYC', skills: 'Angular, Node', percentage: '95', createdDate: new Date() },
            { name: 'Jane Smith', status: 'Pending', empType: 'Contract', workType: 'Hybrid', location: 'SF', skills: 'React, Java', percentage: '88', createdDate: new Date() },
            { name: 'John Doe', status: 'Active', empType: 'FullTime', workType: 'Remote', location: 'NYC', skills: 'Angular, Node', percentage: '95', createdDate: new Date() },
            { name: 'Jane Smith', status: 'Pending', empType: 'Contract', workType: 'Hybrid', location: 'SF', skills: 'React, Java', percentage: '88', createdDate: new Date() },
            { name: 'John Doe', status: 'Active', empType: 'FullTime', workType: 'Remote', location: 'NYC', skills: 'Angular, Node', percentage: '95', createdDate: new Date() },
            { name: 'Jane Smith', status: 'Pending', empType: 'Contract', workType: 'Hybrid', location: 'SF', skills: 'React, Java', percentage: '88', createdDate: new Date() },
            { name: 'John Doe', status: 'Active', empType: 'FullTime', workType: 'Remote', location: 'NYC', skills: 'Angular, Node', percentage: '95', createdDate: new Date() },
            { name: 'Jane Smith', status: 'Pending', empType: 'Contract', workType: 'Hybrid', location: 'SF', skills: 'React, Java', percentage: '88', createdDate: new Date() }
        ];

        const dummyUsers = [
            { name: 'Admin User', visaStatus: 'Citizen', employmentType: 'FullTime', workType: 'Onsite', location: 'Global', createdDate: new Date() },
            { name: 'Hiring Manager', visaStatus: 'GreenCard', employmentType: 'FullTime', workType: 'Hybrid', location: 'USA', createdDate: new Date() }
        ];

        let result: any[] = [];
        if (type === 'profiles') result = dummyProfiles;
        if (type === 'users') result = dummyUsers;

        return of(result).pipe(
            delay(800), // Simulate network delay
            finalize(() => this.loaderService.hide())
        );
    }

    //RAG Search 

  RAGSearch(data: string): Observable<any> {
    debugger;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Optional, if you want to specify the expected response type
    });
    // const question = `"${data}"`;
    var q =new SearchModel();
    q.question =data
    
    return this.http.post(`${this.apiUrl}/RAG/ask`, q, { headers });
  }

  RAGUserInfoSearch(data: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Optional, if you want to specify the expected response type
    });
    const quotedData = `"${data}"`;
    
    return this.http.post(`${this.apiUrl}/RAG/userInfo`, quotedData, { headers });
  }

  RAGInterviewSearch(data: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Optional, if you want to specify the expected response type
    });
    var q =new SearchModel();
    q.question =data
    return this.http.post(`${this.apiUrl}/RAG/interview`, q, { headers });
  }

  RAGChatbotSearch(data: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Optional, if you want to specify the expected response type
    });
    var q =new SearchModel();
    q.question =data
    return this.http.post(`${this.apiUrl}/RAG/chatbot`, q, { headers });
  }

  sendEmail(data: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/Email/send`, data,  { responseType: 'text' });
  }

  //User Management

  getProfileData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ManageProfile`);
  }

    getProfileDataBySearch(data: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Optional, if you want to specify the expected response type
    });
    // const question = `"${data}"`;
    var q =new SearchModel();
    q.question =data
    
    return this.http.post(`${this.apiUrl}/ManageProfile/Search`, q, { headers });
  }

  getProfileDataEmp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ManageProfile/Employer`,data);
  }

  submitProfileData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ManageProfile`, data);
  }

  updateProfileData(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ManageProfile/${id}`, data);
  } 

  submitUserFeedback(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/UserFeedback`, data);
  } 

  getUserFeedbackById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/UserFeedback/GetFeedbackById/${id}`);
  } 

  getProfileDataById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ManageProfile/${id}`);
  }

  downloadResume(fileName: string): Observable<any> {
    const encodedFileName = encodeURIComponent(fileName);
    return this.http.get(`${this.apiUrl}/File/download/${encodedFileName}`, {
      responseType: 'blob'
    });
  }

    downloadAudio(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/UserFeedback/GetFeedbackAudioById/${id}`, {
      responseType: 'blob'
    });
  }

  //manage user profiles
  
  getUserProfilesByEmployer(employerEmail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ManageUserProfiles/?employerEmail=${employerEmail}`);
  }

  deleteUserProfilesById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ManageUserProfiles/deleteProfile/${id}`);
  }

  //interview schedule
  scheduleInterviewById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Interview/agent/${userId}`);
  }
}
