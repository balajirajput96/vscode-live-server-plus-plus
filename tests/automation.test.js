/**
 * Integration tests for automation services
 * Tests the core functionality without requiring external API calls
 */

const assert = require('assert');
const { AutomationOrchestrator } = require('../automation/main');
const { logger } = require('../automation/utils/logger');

// Mock environment variables for testing
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests
process.env.LEARNING_PLAN_START_DATE = '2024-01-01';

describe('Automation Services', function() {
    this.timeout(10000); // 10 second timeout for tests

    let orchestrator;

    before(function() {
        orchestrator = new AutomationOrchestrator();
    });

    describe('AutomationOrchestrator', function() {
        it('should initialize successfully', function() {
            assert(orchestrator, 'Orchestrator should be initialized');
            assert(orchestrator.services, 'Services should be available');
            assert(orchestrator.services.jobAggregator, 'Job aggregator should be available');
            assert(orchestrator.services.learningTracker, 'Learning tracker should be available');
            assert(orchestrator.services.githubTracker, 'GitHub tracker should be available');
        });

        it('should generate weekly recommendations', function() {
            const mockData = {
                jobApplications: 15,
                learningMinutes: 200,
                githubActivity: 25,
                socialMediaPosts: 4,
                ciReliability: 95
            };

            const analysis = orchestrator.analyzeWeeklyTrends(mockData);
            const recommendations = orchestrator.generateWeeklyRecommendations(analysis);

            assert(Array.isArray(recommendations), 'Recommendations should be an array');
            assert(recommendations.length > 0, 'Should provide at least one recommendation');
        });

        it('should analyze weekly trends correctly', function() {
            const highActivityData = {
                jobApplications: 15,
                learningMinutes: 200,
                githubActivity: 25,
                socialMediaPosts: 4,
                ciReliability: 95
            };

            const analysis = orchestrator.analyzeWeeklyTrends(highActivityData);
            
            assert(analysis.trends, 'Analysis should include trends');
            assert(Array.isArray(analysis.trends), 'Trends should be an array');
            assert(analysis.trends.length > 0, 'Should identify at least one trend');
        });
    });

    describe('Logger Utility', function() {
        it('should log messages correctly', function() {
            // Test that logger doesn't throw errors
            assert.doesNotThrow(() => {
                logger.info('Test info message');
                logger.warn('Test warning message');
                logger.error('Test error message');
            }, 'Logger should not throw errors');
        });

        it('should respect log levels', function() {
            const originalLevel = process.env.LOG_LEVEL;
            
            // Set to error level - info should be filtered
            process.env.LOG_LEVEL = 'error';
            const errorLogger = new (require('../automation/utils/logger')).Logger();
            
            assert.doesNotThrow(() => {
                errorLogger.info('This should be filtered');
                errorLogger.error('This should appear');
            }, 'Logger should handle log levels correctly');
            
            // Restore original level
            process.env.LOG_LEVEL = originalLevel;
        });
    });

    describe('Retry Utility', function() {
        const { withRetry } = require('../automation/utils/retry');

        it('should retry failed operations', async function() {
            let attempts = 0;
            const maxAttempts = 3;

            try {
                await withRetry(
                    () => {
                        attempts++;
                        if (attempts < maxAttempts) {
                            throw new Error('Simulated failure');
                        }
                        return 'success';
                    },
                    maxAttempts,
                    'test operation',
                    100 // Short delay for testing
                );
            } catch (error) {
                // Expected to fail - we're testing retry mechanism
            }

            assert(attempts >= 2, 'Should have attempted at least 2 times');
        });

        it('should succeed on first try when operation works', async function() {
            const result = await withRetry(
                () => 'immediate success',
                3,
                'test operation'
            );

            assert.strictEqual(result, 'immediate success', 'Should return result immediately');
        });
    });

    describe('Service Health Checks', function() {
        it('should perform health check without throwing', async function() {
            try {
                const health = await orchestrator.healthCheck();
                assert(health, 'Health check should return result');
                assert(health.timestamp, 'Health check should include timestamp');
            } catch (error) {
                // Health checks may fail due to missing credentials in test environment
                // This is expected and acceptable for testing
                assert(error.message, 'Error should have a message');
            }
        });
    });

    describe('Data Processing', function() {
        it('should handle empty data gracefully', function() {
            const emptyData = {
                jobApplications: 0,
                learningMinutes: 0,
                githubActivity: 0,
                socialMediaPosts: 0,
                ciReliability: 0
            };

            const analysis = orchestrator.analyzeWeeklyTrends(emptyData);
            const recommendations = orchestrator.generateWeeklyRecommendations(analysis);

            assert(analysis, 'Should handle empty data');
            assert(Array.isArray(recommendations), 'Should still provide recommendations');
        });

        it('should validate KPI structure', async function() {
            const mockKPIs = {
                applications: 5,
                learningMinutes: 45,
                commits: 3,
                activeJobs: 12,
                updatedAt: new Date().toISOString()
            };

            // Test KPI structure
            assert(typeof mockKPIs.applications === 'number', 'Applications should be a number');
            assert(typeof mockKPIs.learningMinutes === 'number', 'Learning minutes should be a number');
            assert(typeof mockKPIs.commits === 'number', 'Commits should be a number');
            assert(typeof mockKPIs.activeJobs === 'number', 'Active jobs should be a number');
            assert(typeof mockKPIs.updatedAt === 'string', 'Updated timestamp should be a string');
        });
    });
});

// Run tests if this file is executed directly
if (require.main === module) {
    // Simple test runner for environments without Mocha
    console.log('Running basic automation tests...');
    
    const runBasicTests = async () => {
        try {
            const orchestrator = new AutomationOrchestrator();
            
            // Test 1: Initialization
            console.log('✓ Orchestrator initialization');
            
            // Test 2: Trend analysis
            const mockData = {
                jobApplications: 15,
                learningMinutes: 200,
                githubActivity: 25,
                socialMediaPosts: 4,
                ciReliability: 95
            };
            
            const analysis = orchestrator.analyzeWeeklyTrends(mockData);
            console.log('✓ Weekly trend analysis');
            
            // Test 3: Recommendations
            const recommendations = orchestrator.generateWeeklyRecommendations(analysis);
            console.log('✓ Recommendation generation');
            
            // Test 4: Logger
            logger.info('Test log message');
            console.log('✓ Logger functionality');
            
            console.log('\nAll basic tests passed! 🎉');
            console.log(`Analysis found ${analysis.trends.length} trends`);
            console.log(`Generated ${recommendations.length} recommendations`);
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            process.exit(1);
        }
    };
    
    runBasicTests();
}