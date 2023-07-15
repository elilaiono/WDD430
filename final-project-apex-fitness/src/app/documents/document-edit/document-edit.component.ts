import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { NgForm } from '@angular/forms';

import { DocumentService } from '../document.service';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  // childDocument: Document[] = [];
  editMode: boolean = false

  
constructor(
  private documentService: DocumentService,
  private router: Router,
  private route: ActivatedRoute) {

}

ngOnInit(): void {
  this.route.params.subscribe((params: Params) => {
    const id = params['id'];
    if (!id) {
      this.editMode = false;
      return;
    }

    // this.documentService.getDocument(id)
    // .subscribe(documentData => {
      //   this.originalDocument = documentData.document
    // })
    this.originalDocument = this.documentService.getDocument(id);
    if (!this.originalDocument) {
      return;
    }
    this.editMode = true;
    this.document = JSON.parse(JSON.stringify(this.originalDocument));
  });
}

onSubmit(form: NgForm): void {
  console.log(this.editMode);
  const value = form.value;

  const newDocument: Document = new Document(
    '',
    value.name,
    value.description,
    value.url,
    null
    );

  if (this.editMode) {
    this.documentService.updateDocument(this.originalDocument, newDocument);
  } else {
    this.documentService.addDocument(newDocument);
  }

  this.router.navigate(['/documents']);
}

onCancel() {
  this.router.navigate(['/documents']);
}


}
