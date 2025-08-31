pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('DOCKER')  
        DOCKER_USERNAME = credentials('DOCKER-USERNAME')  
        KUBECONFIG = '/home/aek/.kube/config'  // Set as env var
        
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
                            sh "cd services/${s} && npm i"
                            sh "npm run test --passWithNoTests --workspace=./services/${s}"
                        }

                        // Build Image Docker 
                        stage("Build & Push Docker Image ${s}") {
                            sh "echo login to Docker registry..."
                            sh "echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin"
                            sh "docker build -t $DOCKER_USERNAME/${s}:v${version} services/${s}"
                            sh "echo Pushing ${s} to Docker registry..."
                            sh "docker push $DOCKER_USERNAME/${s}:v${version}" 
                        }

                        // Deploy Service
                        stage("Deploy ${s}") {
                            sh "echo Deploying ${s}..."
                            sh "kubectl get all"
                            // sh "kubectl set image deployment/${s}-deployment ${s}=$DOCKER_USERNAME/${s}:v${version} --record"
                            // sh "kubectl rollout status deployment/${s}-deployment"
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
