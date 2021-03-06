import './pages/list/list-vm.js';
import './pages/add/add-vm.js';
import './pages/update/update-vm.js';

import ContactDataService from './services/ContactDataService.js';

class AppViewModel {
    constructor() {
        this.contactDataService = new ContactDataService();

        this.listPageInstance = null;
        this.addPageInstance = null;
        this.updatePageInstance = null;

        this.registerListPage = this.registerListPage.bind(this);
        this.registerAddPage = this.registerAddPage.bind(this);
        this.registerUpdatePage = this.registerUpdatePage.bind(this);
        this.navigateToListPage = this.navigateToListPage.bind(this);
        this.navigateToUpdatePage = this.navigateToUpdatePage.bind(this);

    }

    registerListPage(instance) {
        this.listPageInstance = instance;
        this.listPageInstance.inject(this.contactDataService);
        this.listPageInstance.navigate();
    }

    registerAddPage(instance) {
        this.addPageInstance = instance;
        this.addPageInstance.inject(this.contactDataService);
    }

    registerUpdatePage(instance) {
        this.updatePageInstance = instance;
        this.updatePageInstance.inject(this.contactDataService);
    }

    navigateToListPage() {
        this.listPageInstance.navigate();
    }

    navigateToUpdatePage(contact) {
        this.updatePageInstance.navigate();
        this.updatePageInstance.setContactToUpdate(contact);
    }
}

$(document).ready(function(){
    let appmodel = new AppViewModel();
    pager.Href.hash = '#!/';
    pager.extendWithPage(appmodel);
    ko.applyBindings(appmodel);
    pager.start();
    
});
