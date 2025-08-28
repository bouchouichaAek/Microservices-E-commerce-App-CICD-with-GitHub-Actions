pipeline {
    agent any
    environment {
        DOCKER_USERNAME = credentials('docker')  // معرف في Jenkins Credentials
        // DOCKER_PASSWORD = credentials('docker-password')
    }

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
                            sh "Username is ${DOCKER_USERNAME}"
                            // sh "Password is ${DOCKER_PASSWORD}"
                            // sh "docker build -t ${s}:latest services/${s}"
                            sh "echo Pushing ${s} to Docker registry..."
                            // sh "docker push ${s}:latest" // Uncomment when Docker registry is set up
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
