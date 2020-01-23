import './popup.scss';
import BaseComponent from '../../BaseComponent';

class PopupComponent extends BaseComponent {
    constructor(prop) {
        super(prop);
        
        this.mPopup = null;

        this.message = ko.isObservable(this.prop.message) ? this.prop.message : ko.observable(this.prop.message);

        this.okay = this.okay.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    koDescendantsComplete(node) {
        let modal = node.querySelector('.modal');
        this.mPopup = M.Modal.init(modal,{});
    }

    favoriteClickHandler() {
        this.contact.isFavorite(!this.contact.isFavorite());
        this.prop.favoriteClicked(this.contact);
    }

    openPopup() {
        this.mPopup.open();
    }

    closePopup() {
        this.mPopup.close();
    }

    okay() {
        if(this.prop.popupResult) {
            this.prop.popupResult(true);
        }
    }

    cancel() {
        if(this.prop.popupResult) {
            this.prop.popupResult(false);
        }
    }



}

ko.components.register('popup', {
    viewModel: PopupComponent,
    template: require('text-loader!./popup.html')
});