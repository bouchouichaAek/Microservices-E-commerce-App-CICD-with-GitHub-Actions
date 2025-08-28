pipeline {
    agent any

    stages {
        stage('Build, Test & Deploy Services') {
            steps {
                script {
                    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]

                    for (s in services) {
                        echo "Processing ${s}..."

                        // Test Code
                        stage("Test ${s}") {
                            sh "echo Running tests for ${s}..."
                            sh "ls services/${s}"

                        }

                        // Build Image Docker 
                        stage("Build & Push Docker Image ${s}") {
                            sh "echo Building ${s}..."
                            sh "docker ps -a"
                        }

                        // Deploy Service
                        stage("Deploy ${s}") {
                            sh "echo Deploying ${s}..."
                        }
                    }
                }
            }
        }
    }
}
