pipeline {
    agent any
    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]
    for (s in services) {
               stages {
                    stage('Build') {
                        steps {
                            sh 'echo "Building the project..."' 
                            sh "ls services/${s}"
                        }
                    }
                    stage('Test') {
                        steps {
                        sh 'echo "Running tests..."' 
                        }
                    }
                    stage('Deploy') {
                        steps {
                        sh 'echo "Deploying the application..."' 
                        }
                    }
                }
        }

}