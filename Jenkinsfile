pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('DOCKER')  
    }

    stages {
        stage('Build, Test & Deploy Services') {
            steps {
                script {
                    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]

                    for (s in services) {
                        def version = sh(script: "node -p 'require(\"./services/${s}/package.json\").version'", returnStdout: true).trim()

                        echo "Processing ${s}..."

                        // Test Code
                        stage("Test ${s}") {
                            sh "echo Running tests for ${s}..."
                            sh "ls services/${s}"
                        }

                        // Build Image Docker 
                        stage("Build & Push Docker Image ${s}") {
                            sh "echo Building ${s}..."
                            sh "docker build -t ${s}:${version} services/${s}"
                            sh "echo Pushing ${s} to Docker registry..."
                            sh "docker push ${s}:${version}" 
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
