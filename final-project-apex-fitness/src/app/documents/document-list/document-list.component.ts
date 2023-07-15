import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentsListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private docChangeEvent: Subscription

  constructor(private documentService: DocumentService) {
    this.documents = documentService.getDocuments();
  }

  ngOnInit() {
    this.documentService.documentListChangedEvent.subscribe((documents: Document[]) => {
    this.documents = documents;})
    console.log(this.documents);
  }

  ngOnDestroy(): void {
    this.docChangeEvent.unsubscribe();
  }
}
  

