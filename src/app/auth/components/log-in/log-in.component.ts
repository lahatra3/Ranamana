import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/core/models/namana.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  logInForm!: FormGroup;
  typeInput!: string;
  textShowKey!: string;
  unauthorized!: boolean;
  errorMessage!: string;

  loading!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn() && this.router.navigateByUrl('/ranamana');
    
    this.loading = false;

    this.logInForm = this.formBuilder.group({
      apiKey: [null, Validators.required]
    });

    this.typeInput ='password';
    this.textShowKey = 'afficher';
    
    this.unauthorized = false;
    this.errorMessage = '';
  }

  onShowKey(event: any): void {
    [this.typeInput, this.textShowKey] = event.target.checked ? 
      ['text', 'cacher']: ['password', 'afficher'];
  }

  onSubmit(): void {
    this.loading = true;
    const data: AuthModel = this.logInForm.value as AuthModel;
    this.authService.logIn(data).subscribe({
      next: () => {
        this.authService.setKey(data.apiKey);
        this.router.navigateByUrl('/ranamana');
        this.loading = false;
      },
      error: response => {
        if(response.status === 401)
          this.errorMessage = 'Clé d\'API invalide!';
        else if(response.status === 402)
          this.errorMessage = 'Clé d\'API expirée!';
        else this.errorMessage = `${response.error.message}: ${response.status}`;
        this.loading = false;
        this.unauthorized = true;
      }
    });
  }
}
