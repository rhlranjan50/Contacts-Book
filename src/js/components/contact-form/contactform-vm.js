import './contactform.scss';
import Contact from '../../models/Contact.js';
import BaseComponent from '../../BaseComponent';

class ContactFormComponent extends BaseComponent {
    constructor(prop) {
        super(prop);
        
        if(this.prop.isNew) {
            this.contact = ko.observable(new Contact());
        } else {
            this.contact = this.prop.contact;
            // this.prop.contact.subscribe(() => {
            //     this.contact(this.prop.contact());
            //     $(this.node).find('.validate').each((index,ele) => $(ele).addClass('valid'));
            // })
        }
        this.node = null;
        
        this.submitContact = this.submitContact.bind(this);
        this.cancel = this.cancel.bind(this);

        this.renderHTML = ko.pureComputed(() => {
            return this.contact() instanceof Contact;
        });


    }

    koDescendantsComplete(node) {
        this.node = node;
    }

    submitContact() {
        if(this.isValidForm()) {
            this.prop.formSubmitted(this.contact().unwrap());
            this.reset();
        } else {
            $(this.node).find('[required]').each((index, ele) => !$(ele).hasClass('valid') ? $(ele).addClass('invalid') : '');
        }
    }

    cancel() {
        this.prop.formCancelled();
        this.reset();
    }

    isValidForm() {
        return $(this.node).find('.invalid').length === 0 && 
        this.contact().firstName() && 
        this.contact().lastName() &&
        this.contact().phone() &&
        this.contact().email();
    }

    reset() {
        this.contact(new Contact());
        $(this.node).find('.valid').each((index, ele) => $(ele).removeClass('valid'));
        $(this.node).find('.invalid').each((index, ele) => $(ele).removeClass('invalid'));
        $(this.node).find('.active').each((index, ele) => $(ele).removeClass('active'));
    }

}

ko.components.register('contact-form', {
    viewModel: ContactFormComponent,
    template: require('text-loader!./contactform.html')
});