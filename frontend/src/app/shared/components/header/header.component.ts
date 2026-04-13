import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  username: string = 'Admin';

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

}