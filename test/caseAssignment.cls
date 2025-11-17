public with sharing class CaseAssignmentService {
    // Updated to test GitHub Actions workflow
    
    public static Id assignCaseToQueue(Case newCase) {
        if (newCase == null) {
            throw new AuraHandledException('Case cannot be null');
        }

        // Example: Assign based on priority
        String priority = newCase.Priority;
        Group queueRecord;

        if (priority == 'High') {
            queueRecord = [SELECT Id FROM Group WHERE DeveloperName = 'High_Priority_Queue' LIMIT 1];
        } else {
            queueRecord = [SELECT Id FROM Group WHERE DeveloperName = 'General_Cases_Queue' LIMIT 1];
        }

        newCase.OwnerId = queueRecord.Id;
        update newCase;

        return newCase.OwnerId;
    }
}
