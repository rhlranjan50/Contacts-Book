import './list.scss';
import '../../components/contact-card/contactcard-vm.js';
import '../../components/popup/popup-vm.js';
import Contact from '../../models/Contact.js';
import ContactDataService from '../../services/ContactDataService.js';
import BaseComponent from '../../BaseComponent';

class ListPageComponent extends BaseComponent {
    constructor(prop) {
        super(prop);
        this.contactDataServiceInstance = this.require(ContactDataService);
        this.contactData = ko.observableArray([]);
        this.popupInstance = null;
        this.toDeleteContact = null;
        this.popupMessage = ko.observable('');

        this.registerPopupInstance = this.registerPopupInstance.bind(this);
        this.pageNavigationComplete = this.pageNavigationComplete.bind(this);
        this.editContact = this.editContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.updateFavoriteInContact = this.updateFavoriteInContact.bind(this);
        this.popupResultHandler = this.popupResultHandler.bind(this);
        this.sortInAscendingOrder = this.sortInAscendingOrder.bind(this);
    }

    navigate() {
        pager.navigate('#!/list');
    }

    registerPopupInstance(instance) {
        this.popupInstance = instance;
    }

    retrieveContactData() {
        this.contactDataServiceInstance.getAllData().then((data) => {
            this.contactData(data.map((cd) => new Contact(cd)));
        });
    }

    pageNavigationComplete() {
        this.retrieveContactData();
    }

    updateFavoriteInContact(contact) {
        this.contactDataServiceInstance.updateContact(contact.unwrap());
    }

    editContact(contact) {
        this.prop.goToUpdatePage(contact);
    }

    deleteContact(contact) {
        this.toDeleteContact = contact;
        if(this.popupInstance) {
            this.popupMessage('Do you want to delete '+contact.firstName()+'\'s contact?');
            this.popupInstance.openPopup();
        }
    }

    popupResultHandler(result) {
        if(result) {
            this.contactDataServiceInstance.deleteContact(this.toDeleteContact.unwrap()).then(() => {
                this.retrieveContactData();
            });
        }
        this.popupInstance.closePopup();
    }

    sortInAscendingOrder() {
        this.contactData.sort((contact1, contact2) => contact1.firstName() < contact2.firstName() ? -1 : 1);
    }


}

ko.components.register('list-page', {
    viewModel: ListPageComponent,
    template: require('text-loader!./list-page.html')
});