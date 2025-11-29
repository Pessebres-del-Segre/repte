import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.model';

@Component({
  selector: 'app-store-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.css']
})
export class StoreEditComponent implements OnInit {
  storeId: string | null = null;
  secretKey: string = '';
  store: Store | null = null;
  storeForm: FormGroup;
  stores: Store[] = [];
  selectedFile: File | null = null;

  loading = false;
  verifying = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  showStoreSelection = true;
  showSecretKeyForm = false;
  showEditForm = false;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Check if store ID is in the route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.storeId = id;
        this.showStoreSelection = false;
        this.showSecretKeyForm = true;
      } else {
        this.loadStores();
      }
    });
  }

  loadStores(): void {
    this.loading = true;
    this.storeService.getAllStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hi ha hagut un error al carregar les dades, tanca i torna a entrar.';
        this.loading = false;
      }
    });
  }

  selectStore(storeId: string): void {
    this.storeId = storeId;
    this.showStoreSelection = false;
    this.showSecretKeyForm = true;
  }

  verifyStore(): void {
    if (!this.storeId || !this.secretKey) {
      this.error = 'Si us plau, introdueix la clave secreta.';
      return;
    }

    this.verifying = true;
    this.error = null;

    this.storeService.verifyStore(this.storeId, this.secretKey).subscribe({
      next: (store) => {
        this.store = store;
        this.storeForm.patchValue({
          name: store.name,
          description: store.description || ''
        });
        this.showSecretKeyForm = false;
        this.showEditForm = true;
        this.verifying = false;
      },
      error: (err) => {
        this.error = 'Clau incorrecta!';
        this.verifying = false;
      }
    });
  }


  saveStore(): void {
    if (this.storeForm.invalid) {
      return;
    }

    if (!this.storeId) {
      this.error = 'Error: No se ha seleccionado ninguna tienda.';
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    // First update store data
    this.storeService.updateStore(this.storeId, this.storeForm.value).subscribe({
      next: (updatedStore) => {
        this.store = updatedStore;

        // If there's a file selected, upload it
        if (this.selectedFile) {
          this.uploadImage();
        } else {
          this.saving = false;
          this.success = 'La informació ha estat actualitzada correctament.';
        }
      },
      error: (err) => {
        this.error = 'Error al actualitzar la informació.';
        this.saving = false;
      }
    });
  }

  uploadImage(): void {
    if (!this.storeId || !this.selectedFile) {
      this.saving = false;
      return;
    }

    this.storeService.uploadStoreImage(this.storeId, this.selectedFile).subscribe({
      next: (response) => {
        this.success = 'Información de la tienda y la imagen actualizadas correctamente.';
        this.saving = false;
      },
      error: (err) => {
        this.error = 'La información se actualizó pero hubo un error al subir la imagen.';
        this.saving = false;
      }
    });
  }

  backToSelection(): void {
    this.showStoreSelection = true;
    this.showSecretKeyForm = false;
    this.showEditForm = false;
    this.storeId = null;
    this.secretKey = '';
    this.error = null;
    this.success = null;
    this.loadStores();
  }
}
