import {Injectable} from '@angular/core';
import {Contact} from './contact.model';
// import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
   private contacts: Contact [] = [];

   contactListChangedEvent = new Subject<Contact[]>();
   maxContactId: number;

   constructor(private http: HttpClient) {
      // this.contacts = MOCKCONTACTS;
      this.maxContactId = this.getMaxId();
    }

   //  getContact(id: string): Observable<Contact> {
   //    const contact = this.contacts.find((contact) => contact.id === id);
   //    return of (contact)
   //  }

   getContact(id: string): Contact {
      return this.contacts.find((contact) => contact.id === id);
   } 

   //  getContacts(): Contact[] {
   //    return this.contacts
   //      .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
   //      .slice();
   //  }

   getContacts() {
      this.http
        .get<Contact[]>('https://wdd430-final-default-rtdb.firebaseio.com/contacts.json')
        .subscribe({
          next: (contacts: Contact[]) => {
            this.contacts = contacts;
            this.maxContactId = this.getMaxId();
            this.contacts.sort((a, b) => a.name.localeCompare(b.name));
            this.contactListChangedEvent.next(this.contacts.slice());
            console.log(contacts)
          },
          error: (error: any) => {
            console.error(error);
          }
        });
        return this.contacts
        .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
        .slice();
   }

    getMaxId(): number {
      let maxId = 0;
      for (const contact of this.contacts) {
        const currentId = +contact.id;
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
      return maxId;
    }

    addContact(newContact: Contact) {
      if (!newContact) {
         return;
      }
      
      this.maxContactId++;
      newContact.id = this.maxContactId.toString();
      this.contacts.push(newContact);
      this.storeContacts(this.contacts)
      // const contactsListClone = this.contacts.slice();
      // this.contactListChangedEvent.next(contactsListClone);
   }
   
   updateContact(originalContact: Contact, newContact: Contact) {
      if (!originalContact || !newContact) {
         return;
      }
    
      const pos = this.contacts.indexOf(originalContact);
      if (pos < 0) {
         return;
      }
      
      newContact.id = originalContact.id;
      this.contacts[pos] = newContact;
      this.storeContacts(this.contacts)
      // const contactsListClone = this.contacts.slice();
      // this.contactListChangedEvent.next(contactsListClone);
   }

    deleteContact(contact: Contact) {
      if (!contact) {
         return;
      }
      const pos = this.contacts.indexOf(contact);
      if (pos < 0) {
         return;
      }
      this.contacts.splice(pos, 1);
      this.storeContacts(this.contacts)
      // const contactsListClone = this.contacts.slice();
      // this.contactListChangedEvent.next(contactsListClone);
   }

   storeContacts(contacts: Contact[]) {
      const data = JSON.stringify(contacts);
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
      this.http
        .put('https://wdd430-final-default-rtdb.firebaseio.com/contacts.json', data, { headers })
        .subscribe(() => {
          const contactsListClone = contacts.slice();
          this.contactListChangedEvent.next(contactsListClone);
        });
    }
  
}
