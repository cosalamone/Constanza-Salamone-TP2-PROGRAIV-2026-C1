import { Component, inject, signal, computed, ViewChild, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UserService, IUser, ICreateUserRequest } from '../../../services/user/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { TableBaseComponent } from '../../../core/components/table/table-base/table-base.component';
import { TableColumn } from '../../../core/models/table/table-column.model';
import { ButtonBaseComponent } from '../../../core/components/buttons/button-base/button-base.component';
import { ButtonCommonModel } from '../../../core/models/buttons/button-common.model';
import { of } from 'rxjs';
import { UserType } from '../../../core/enums/user-type.enum';
import { UserFormComponent } from '../../../core/components/forms/user-form/user-form.component';
import { PhotoCaptureService } from '../../../core/services/photo-capture.service';
import { compressImage } from '../../../core/utils/image-compression';
import { ClickOutsideDirective } from '../../../core/directives/click-outside.directive';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    TableBaseComponent,
    ButtonBaseComponent,
    UserFormComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
})
export class AdminUsers implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toastService = inject(ToastService);
  private readonly _photoCaptureService = inject(PhotoCaptureService);

  @ViewChild(UserFormComponent) userForm!: UserFormComponent;

  public readonly users = signal<Record<string, unknown>[]>([]);
  public readonly loading = signal<boolean>(true);
  public readonly showForm = signal<boolean>(false);
  public readonly formLoading = signal<boolean>(false);

  public readonly columns: TableColumn[] = [
    {
      id: 'name',
      header: { label: 'Nombre' },
      cell: { field: 'name', kind: 'text' },
    },
    {
      id: 'lastName',
      header: { label: 'Apellido' },
      cell: { field: 'lastName', kind: 'text' },
    },
    {
      id: 'username',
      header: { label: 'Usuario' },
      cell: { field: 'username', kind: 'text' },
    },
    {
      id: 'role',
      header: { label: 'Rol' },
      cell: {
        field: 'role',
        kind: 'badge',
        badgeClassName: (row: Record<string, unknown>) =>
          row['role'] === UserType.ADMIN ? 'table-base__badge--warning' : '',
      },
    },
    {
      id: 'disabled',
      header: { label: 'Estado' },
      cell: {
        field: 'disabled',
        kind: 'badge',
        formatter: (value: unknown) => (value ? 'Deshabilitado' : 'Activo'),
        badgeClassName: (row: Record<string, unknown>) =>
          row['disabled'] ? 'table-base__badge--danger' : '',
      },
    },
    {
      id: 'actions',
      header: { label: 'Acciones', variant: 'muted' },
      cell: {
        field: 'disabled',
        kind: 'action',
        formatter: (value: unknown) => (value ? 'Habilitar' : 'Deshabilitar'),
        actionClassName: (row: Record<string, unknown>) =>
          row['disabled'] ? 'admin-users__action--enable' : 'admin-users__action--disable',
      },
    },
  ];

  public readonly createUserButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: 'pi pi-plus',
        label: 'Crear usuario',
        action: () => this.toggleForm(),
        permission: of({ allowed: true }),
        style: 'filled',
        styleClass: 'admin-users__create-btn',
      }),
  );

  public readonly cancelButtonModel = computed(
    () =>
      new ButtonCommonModel({
        label: 'Cancelar',
        action: () => this.cancelForm(),
        permission: of({ allowed: true }),
        style: 'outlined',
        styleClass: 'admin-users__cancel-btn',
      }),
  );

  public readonly submitButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: 'pi pi-check',
        label: 'Crear',
        action: () => this.userForm?.onSubmit(),
        permission: of({ allowed: true }),
        style: 'filled',
        disabledSignal: this.formLoading,
        styleClass: 'admin-users__submit-btn',
      }),
  );

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.loading.set(true);
    this._userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users as unknown as Record<string, unknown>[]);
        this.loading.set(false);
      },
      error: () => {
        this._toastService.showError('Error al cargar usuarios');
        this.loading.set(false);
      },
    });
  }

  public toggleForm(): void {
    this.showForm.update((v) => !v);
    if (!this.showForm()) {
      this.userForm?.form.reset({ role: UserType.USER });
    }
  }

  public cancelForm(): void {
    this.showForm.set(false);
    this.userForm?.form.reset({ role: UserType.USER });
    this.userForm?.setPhoto('');
  }

  public async handlePhotoClick(): Promise<void> {
    const dataUrl = await this._photoCaptureService.capturePhoto();
    if (dataUrl) {
      const compressed = await compressImage(dataUrl);
      this.userForm?.setPhoto(compressed);
    }
  }

  public onFormSubmitted(): void {
    if (!this.userForm) return;

    this.formLoading.set(true);
    const formValue = this.userForm.form.value;

    const request: ICreateUserRequest = {
      name: formValue.name ?? '',
      lastName: formValue.lastName ?? '',
      username: formValue.username ?? '',
      password: formValue.password ?? '',
      birthDate: formValue.birthDate ?? '',
      description: formValue.description ?? undefined,
      role: formValue.role ?? UserType.USER,
      profileImage: this.userForm.profileImage() ?? undefined,
    };

    this._userService.createUser(request).subscribe({
      next: () => {
        this._toastService.showSuccess('Usuario creado exitosamente');
        this.cancelForm();
        this.loadUsers();
        this.formLoading.set(false);
      },
      error: (err) => {
        this._toastService.showError(err.error?.message || 'Error al crear usuario');
        this.formLoading.set(false);
      },
    });
  }

  public onCellAction(event: { columnId: string; row: Record<string, unknown> }): void {
    if (event.columnId !== 'actions') return;

    const user = event.row as unknown as IUser;
    const isDisabled = user.disabled;

    this._confirmationService.confirm({
      message: isDisabled
        ? `¿Deseas habilitar al usuario ${user.username}?`
        : `¿Deseas deshabilitar al usuario ${user.username}?`,
      header: isDisabled ? 'Habilitar usuario' : 'Deshabilitar usuario',
      acceptLabel: isDisabled ? 'Habilitar' : 'Deshabilitar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const action$ = isDisabled
          ? this._userService.enableUser(user._id)
          : this._userService.disableUser(user._id);

        action$.subscribe({
          next: () => {
            this._confirmationService.close();
            this._toastService.showSuccess(
              isDisabled ? 'Usuario habilitado' : 'Usuario deshabilitado',
            );
            this.loadUsers();
          },
          error: () => {
            this._confirmationService.close();
            this._toastService.showError('Error al modificar usuario');
          },
        });
      },
      reject: () => {
        this._confirmationService.close();
      },
    });
  }
}
