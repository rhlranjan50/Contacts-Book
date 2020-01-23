import './contactcard.scss';
import BaseComponent from '../../BaseComponent';

class ContactCardComponent extends BaseComponent {
    constructor(prop) {
        super(prop);
        
        this.contact = this.prop.contact;
    }

    koDescendantsComplete(node) {
    }

    favoriteClickHandler() {
        this.contact.isFavorite(!this.contact.isFavorite());
        if(this.prop.favoriteClicked)
            this.prop.favoriteClicked(this.contact);
    }

    editClickHandler() {
        if(this.prop.editClicked) {
            this.prop.editClicked(this.contact);
        }
    }

    deleteClickHandler() {
        if(this.prop.deleteClicked)
            this.prop.deleteClicked(this.contact);
    }
}

ko.components.register('contact-card', {
    viewModel: ContactCardComponent,
    template: require('text-loader!./contactcard.html')
});