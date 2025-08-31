pipeline {
    agent any

    environment {
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        DOCKER_USERNAME =  credentials('DOCKER-USERNAME') // Replace with your Docker Hub username

    }

    stages {
        stage('Build, Test & Deploy All Services') {
            steps {
                script {
                    def services = ["auth-service", "product-service", "order-service", "payment-service", "notification-service"]

                    def parallelStages = services.collectEntries { serviceName ->
                        ["${serviceName}" : {
                            processService(serviceName)
                        }]
                    }

                    parallel parallelStages
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

def processService(serviceName) {
    def version = sh(script: "node -p 'require(\"./services/${serviceName}/package.json\").version'", returnStdout: true).trim()

    echo "Processing ${serviceName}..."

    // Test Code
    sh "cd services/${serviceName} && npm i"
    sh "npm run test --passWithNoTests --workspace=./services/${serviceName}"

    // Build & Push Docker Image
    withCredentials([usernamePassword(credentialsId: 'DOCKER', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
        sh "docker build -t $DOCKER_USERNAME/${serviceName}:v${version} services/${serviceName}"
        sh "docker push $DOCKER_USERNAME/${serviceName}:v${version}"
    }

    // Deploy Service
    sh "kubectl set image deployment/${serviceName} ${serviceName}=$DOCKER_USERNAME/${serviceName}:v${version} --record"
    sh "kubectl rollout status deployment/${serviceName} || kubectl rollout undo deployment/${serviceName}"
}
