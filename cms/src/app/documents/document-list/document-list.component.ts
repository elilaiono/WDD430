import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentsListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents = [
    { id: 1, name: 'Document 1', description: 'This is document 1', url: 'http://example.com/document1' },
    { id: 2, name: 'Document 2', description: 'This is document 2', url: 'http://example.com/document2' },
    { id: 3, name: 'Document 3', description: 'This is document 3', url: 'http://example.com/document3' },
    { id: 4, name: 'Document 4', description: 'This is document 4', url: 'http://example.com/document4' },
    { id: 5, name: 'Document 5', description: 'This is document 5', url: 'http://example.com/document5' }
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
