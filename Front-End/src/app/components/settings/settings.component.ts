import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface UserProfile {
  id: number; name: string; email: string; role: string;
  status: string; createdAt: string; lastLogin?: string;
}

interface Permission { label: string; allowed: boolean; }

@Component({
  selector: 'app-settings',
  template: `
  <div class="page-wrap">

    <h1 class="page-title">Settings</h1>
    <p class="page-sub">Manage your account and preferences</p>

    <!-- ══ PROFILE ══ -->
    <div class="card">
      <div class="section-head">
        <div class="section-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <div class="section-title">Profile</div>
          <div class="section-sub">Your account information</div>
        </div>
      </div>

      <div class="profile-row">
        <div class="avatar">{{ initials }}</div>
        <div class="info-grid">
          <div class="info-cell">
            <div class="info-lbl">Full Name</div>
            <div class="info-val">{{ profile.name }}</div>
          </div>
          <div class="info-cell">
            <div class="info-lbl">Email</div>
            <div class="info-val">{{ profile.email }}</div>
          </div>
          <div class="info-cell">
            <div class="info-lbl">Role</div>
            <span class="info-val">{{ capitalize(profile.role) }}</span>
          </div>
          <div class="info-cell">
            <div class="info-lbl">Status</div>
            <span class="info-val">{{ capitalize(profile.status) }}</span>
          </div>
          <div class="info-cell">
            <div class="info-lbl">Member Since</div>
            <div class="info-val strong">{{ fmtDate(profile.createdAt) }}</div>
          </div>
          <div class="info-cell">
            <div class="info-lbl">Last Login</div>
            <div class="info-val strong">{{ profile.lastLogin ? fmtDate(profile.lastLogin) : 'N/A' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ APPEARANCE ══ -->
    <div class="card">
      <div class="section-head">
        <div class="section-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
        <div>
          <div class="section-title">Appearance</div>
          <div class="section-sub">Customize how the dashboard looks</div>
        </div>
      </div>

     

      <div class="pref-row">
        <div class="pref-info">
          <div class="pref-label">Compact View</div>
          <div class="pref-hint">Reduce spacing for more content on screen</div>
        </div>
        <div class="toggle" [class.on]="compactView" (click)="compactView = !compactView; save('compactView', compactView)">
          <div class="knob"></div>
        </div>
      </div>

      <div class="pref-row last">
        <div class="pref-info">
          <div class="pref-label">Email Notifications</div>
          <div class="pref-hint">Receive activity summaries by email</div>
        </div>
        <div class="toggle" [class.on]="emailNotifs" (click)="emailNotifs = !emailNotifs; save('emailNotifs', emailNotifs)">
          <div class="knob"></div>
        </div>
      </div>
    </div>

    <!-- ══ PERMISSIONS ══ -->
    <div class="card">
      <div class="section-head">
        <div class="section-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div class="section-title">Permissions</div>
          <div class="section-sub">Your access level and permissions</div>
        </div>
      </div>

      <div class="perm-list">
        <div class="perm-row" *ngFor="let p of permissions">
          <span class="perm-label">{{ p.label }}</span>
          <span class="perm-val" [class.yes]="p.allowed" [class.no]="!p.allowed">
            {{ p.allowed ? 'Allowed' : 'Denied' }}
          </span>
        </div>
      </div>
    </div>

  
 <!-- Sign Out Card -->
<div class="dark-card">
  <div class="section-head">
    <div class="section-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </div>
    <div>
      <div class="section-title">Sign Out</div>
      <div class="section-sub">End your current session and return to login</div>
    </div>
  </div>

  <div class="pref-row last">
    <div class="pref-info"></div>
    <button class="btn-danger" (click)="signOut()">Sign Out</button>
  </div>
</div>
    <!-- Toast -->
    <div class="toast" [class.show]="toastVisible">{{ toastMsg }}</div>

  </div>
  `,

  styles: [`
   :host {
  display: block;
  background: inherit;
  min-height: 100vh;
  padding: 28px 32px 56px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: inherit;
}
    .page-wrap { max-width: 700px; }

    /* Header */
    .page-title { font-size: 26px; font-weight: 700; color: inherit; margin: 0 0 4px; }
    .page-sub   { font-size: 14px; color: inherit; margin: 0 0 24px; }

    /* White card */
   .card {
  background: inherit;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px 26px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

    /* Section heading */
    .section-head {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 18px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .section-icon {
      width: 30px; height: 30px; border-radius: 8px;
      background: #eef2ff;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .danger-ico { background: #fef2f2; }

    .section-title { font-size: 15px; font-weight: 600; color: inherit; margin-bottom: 2px; }
    .danger-txt    { color: inherit;}
    .section-sub   { font-size: 12px; color: inherit; }

    /* Profile */
    .profile-row { display: flex; align-items: flex-start; gap: 20px; }

    .avatar {
      width: 56px; height: 56px; border-radius: 12px;
      background: #4f46e5; color:inherit;
      font-size: 18px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; letter-spacing: 1px;
    }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 40px; flex: 1; }

    .info-lbl {
      font-size: 11px; color: inherit; margin-bottom: 4px; font-weight: 500;
    }

    .info-val { font-size: 14px; color: inherit; }
    .info-val.strong { font-size: 15px; font-weight: 600; color: inherit; }

    .badge-role {
      display: inline-block; background: #f1f5f9; border: 1px solid #e2e8f0;
      color: inherit; font-size: 12px; font-weight: 600;
      padding: 3px 12px; border-radius: 6px;
    }

    .badge-active {
      display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0;
      color: inherit; font-size: 12px; font-weight: 600;
      padding: 3px 12px; border-radius: 6px;
    }

    /* Preference rows */
    .pref-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 0; border-bottom: 1px solid #f1f5f9; gap: 16px;
    }
    .pref-row.last { border-bottom: none; }
    .pref-info  { flex: 1; }
    .pref-label {
  font-size: 14px;
  font-weight: 500;
  color: inherit;
  margin-bottom: 2px;
}
    .pref-hint  { font-size: 12px; color: inherit; }

    /* Toggle switch */
    .toggle {
      width: 44px; height: 24px; border-radius: 999px;
      background: #cbd5e1; cursor: pointer; position: relative;
      flex-shrink: 0; transition: background 0.2s ease; user-select: none;
    }
    .toggle.on { background: #4f46e5; }

    .knob {
      position: absolute; top: 3px; left: 3px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
    }
    .toggle.on .knob { transform: translateX(20px); }

    /* Permissions */
    .perm-list { display: flex; flex-direction: column; }
    .perm-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 0; border-bottom: 1px solid #f1f5f9;
    }
    .perm-row:last-child { border-bottom: none; }
    .perm-label {
  font-size: 14px;
  color: inherit;
}
    .perm-val   { font-size: 13px; font-weight: 600; }
    .perm-val.yes { color: #16a34a; }
    .perm-val.no  { color: #ef4444; }

    /* Danger zone */
    .danger-card { border-color: #fecaca; }

    .btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 7px 18px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}
    .btn-outline:hover {
  border-color: #94a3b8;
  color: inherit;
}

    .btn-danger {
      background: #fef2f2; border: 1px solid #fecaca;
      color: #ef4444; font-size: 13px; font-weight: 600;
      padding: 7px 18px; border-radius: 8px; cursor: pointer;
      white-space: nowrap; transition: background 0.15s;
    }
    .btn-danger:hover { background: #fee2e2; }

    /* Toast */
    .toast {
      position: fixed; bottom: 28px; right: 32px;
      background: #0f172a; color: #f1f5f9;
      font-size: 14px; font-weight: 500;
      padding: 12px 22px; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      opacity: 0; transform: translateY(10px);
      pointer-events: none; z-index: 9999;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
  `]
})
export class SettingsComponent implements OnInit {

