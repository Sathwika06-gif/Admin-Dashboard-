import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'Admin' | 'Moderator' | 'User';
  status: 'Active' | 'Inactive';
  joined: string;
}

@Component({
  selector: 'app-users',
  template: `
    <div class="users-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Users</h1>
          <p>{{ filteredUsers().length }} total users</p>
        </div>

        <div class="header-actions">
  <select class="date-filter" [(ngModel)]="dateRange">
    <option value="30">Last 30 Days</option>
    <option value="180">Last 6 Months</option>
    <option value="365">Last 1 Year</option>
    <option value="all">All Time</option>
  </select>

  <button class="add-btn" (click)="showModal = true">
    + Add User
  </button>
</div>
      </div>

      <!-- Filters -->
      <div class="filters-row">
        <input
          type="text"
          placeholder="Search by name or email..."
          [(ngModel)]="searchTerm"
        />

        <select [(ngModel)]="roleFilter">
          <option value="">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="User">User</option>
        </select>

        <select [(ngModel)]="statusFilter">
          <option value="">All status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let user of filteredUsers()">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ user.initials }}</div>
                  <div>
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                </div>
              </td>

              <td>
                <span
                  class="role-badge"
                  [class.role-admin]="user.role === 'Admin'"
                  [class.role-moderator]="user.role === 'Moderator'"
                  [class.role-user]="user.role === 'User'"
                >
                  {{ user.role }}
                </span>
              </td>

              <td>
                <span
                  class="status-badge"
                  [class.status-active]="user.status === 'Active'"
                  [class.status-inactive]="user.status === 'Inactive'"
                >
                  {{ user.status }}
                </span>
              </td>

              <td>{{ user.joined }}</td>

              <td>
                <button
                  class="icon-btn edit-btn"
                  (click)="editUser(user)"
                >
                  Edit
                </button>

                <button
                  class="icon-btn delete-btn"
                  (click)="deleteUser(user.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty" *ngIf="filteredUsers().length === 0">
          No users found.
        </div>
      </div>

      <!-- Add User Modal -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal">
          <button class="close-btn" (click)="closeModal()">×</button>

          <h2>Add User</h2>
          <p class="subtitle">Create a new user account.</p>

          <label>Full Name</label>
          <input [(ngModel)]="newUser.name" />

          <label>Email</label>
          <input [(ngModel)]="newUser.email" type="email" />

          <label>Password</label>
          <input [(ngModel)]="newUser.password" type="password" />

          <label>Role</label>
          <select [(ngModel)]="newUser.role">
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="User">User</option>
          </select>

          <label>Status</label>
          <select [(ngModel)]="newUser.status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div class="modal-actions">
            <button class="cancel-btn" (click)="closeModal()">
              Cancel
            </button>
            <button class="save-btn" (click)="saveUser()">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
 :host {
  display: block;
  padding: 24px 28px;
  background: inherit;
  color: inherit;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* Header actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-filter {
  width: 160px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: inherit;
  color: inherit;
  font-size: 14px;
}

.users-page {
  width: 100%;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1;
  font-weight: 700;
  color: inherit;
  letter-spacing: -0.02em;
}

.page-header p {
  margin: 8px 0 0;
  font-size: 15px;
  color: inherit;
  opacity: 0.75;
}

/* Add Button */
.add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  outline: none;
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #ffffff;
  padding: 8px 14px;
  height: 40px;
  min-width: 110px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.22);
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.28);
}

/* Filters */
.filters-row {
  display: grid;
  grid-template-columns: 1fr 180px 180px;
  gap: 16px;
  margin-bottom: 24px;
}

input,
select {
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border: 1px solid #334155;
  border-radius: 10px;
  background: inherit;
  color: inherit;
  box-sizing: border-box;
  outline: none;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder {
  color: inherit;
  opacity: 0.6;
}

input:focus,
select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
}

/* Table Card */
.table-card {
  background: inherit;
  border: 1px solid #334155;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(148, 163, 184, 0.08);
}

th {
  text-align: left;
  padding: 18px 22px;
  font-size: 14px;
  font-weight: 600;
  color: inherit;
  opacity: 0.75;
  border-bottom: 1px solid #334155;
}

td {
  padding: 18px 22px;
  border-bottom: 1px solid #334155;
  vertical-align: middle;
  color: inherit;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: rgba(148, 163, 184, 0.06);
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 260px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: inherit;
  line-height: 1.3;
}

.user-email {
  margin-top: 3px;
  font-size: 14px;
  color: inherit;
  opacity: 0.75;
}

/* Badges */
.role-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

/* Role Colors */
.role-admin {
  background: #ede9fe;
  color: #7c3aed;
}

.role-moderator {
  background: #dbeafe;
  color: #2563eb;
}

.role-user {
  background: #e5e7eb;
  color: #475569;
}

/* Status Colors */
.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-inactive {
  background: #fef3c7;
  color: #b45309;
}

/* Action Buttons */
.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 8px;
  margin-right: 6px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.edit-btn {
  color: inherit;
}

.edit-btn:hover {
  background: rgba(148, 163, 184, 0.1);
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fef2f2;
}

/* Empty State */
.empty {
  padding: 40px;
  text-align: center;
  color: inherit;
  opacity: 0.65;
  font-size: 15px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: inherit;
  color: inherit;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
}

.modal h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: inherit;
}

.subtitle {
  margin: 8px 0 24px;
  font-size: 14px;
  color: inherit;
  opacity: 0.75;
}

.modal label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.modal input,
.modal select {
  margin-bottom: 18px;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-size: 28px;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(148, 163, 184, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn,
.save-btn {
  border: none;
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background: transparent;
  color: inherit;
  border: 1px solid #334155;
}

.save-btn {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: #ffffff;
}

/* Responsive */
@media (max-width: 1024px) {
  h1 {
    font-size: 42px;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  :host {
    padding: 18px;
  }

  h1 {
    font-size: 34px;
  }

  .table-card {
    overflow-x: auto;
  }

  table {
    min-width: 900px;
  }

  .modal {
    padding: 24px;
  }
}
`]
})
export class UsersComponent implements OnInit {
  apiUrl = 'http://localhost:5000/api/users';

  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  showModal = false;
dateRange: string = '30';
  users: UserItem[] = [];

  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'User' as 'Admin' | 'Moderator' | 'User',
    status: 'Active' as 'Active' | 'Inactive'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load all users from MongoDB (imported from accounts.csv)
  loadUsers(): void {
  this.http.get<any[]>(this.apiUrl).subscribe({
    next: (data) => {
      console.log('Users API Response:', data); // Check browser console

      this.users = (data || []).map((u: any) => {
        const name = u.name || u.account || 'Unknown User';

        // IMPORTANT: Use CSV joined field exactly
      

        return {
          id: u._id,
          name: name,
          email:
            u.email ||
            this.generateEmail(name),
          initials: this.getInitials(name),
          role: this.normalizeRole(u.role),
          status: this.normalizeStatus(u.status),

          // Show exact CSV joined date
   joined: String(u.joined || u.joinedDate || 'N/A')
        };
      });
    },
    error: (err) => {
      console.error('Load Users Error:', err);
      this.users = [];
    }
  });
}

