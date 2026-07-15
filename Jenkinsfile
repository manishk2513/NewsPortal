pipeline {
    agent any

    environment {
        MONGODB_URI      = credentials('MONGODB_URI')
        GNEWS_API_KEY    = credentials('GNEWS_API_KEY')
        JWT_SECRET       = credentials('JWT_SECRET')
        ADMIN_PASSWORD   = credentials('ADMIN_PASSWORD')
        // GEMINI_API_KEY is optional — only needed if AI rewrite is re-enabled
        // GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    stages {

        stage('Checkout') {
            steps {
                echo '--- Pulling latest code from GitHub ---'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install Backend') {
                    steps {
                        echo '--- Installing backend dependencies ---'
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install Frontend') {
                    steps {
                        echo '--- Installing frontend dependencies ---'
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        echo '--- Running backend syntax/unit tests ---'
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        echo '--- Linting frontend ---'
                        dir('frontend') {
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '--- Building React frontend ---'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '--- Building Docker images ---'
                sh 'docker compose build'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo '--- Stopping old containers ---'
                sh 'docker compose down || true'
            }
        }

        stage('Deploy') {
            steps {
                echo '--- Starting new containers ---'
                sh """
                    MONGODB_URI=${MONGODB_URI} \\
                    GNEWS_API_KEY=${GNEWS_API_KEY} \\
                    JWT_SECRET=${JWT_SECRET} \\
                    ADMIN_USERNAME=admin \\
                    ADMIN_PASSWORD=${ADMIN_PASSWORD} \\
                    docker compose up -d
                """
            }
        }

        stage('Health Check') {
            steps {
                echo '--- Waiting for backend to be ready ---'
                sh 'sleep 15'
                sh 'curl -f http://localhost:5000/health || exit 1'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded. App is live.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
        always {
            echo '--- Cleaning up dangling Docker images ---'
            sh 'docker image prune -f || true'
        }
    }
}
