import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-content',
  template: `
    <div class="content-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Content</h1>
          <p>{{ contents.length }} total items</p>
        </div>

        <button class="add-btn" (click)="showModal = true">
          + Add Content
        </button>
      </div>

      <!-- Search -->
      <div class="search-row">
        <input
          type="text"
          placeholder="Search by title..."
          [(ngModel)]="searchTerm"
        />

        <select [(ngModel)]="statusFilter">
          <option value="">All statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let item of filteredContents()">
              <td>{{ item.title }}</td>

              <td>
                <span
                  class="status-badge"
                  [class.published]="item.status === 'Published'"
                  [class.draft]="item.status === 'Draft'"
                >
                  {{ item.status }}
                </span>
              </td>

              <td>{{ item.updated || 'N/A' }}</td>

              <td>
                <button
                  class="small-btn edit-btn"
                  (click)="editContent(item)"
                >
                  Edit
                </button>

                <button
                  class="small-btn delete-btn"
                  (click)="deleteContent(item._id || item.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty" *ngIf="filteredContents().length === 0">
          No content found.
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal">
          <button class="close-btn" (click)="closeModal()">×</button>

          <h2>Create content</h2>
          <p class="subtitle">Add a new content item.</p>

          <label>Title</label>
          <input [(ngModel)]="newContent.title" />

          <label>Body</label>
          <textarea
            rows="6"
            [(ngModel)]="newContent.body"
          ></textarea>

          <label>Status</label>
          <select [(ngModel)]="newContent.status">
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>

          <label>Tags (comma-separated)</label>
          <input
            placeholder="sales, coaching, update"
            [(ngModel)]="newContent.tags"
          />

          <div class="modal-actions">
            <button class="cancel-btn" (click)="closeModal()">
              Cancel
            </button>

            <button class="save-btn" (click)="saveContent()">
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

.content-page {
  padding: 10px;
  background: inherit;
  color: inherit;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  color: inherit;
}

.page-header p {
  margin: 4px 0 0;
  color: inherit;
  opacity: 0.75;
}

/* Add Button */
.add-btn {
  width: auto;
  background: #4f46e5;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

/* Search */
.search-row {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  margin-bottom: 24px;
}

/* Table Card */
.table-card {
  background: inherit;
  color: inherit;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid #334155;
  text-align: left;
  color: inherit;
}

th {
  opacity: 0.75;
  font-size: 14px;
  font-weight: 600;
}

tbody tr:hover {
  background: rgba(148, 163, 184, 0.06);
}

/* Status Badge */
.status-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.published {
  background: #dcfce7;
  color: #166534;
}

.draft {
  background: #f3f4f6;
  color: #374151;
}

/* Action Buttons */
.small-btn {
  width: auto;
  margin-right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background: #3b82f6;
  color: #ffffff;
}

.delete-btn {
  background: #ef4444;
  color: #ffffff;
}

/* Empty State */
.empty {
  text-align: center;
  padding: 30px;
  color: inherit;
  opacity: 0.65;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal */
.modal {
  position: relative;
  background: inherit;
  color: inherit;
  width: 100%;
  max-width: 660px;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal h2 {
  margin: 0;
  font-size: 24px;
  color: inherit;
}

.subtitle {
  margin: 8px 0 24px;
  color: inherit;
  opacity: 0.75;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: inherit;
}

/* Inputs */
input,
textarea,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #334155;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  box-sizing: border-box;
  background: inherit;
  color: inherit;
}

input::placeholder,
textarea::placeholder {
  color: inherit;
  opacity: 0.6;
}

textarea {
  resize: vertical;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 28px;
  color: inherit;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 8px;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn {
  width: auto;
  background: transparent;
  color: inherit;
  border: 1px solid #334155;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.save-btn {
  width: auto;
  background: #6366f1;
  color: #ffffff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .search-row {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 36px;
  }

  .modal {
    padding: 24px;
  }
}
  `]
})
export class ContentComponent implements OnInit {
  apiUrl = 'http://localhost:5000/api/content';

  searchTerm = '';
  statusFilter = '';
  showModal = false;

  contents: any[] = [];

  newContent = {
    title: '',
    body: '',
    status: 'Draft',
    tags: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadContent();
  }

  // Load content from backend
  loadContent(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.contents = data || [];
      },
      error: (err) => {
        console.error('Load Content Error:', err);
        this.contents = [];
      }
    });
  }

  // Filter content
  filteredContents(): any[] {
    return this.contents.filter((item: any) => {
      const matchesSearch =
        (item.title || '')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.statusFilter || item.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  // Create content
  saveContent(): void {
    if (!this.newContent.title.trim()) {
      alert('Please enter a title');
      return;
    }

    this.http.post(this.apiUrl, this.newContent).subscribe({
      next: () => {
        this.closeModal();
        this.loadContent();
        alert('Content created successfully');
      },
      error: (err) => {
        console.error('Create Content Error:', err);
        alert('Failed to create content');
      }
    });
  }

  // Close modal and reset form
  closeModal(): void {
    this.showModal = false;

    this.newContent = {
      title: '',
      body: '',
      status: 'Draft',
      tags: ''
    };
  }

  // Edit content
  editContent(item: any): void {
    const title = prompt('Enter Title', item.title || '');
    if (title === null) return;

    const body = prompt('Enter Body', item.body || '');
    if (body === null) return;

    const status = prompt(
      'Enter Status (Published/Draft)',
      item.status || 'Draft'
    );
    if (status === null) return;

    const tags = prompt('Enter Tags', item.tags || '');
    if (tags === null) return;

    const updatedContent = {
      ...item,
      title,
      body,
      status,
      tags,
      updated: 'Just now'
    };

    this.http
      .put(`${this.apiUrl}/${item._id || item.id}`, updatedContent)
      .subscribe({
        next: () => {
          this.loadContent();
          alert('Content updated successfully');
        },
        error: (error) => {
          console.error('Update Content Error:', error);
          alert('Failed to update content');
        }
      });
  }

  // Delete content
  deleteContent(id: any): void {
    if (!confirm('Delete this content?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadContent();
        alert('Content deleted successfully');
      },
      error: (err) => {
        console.error('Delete Content Error:', err);
        alert('Failed to delete content');
      }
    });
  }
}
