import './add.scss';
import '../../components/contact-form/contactform-vm.js';
import ContactDataService from '../../services/ContactDataService.js';
import BaseComponent from '../../BaseComponent';

class AddPageComponent extends BaseComponent {
    constructor(prop) {
        super(prop);

        this.contactDataServiceInstance = this.require(ContactDataService);
        this.pageNavigationComplete = this.pageNavigationComplete.bind(this);
        this.saveNewContact = this.saveNewContact.bind(this);
        this.goToListPage = this.goToListPage.bind(this);
    }

    navigate() {
        pager.navigate('#!/add');
    }

    saveNewContact(contact) {
        this.contactDataServiceInstance.addContact(contact);
        this.goToListPage();
    }

    goToListPage() {
        this.prop.goToListPage();
    }

    pageNavigationComplete() {
        
    }




}

ko.components.register('add-page', {
    viewModel: AddPageComponent,
    template: require('text-loader!./add-page.html')
});