import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div
      [class.dark-mode]="darkMode"
      [class.light-mode]="!darkMode"
      style="display:flex; min-height:100vh;"
    >

      <!-- Sidebar -->
      <aside
        [style.background]="darkMode ? '#161b27' : '#ffffff'"
        [style.border-right]="darkMode ? '1px solid #1e293b' : '1px solid #e5e7eb'"
        style="
          width:260px;
          padding:20px;
          display:flex;
          flex-direction:column;

          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          overflow-y: auto;
        "
      >

        <!-- Logo -->
        <h2 style="
          margin-bottom:30px;
          display:flex;
          align-items:center;
          gap:10px;
        ">
          <span style="
            background:#4f46e5;
            color:white;
            border-radius:50%;
            width:40px;
            height:40px;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <span class="material-symbols-outlined">emoji_events</span>
          </span>

          <div style="display:flex; flex-direction:column;">
            <span style="font-weight:700; font-size:18px; color:#4f46e5;">
              SmartWinnr
            </span>
            <span style="font-size:12px; color:#9ca3af;">
              Admin Dashboard
            </span>
          </div>
        </h2>

        <!-- Navigation -->
        <nav style="display:flex; flex-direction:column; gap:12px;">

          <a routerLink="/dashboard" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
            <span class="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>

          <a routerLink="/users" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
            <span class="material-symbols-outlined">group</span>
            Users
          </a>

          <a routerLink="/content" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
            <span class="material-symbols-outlined">description</span>
            Content
          </a>

          <a routerLink="/analytics" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
            <span class="material-symbols-outlined">analytics</span>
            Analytics
          </a>

          <a routerLink="/settings" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
            <span class="material-symbols-outlined">settings</span>
            Settings
          </a>

        </nav>

        <!-- Bottom Profile Section -->
        <div style="margin-top:auto; padding-top:20px; border-top:1px solid #334155;">

          <!-- Profile -->
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
            <div style="
              width:40px;
              height:40px;
              border-radius:50%;
              background:#4f46e5;
              color:white;
              display:flex;
              align-items:center;
              justify-content:center;
              font-weight:700;
            ">
              {{ profileInitials }}
            </div>

            <div>
              <div style="font-size:14px; font-weight:600;">
                {{ profileName }}
              </div>
              <div style="font-size:12px; color:#64748b;">
                {{ profileRole }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button
              (click)="toggleDarkMode()"
              [style.color]="darkMode ? '#ffffff' : '#111827'"
              style="
                border:none;
                background:transparent;
                cursor:pointer;
                font-size:18px;
                font-weight:600;
              "
            >
              {{ darkMode ? '☀ Light' : '🌙 Dark' }}
            </button>
 <button class="logout-icon" (click)="logout()">
              <span class="material-symbols-outlined">logout</span>
            </button>

          </div>
        </div>

      </aside>

      <!-- Main Content -->
      <main
        style="
          flex:1;
          padding:30px;
          margin-left:260px;
        "
        [style.background]="darkMode ? '#0d1117' : '#f8fafc'"
        [style.color]="darkMode ? '#ffffff' : '#111827'"
      >
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .dark-mode {
      background: #0d1117;
      color: #ffffff;
    }
    /* NAV ITEMS */
.nav-item {
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:10px;
  text-decoration:none;
  cursor:pointer;
  transition: all 0.25s ease;
}

/* Hover */
.nav-item:hover {
  background: rgba(79, 70, 229, 0.1);
  transform: translateX(4px);
}

/* Click effect */
.nav-item:active {
  transform: scale(0.97);
}

/* Dark mode hover */
.dark-mode .nav-item:hover {
  background: rgba(79, 70, 229, 0.2);
}

/* LOGOUT BUTTON */
.logout-btn {
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 14px;
  border-radius:8px;
  border:none;
  cursor:pointer;
  background:#ef4444;
  color:white;
  font-weight:500;
  transition: all 0.25s ease;
}

/* Hover */
.logout-btn:hover {
  background:#dc2626;
  transform: translateY(-1px);
}

/* Click */
.logout-btn:active {
  transform: scale(0.95);
}

    .dark-mode * {
      color: #ffffff !important;
    }

    .dark-mode input,
    .dark-mode textarea,
    .dark-mode select,
    .dark-mode table,
    .dark-mode .card,
    .dark-mode .table-card,
    .dark-mode .modal {
      background: #161b27 !important;
      color: #ffffff !important;
      border-color: #334155 !important;
    }

    .dark-mode th,
    .dark-mode td,
    .dark-mode p,
    .dark-mode span,
    .dark-mode div,
    .dark-mode label,
    .dark-mode h1,
    .dark-mode h2,
    .dark-mode h3,
    .dark-mode h4,
    .dark-mode h5,
    .dark-mode h6 {
      color: #ffffff !important;
    }

    .light-mode {
      background: #f8fafc;
      color: #111827;
    }

    .light-mode * {
      color: #111827;
    }
  `]
})
export class LayoutComponent implements OnInit {

  darkMode = localStorage.getItem('darkMode') === 'true';

  profileName = localStorage.getItem('userName') || 'Acme Corporation';
  profileRole = localStorage.getItem('userRole') || 'Admin';
  profileInitials = this.getInitials(this.profileName);

  ngOnInit(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);

      this.profileName = user.name || 'Admin User';
      this.profileRole = user.role || 'Administrator';
      this.profileInitials = this.getInitials(this.profileName);
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', String(this.darkMode));
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
