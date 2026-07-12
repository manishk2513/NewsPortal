pipeline {
    agent any

    environment {
        MONGODB_URI    = credentials('MONGODB_URI')
        GNEWS_API_KEY  = credentials('GNEWS_API_KEY')
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
        JWT_SECRET     = credentials('JWT_SECRET')
        ADMIN_PASSWORD = credentials('ADMIN_PASSWORD')
        NEWSDATA_API_KEY = credentials('NEWSDATA_API_KEY')
    }

    stages {

        stage('Checkout') {
            steps {
                echo '--- Pulling latest code from GitHub ---'
                checkout scm
            }
        }

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

        stage('Test') {
            steps {
                echo '--- Running tests ---'
                dir('backend') {
                    sh 'npm test'
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
                sh '''
                    export MONGODB_URI=$MONGODB_URI
                    export GNEWS_API_KEY=$GNEWS_API_KEY
                    export GEMINI_API_KEY=$GEMINI_API_KEY
                    export JWT_SECRET=$JWT_SECRET
                    export ADMIN_USERNAME=admin
                    export ADMIN_PASSWORD=$ADMIN_PASSWORD
                    export NEWSDATA_API_KEY=$NEWSDATA_API_KEY
                    docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '--- Checking app health ---'
                sh 'sleep 10'
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
    }
}
