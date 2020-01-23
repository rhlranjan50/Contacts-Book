class Contact {
    constructor(data) {
        data = data ? data : {};
        this.id = ko.observable(data.id);
        this.firstName = ko.observable(data.firstName);
        this.lastName = ko.observable(data.lastName);
        this.email = ko.observable(data.email);
        this.phone = ko.observable(data.phone);
        this.isActive = ko.observable(data.isActive);
        this.pictureUrl = ko.observable(data.picture);
        this.isMale = ko.observable(data.gender === 'male' ? true : false);
        this.isFavorite = ko.observable((data.isFavorite === true || data.isFavorite === false) ? data.isFavorite : false);
    }

    unwrap() {
        return {
            id: this.id(),
            firstName: this.firstName(),
            lastName: this.lastName(),
            email: this.email(),
            phone: this.phone(),
            isActive: this.isActive(),
            picture: this.pictureUrl(),
            gender: this.isMale() ? 'male' : 'female',
            isFavorite: this.isFavorite()
        }
    }
}

export default Contact;