  filteredUsers(): UserItem[] {
    return this.users.filter(user => {
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesRole =
        !this.roleFilter || user.role === this.roleFilter;

      const matchesStatus =
        !this.statusFilter || user.status === this.statusFilter;

      let matchesDate = true;

if (this.dateRange !== 'all') {
  const days = Number(this.dateRange);
  const joinedDate = new Date(user.joined);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  matchesDate = joinedDate >= cutoff;
}

return (
  matchesSearch &&
  matchesRole &&
  matchesStatus &&
  matchesDate
);
    });
  }

  saveUser(): void {
    if (
      !this.newUser.name.trim() ||
      !this.newUser.email.trim() ||
      !this.newUser.password.trim()
    ) {
      alert('Please enter all required fields');
      return;
    }

    this.http.post(this.apiUrl, this.newUser).subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Create User Error:', err);
        alert(err?.error?.message || 'Failed to create user');
      }
    });
  }

  closeModal(): void {
    this.showModal = false;

    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'User',
      status: 'Active'
    };
  }

 editUser(user: any): void {
  const name = prompt('Enter Name', user.name || '');
  if (name === null) return;

  const email = prompt('Enter Email', user.email || '');
  if (email === null) return;

  const role = prompt(
    'Enter Role (Admin/User/Moderator)',
    user.role || 'User'
  );
  if (role === null) return;

  const status = prompt(
    'Enter Status (Active/Inactive)',
    user.status || 'Active'
  );
  if (status === null) return;

  const joined = prompt(
    'Enter Joined Date (YYYY-MM-DD)',
    user.joined || ''
  );
  if (joined === null) return;

  const updatedUser = {
    account: user.name || name,
    name: name,
    email: email,
    role: role,
    status: status,
    joined: joined
  };

  // IMPORTANT: use user.id (not user._id)
  this.http
    .put(`${this.apiUrl}/${user.id}`, updatedUser)
    .subscribe({
      next: () => {
        this.loadUsers();
        alert('User updated successfully');
      },
      error: (error) => {
        console.error('Update Error:', error);
        alert('Failed to update user');
      }
    });
}

  deleteUser(id: string): void {
    if (!confirm('Delete this user?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Delete User Error:', err);
        alert('Failed to delete user');
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter((part: string) => part.length > 0)
      .map((part: string) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  normalizeRole(role: string): 'Admin' | 'Moderator' | 'User' {
    const value = (role || '').toLowerCase();

    if (value === 'admin') return 'Admin';
    if (value === 'moderator') return 'Moderator';
    return 'User';
  }

  normalizeStatus(status: string): 'Active' | 'Inactive' {
    const value = (status || '').toLowerCase();
    return value === 'inactive' ? 'Inactive' : 'Active';
  }

formatDate(dateValue: any): string {
  if (!dateValue) return 'N/A';

  // Convert to string
  const value = String(dateValue).trim();

  // If already in YYYY-MM-DD format, return exactly as is
  // Example: 2026-05-08
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // If full ISO date like 2026-05-08T00:00:00.000Z
  // return only the first 10 characters
  if (value.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.substring(0, 10);
  }

  // Fallback: convert with JavaScript Date
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  // Return YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
  generateEmail(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '.') +
      '@example.com'
    );
  }
}
