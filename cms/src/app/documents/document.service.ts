import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
   }

   
   getDocument(id: string): Document {
      return this.documents.find((document) => document.id === id);
   }
   
   getDocuments() {
      this.http
        .get<Document[]>('https://wdd430-cms-f4908-default-rtdb.firebaseio.com/documents.json')
        .subscribe({
          next: (documents: Document[]) => {
            this.documents = documents;
            this.maxDocumentId = this.getMaxId();
            this.documents.sort((a, b) => a.name.localeCompare(b.name));
            this.documentListChangedEvent.next(this.documents.slice());
            console.log(documents)
          },
          error: (error: any) => {
            console.error(error);
          }
        });
        return this.documents.slice()

    }
   
   getMaxId(): number {
      let maxId = 0;
      
      for (const document of this.documents) {
         const currentId = +document.id;
         if (currentId > maxId) {
            maxId = currentId;
         }
      }
      
      return maxId;
   }
   
   addDocument(newDocument: Document) {
      if (!newDocument) {
         return;
      }
      
      this.maxDocumentId++;
      newDocument.id = this.maxDocumentId.toString();
      this.documents.push(newDocument);
      this.storeDocuments(this.documents)
      // const documentsListClone = this.documents.slice();
      // this.documentListChangedEvent.next(documentsListClone);
   }
   
   updateDocument(originalDocument: Document, newDocument: Document) {
      if (!originalDocument || !newDocument) {
         return;
      }
    
      const pos = this.documents.indexOf(originalDocument);
      if (pos < 0) {
         return;
      }
      
      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;
      this.storeDocuments(this.documents)
      // const documentsListClone = this.documents.slice();
      // this.documentListChangedEvent.next(documentsListClone);
   }
   
   deleteDocument(document: Document) {
      if (!document) {
         return;
      }
      
      const pos = this.documents.indexOf(document);
      if (pos < 0) {
         return;
      }
      
      this.documents.splice(pos, 1);
      this.storeDocuments(this.documents)
      // const documentsListClone = this.documents.slice();
      // this.documentListChangedEvent.next(documentsListClone);
   }

   storeDocuments(documents: Document[]) {
      const data = JSON.stringify(documents);
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
      this.http
        .put('https://wdd430-cms-f4908-default-rtdb.firebaseio.com/documents.json', data, { headers })
        .subscribe(() => {
          const documentsListClone = documents.slice();
          this.documentListChangedEvent.next(documentsListClone);
        });
    }
  }
     

