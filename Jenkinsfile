pipeline {
    agent any
    stages {
        stage('Build, Test & Deploy Services') {
            steps {
                script {
                    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]

                    for (s in services) {
                        stage("Build ${s}") {
                            sh "echo Building ${s}..."
                        }
                        stage("Test ${s}") {
                            sh "echo Testing ${s}..."
                        }
                        stage("Deploy ${s}") {
                            sh "echo Deploying ${s}..."
                        }
                    }
                }
            }
        }
    }
}
