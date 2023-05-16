import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  @Output() confirmDelete: EventEmitter<any> = new EventEmitter<any>();

  constructor(public bsModalRef: BsModalRef) {}

  onDeleteConfirmed() {
    this.confirmDelete.emit();
    this.bsModalRef.hide();
  }

  onCancel() {
    this.bsModalRef.hide();
  }
}