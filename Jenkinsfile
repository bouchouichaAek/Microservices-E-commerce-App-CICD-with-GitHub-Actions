pipeline {
    agent any

    stages {
        stage('Build, Test & Deploy Services') {
            steps {
                script {
                    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]

                    for (s in services) {
                        echo "Processing ${s}..."

                        // Build
                        stage("Build ${s}") {
                            sh "echo Building ${s}..."
                            sh "ls services/${s}"
                        }

                        // Test
                        stage("Test ${s}") {
                            sh "echo Running tests for ${s}..."
                        }

                        // Deploy
                        stage("Deploy ${s}") {
                            sh "echo Deploying ${s}..."
                        }
                    }
                }
            }
        }
    }
}
