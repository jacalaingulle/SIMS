import { Component, inject, OnInit, signal } from '@angular/core';
import { Service } from '../../service/service';
import { usersInterface } from '../../interface/interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings implements OnInit {

  public service = inject(Service);

  users = signal<usersInterface[]>([]);
  filteredUsers = signal<usersInterface[]>([]);
  selectedUser!: usersInterface;
  userData!: usersInterface;
  viewInfoModal = signal(false);
  viewAddUpdateModal = signal(false);
  viewConfirmationModal = signal(false);
  passLength!: string;
  userForm!: FormGroup;
  isAddingUser = signal(false);
  isUpdatingUser = signal(false);
  addUpdateModalLabel = signal('');
  addUpdateBtnText = signal('');
  

  ngOnInit(): void {
    this.service.getUsers().subscribe(data => {
      this.users.set(data);
      this.filteredUsers.set(data)
    });

    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      cpassword: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required)
    });
  }

  infoModal(user : usersInterface){
    this.selectedUser = user;
    this.viewInfoModal.set(true);
    this.passLength = "• ".repeat(user.password.length)
  }

  closeAddUpdateModal(){
    this.viewAddUpdateModal.set(false);
    this.userForm.reset();
    this.isAddingUser.set(false);
    this.isUpdatingUser.set(false);
  }

  submitButton(){
    if(this.isAddingUser()){
      this.userData = {
        id: this.users().length + 1,
        name: this.userForm.value.name,
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        type: this.userForm.value.type,
        email: this.userForm.value.email,
        address: this.userForm.value.address,
        number: this.userForm.value.number
      }

      this.service.addUser(this.userData).subscribe({
        next : response => {
          this.service.getUsers().subscribe(data => {
            this.users.set(data);
            this.filteredUsers.set(data);
          })
          this.viewAddUpdateModal.set(false);
          this.userForm.reset();
        }
      });

    }else{
      this.viewConfirmationModal.set(true);
      this.service.confirmationMsg.set('Are you sure you want to update this user ?');
    }
  }

  createUserButton(){
    this.viewAddUpdateModal.set(true);
    this.isAddingUser.set(true);
    this.addUpdateModalLabel.set('Create New User');
    this.addUpdateBtnText.set('Create New User')
  }

  updateButton(){
    this.viewAddUpdateModal.set(true);
    this.viewInfoModal.set(false);
    this.isAddingUser.set(false);
    this.isUpdatingUser.set(true);
    this.addUpdateModalLabel.set('Update Existing User');
    this.addUpdateBtnText.set('Save Changes');
    this.userForm.patchValue({
        id: this.users().length + 1,
        name: this.selectedUser.name,
        username: this.selectedUser.username,
        password: this.selectedUser.password,
        cpassword: this.selectedUser.password,
        type: this.selectedUser.type,
        email: this.selectedUser.email,
        address: this.selectedUser.address,
        number: this.selectedUser.number
    })
  }

  removeButton(){
    this.isAddingUser.set(false);
    this.isUpdatingUser.set(false);
    this.viewConfirmationModal.set(true);
    this.service.confirmationMsg.set('Are you sure you want to remove this user ?')
  }

  continueAction(){
    if(this.isUpdatingUser()){
      this.userData = {
        id: this.selectedUser.id,
        name: this.userForm.value.name,
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        type: this.userForm.value.type,
        email: this.userForm.value.email,
        address: this.userForm.value.address,
        number: this.userForm.value.number
      };

      this.service.updateUser(this.userData, this.userData.id).subscribe({
        next : response => {
          this.service.getUsers().subscribe(data => {
            this.users.set(data);
            this.filteredUsers.set(data);
            this.closeAddUpdateModal();
            this.viewConfirmationModal.set(false);
          })
        }
      })
    }else{
      this.service.removeUser(this.selectedUser.id).subscribe({
        next : response => {
          this.service.getUsers().subscribe(data => {
            this.users.set(data);
            this.filteredUsers.set(data);
            this.viewInfoModal.set(false);
            this.viewConfirmationModal.set(false);
          })
        }
      })
    }
  }
}
