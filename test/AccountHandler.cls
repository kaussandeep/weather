public with sharing class AccountHandler {
    
    /**
     * @description Creates a new account with validation
     * @param accountName Name of the account
     * @param industry Industry type
     * @param annualRevenue Annual revenue amount
     * @return Id of the created account
     */
    public static Id createAccount(String accountName, String industry, Decimal annualRevenue) {
        if (String.isBlank(accountName)) {
            throw new AuraHandledException('Account name is required');
        }
        
        if (annualRevenue != null && annualRevenue < 0) {
            throw new AuraHandledException('Annual revenue cannot be negative');
        }
        
        Account newAccount = new Account(
            Name = accountName,
            Industry = industry,
            AnnualRevenue = annualRevenue
        );
        
        insert newAccount;
        return newAccount.Id;
    }
    
    /**
     * @description Updates account status to inactive
     * @param accountId The account ID to deactivate
     * @return Boolean indicating success
     */
    public static Boolean deactivateAccount(Id accountId) {
        if (accountId == null) {
            throw new AuraHandledException('Account ID cannot be null');
        }
        
        Account acc = [SELECT Id, Active__c FROM Account WHERE Id = :accountId LIMIT 1];
        acc.Active__c = 'No';
        update acc;
        
        return true;
    }
    
    /**
     * @description Retrieves accounts by industry
     * @param industry The industry to filter by
     * @param limitCount Maximum number of records to return
     * @return List of accounts in the specified industry
     */
    public static List<Account> getAccountsByIndustry(String industry, Integer limitCount) {
        if (String.isBlank(industry)) {
            throw new AuraHandledException('Industry cannot be blank');
        }
        
        Integer maxLimit = (limitCount != null && limitCount > 0) ? limitCount : 100;
        
        return [
            SELECT Id, Name, Industry, AnnualRevenue, Active__c
            FROM Account
            WHERE Industry = :industry
            ORDER BY Name
            LIMIT :maxLimit
        ];
    }
    
    /**
     * @description Calculates total revenue for all accounts in an industry
     * @param industry The industry to calculate for
     * @return Total annual revenue
     */
    public static Decimal calculateIndustryRevenue(String industry) {
        if (String.isBlank(industry)) {
            return 0;
        }
        
        AggregateResult[] results = [
            SELECT SUM(AnnualRevenue) totalRevenue
            FROM Account
            WHERE Industry = :industry AND AnnualRevenue != null
        ];
        
        if (results.isEmpty()) {
            return 0;
        }
        
        Decimal total = (Decimal)results[0].get('totalRevenue');
        return total != null ? total : 0;
    }
}
