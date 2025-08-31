pipeline {
    agent any

    environment {
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        DOCKER_USERNAME =  credentialsId('DOCKER-USERNAME') // Replace with your Docker Hub username
    }

    stages {
        stage('Build, Test & Deploy') {
            steps {
                script {
                    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]

                    services.each { s ->
                        def version = sh(script: "node -p 'require(\"./services/${s}/package.json\").version'", returnStdout: true).trim()

                        echo "Processing ${s}..."

                        stage("Test ${s}") {
                            sh "cd services/${s} && npm i"
                            sh "npm run test --passWithNoTests --workspace=./services/${s}"
                        }

                        stage("Build & Push ${s}") {
                            withCredentials([usernamePassword(credentialsId: 'DOCKER', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                                sh "docker build -t $DOCKER_USERNAME/${s}:v${version} services/${s}"
                                sh "docker push $DOCKER_USERNAME/${s}:v${version}"
                            }
                        }

                        stage("Deploy ${s}") {
                            sh "kubectl set image deployment/${s} ${s}=$DOCKER_USERNAME/${s}:v${version} --record"
                            sh "kubectl rollout status deployment/${s} || kubectl rollout undo deployment/${s}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
