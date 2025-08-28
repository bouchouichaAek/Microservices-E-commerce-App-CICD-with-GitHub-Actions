pipeline {
    agent any
    stages {
        stage('Build auth-service') { steps { sh 'echo Build auth-service' } }
        stage('Test auth-service') { steps { sh 'echo Test auth-service' } }
        stage('Deploy auth-service') { steps { sh 'echo Deploy auth-service' } }

        stage('Build product-service') { steps { sh 'echo Build product-service' } }
        stage('Test product-service') { steps { sh 'echo Test product-service' } }
        stage('Deploy product-service') { steps { sh 'echo Deploy product-service' } }
    }
}