  profile = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: '',
    status: '',
    createdAt: '',
    lastLogin: ''
  };

  initials = 'U';
  
  compactView = false;
  emailNotifs = true;

  permissions: Permission[] = [];

 private permsMap: Record<string, Permission[]> = {
  admin: [
    { label: 'View analytics',        allowed: true },
    { label: 'Manage users',          allowed: true },
    { label: 'Create content',        allowed: true },
    { label: 'Delete content',        allowed: true },
    { label: 'System settings',       allowed: true },
    { label: 'User roles management', allowed: true },
  ],

  moderator: [
    { label: 'View analytics',        allowed: true },
    { label: 'Manage users',          allowed: true },
    { label: 'Create content',        allowed: true },
    { label: 'Delete content',        allowed: true },
    { label: 'System settings',       allowed: true },
    { label: 'User roles management', allowed: true },
  ],

  user: [
    { label: 'View analytics',        allowed: true },
    { label: 'Manage users',          allowed: true },
    { label: 'Create content',        allowed: true },
    { label: 'Delete content',        allowed: true },
    { label: 'System settings',       allowed: true },
    { label: 'User roles management', allowed: true },
  ],
};

  toastVisible = false;
  toastMsg = '';
  private toastTimer: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load appearance settings
    
    const cv = localStorage.getItem('compactView');
    const en = localStorage.getItem('emailNotifs');

    
    if (cv !== null) this.compactView = cv === 'true';
    if (en !== null) this.emailNotifs = en !== 'false';

    // Load logged-in user
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);

      this.profile = {
        id: user._id || user.id || 0,
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        role: (user.role || 'User').toLowerCase(),
        status: (user.status || 'Active').toLowerCase(),
        createdAt:
          user.joined ||
          user.createdAt ||
          new Date().toISOString(),
        lastLogin:
          user.lastLogin ||
          new Date().toISOString()
      };

      this.initials = this.profile.name
        .split(' ')
        .filter((word: string) => word.length > 0)
        .map((word: string) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

      this.setPerms(this.profile.role);
    } else {
      this.setPerms('user');
    }
  }

  setPerms(role: string): void {
    this.permissions =
      this.permsMap[role] || this.permsMap['user'];
  }

 

  save(key: string, value: boolean): void {
    localStorage.setItem(key, String(value));
  }

  resetPrefs(): void {
    this.compactView = false;
this.emailNotifs = true;

   ['compactView', 'emailNotifs'].forEach(k =>
  localStorage.removeItem(k)
);
    this.toast('Preferences reset to defaults');
  }

  signOut(): void {
    this.toast('Signing out...');

    setTimeout(() => {
      localStorage.clear();
      window.location.href = '/login';
    }, 800);
  }

  capitalize(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  fmtDate(date: string): string {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  toast(message: string): void {
    clearTimeout(this.toastTimer);

    this.toastMsg = message;
    this.toastVisible = true;

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 2500);
  }
}
