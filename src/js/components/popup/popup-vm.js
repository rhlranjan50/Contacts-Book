import './popup.scss';
import BaseComponent from '../../BaseComponent';

class PopupComponent extends BaseComponent {
    constructor(prop) {
        super(prop);
        
        this.mPopup = null;
    }

    koDescendantsComplete(node) {
        let modal = node.querySelector('.modal');
        this.mPopup = M.Modal.init(modal,{});
    }

    favoriteClickHandler() {
        this.contact.isFavorite(!this.contact.isFavorite());
        this.prop.favoriteClicked(this.contact);
        //TODO: Write the code for server interaction
    }

    openPopup() {
        this.mPopup.open();
    }


}

ko.components.register('popup', {
    viewModel: PopupComponent,
    template: require('text-loader!./popup.html')
});