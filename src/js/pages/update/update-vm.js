import './update.scss';
import '../../components/contact-form/contactform-vm.js';
import ContactDataService from '../../services/ContactDataService.js';
import BaseComponent from '../../BaseComponent';

class UpdatePageComponent extends BaseComponent {
    constructor(prop) {
        super(prop);

        this.contactToUpdate = ko.observable();

        this.contactDataServiceInstance = this.require(ContactDataService);
        this.updateContact = this.updateContact.bind(this);
        this.goToListPage = this.goToListPage.bind(this);
    }

    navigate() {
        pager.navigate('#!/update');
    }

    setContactToUpdate(contact) {
        this.contactToUpdate(contact);
    }

    updateContact(contact) {
        this.contactDataServiceInstance.updateContact(contact).then(() => {
            this.goToListPage();
        });
    }

    goToListPage() {
        this.prop.goToListPage();
    }




}

ko.components.register('update-page', {
    viewModel: UpdatePageComponent,
    template: require('text-loader!./update-page.html')
});