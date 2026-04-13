import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  constructor(private service: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getUsers().subscribe((res: any) => {
      this.users = res;
    });
  }

  addUser() {
    const newUser = {
      name: 'New User',
      email: 'user@gmail.com',
      role: 'User',
      status: 'Active'
    };

    this.service.addUser(newUser).subscribe(() => {
      this.loadUsers();
    });
  }

}