public with sharing class CaseAssignmentService {
    // Updated to test GitHub Actions workflow - v3
    
    /**
     * @description Assigns a case to appropriate queue based on priority
     * @param newCase The case to be assigned
     * @return Id of the assigned owner
     */
    public static Id assignCaseToQueue(Case newCase) {
        if (newCase == null) {
            throw new AuraHandledException('Case cannot be null');
        }

        // Example: Assign based on priority
        String priority = newCase.Priority;
        Group queueRecord;

        if (priority == 'High') {
            queueRecord = [SELECT Id FROM Group WHERE DeveloperName = 'High_Priority_Queue' LIMIT 1];
        } else if (priority == 'Medium') {
            queueRecord = [SELECT Id FROM Group WHERE DeveloperName = 'Medium_Priority_Queue' LIMIT 1];
        } else {
            queueRecord = [SELECT Id FROM Group WHERE DeveloperName = 'General_Cases_Queue' LIMIT 1];
        }

        newCase.OwnerId = queueRecord.Id;
        update newCase;

        return newCase.OwnerId;
    }

            public static List<Id> assignCasesToQueue12(List<Case> cases) {
        List<Id> assignedIds = new List<Id>();
        
        if (cases == null || cases.isEmpty()) {
            return assignedIds;
        }
        
        for (Case c : cases) {
            try {
                Id assignedId = assignCaseToQueue(c);
                assignedIds.add(assignedId);
            } catch (Exception e) {
                System.debug('Error assigning case: ' + e.getMessage());
            }
        }
        
        return assignedIds;
    }

    
    /**
     * @description Assigns multiple cases to queues in bulk
     * @param cases List of cases to be assigned
     * @return List of assigned case IDs
     */
    public static List<Id> assignCasesToQueues(List<Case> cases) {
        List<Id> assignedIds = new List<Id>();
        
        if (cases == null || cases.isEmpty()) {
            return assignedIds;
        }
        
        for (Case c : cases) {
            try {
                Id assignedId = assignCaseToQueue(c);
                assignedIds.add(assignedId);
            } catch (Exception e) {
                System.debug('Error assigning case: ' + e.getMessage());
            }
        }
        
        return assignedIds;
    }
    
    /**
     * @description Gets the queue name based on priority
     * @param priority Priority level
     * @return Queue developer name
     */
    public static String getQueueNameByPriority(String priority) {
        if (priority == 'High') {
            return 'High_Priority_Queue';
        } else if (priority == 'Medium') {
            return 'Medium_Priority_Queue';
        } else {
            return 'General_Cases_Queue';
        }
    }
}
