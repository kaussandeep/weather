public with sharing class ContactManager {
    
    /**
     * @description Creates a new contact with validation
     * @param firstName First name of the contact
     * @param lastName Last name of the contact
     * @param email Email address of the contact
     * @return Id of the created contact
     */
    public static Id createContact(String firstName, String lastName, String email) {
        if (String.isBlank(lastName)) {
            throw new AuraHandledException('Last name is required');
        }
        
        if (String.isNotBlank(email) && !isValidEmail(email)) {
            throw new AuraHandledException('Invalid email format');
        }
        
        Contact newContact = new Contact(
            FirstName = firstName,
            LastName = lastName,
            Email = email
        );
        
        insert newContact;
        return newContact.Id;
    }
    
    /**
     * @description Validates email format
     * @param email Email address to validate
     * @return Boolean indicating if email is valid
     */
    private static Boolean isValidEmail(String email) {
        String emailRegex = '^[a-zA-Z0-9._|\\\\%#~`=?&/$^*!}{+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
    
    /**
     * @description Updates contact email addresses in bulk
     * @param contactIds List of contact IDs to update
     * @param newEmail New email address to set
     * @return Number of successfully updated contacts
     */
    public static Integer updateContactEmails(List<Id> contactIds, String newEmail) {
        if (contactIds == null || contactIds.isEmpty()) {
            return 0;
        }
        
        if (!isValidEmail(newEmail)) {
            throw new AuraHandledException('Invalid email format');
        }
        
        List<Contact> contactsToUpdate = [
            SELECT Id, Email 
            FROM Contact 
            WHERE Id IN :contactIds
        ];
        
        for (Contact c : contactsToUpdate) {
            c.Email = newEmail;
        }
        
        update contactsToUpdate;
        return contactsToUpdate.size();
    }
    
    /**
     * @description Retrieves contacts by account
     * @param accountId The account ID to search for
     * @return List of contacts associated with the account
     */
    public static List<Contact> getContactsByAccount(Id accountId) {
        if (accountId == null) {
            throw new AuraHandledException('Account ID cannot be null');
        }
        
        return [
            SELECT Id, FirstName, LastName, Email, Phone
            FROM Contact
            WHERE AccountId = :accountId
            ORDER BY LastName, FirstName
        ];
    }
}