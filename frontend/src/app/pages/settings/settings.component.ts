import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  settings = {
    appName: 'Admin Dashboard',
    email: 'admin@gmail.com',
    notifications: true
  };

  save() {
    alert('Settings saved successfully!');
    console.log(this.settings);
  }

}