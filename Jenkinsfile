pipeline {
    agent any

    environment {
        MONGODB_URI      = credentials('MONGODB_URI')
        GNEWS_API_KEY    = credentials('GNEWS_API_KEY')
        GEMINI_API_KEY   = credentials('GEMINI_API_KEY')
        JWT_SECRET       = credentials('JWT_SECRET')
        ADMIN_PASSWORD   = credentials('ADMIN_PASSWORD')
        ADMIN_USERNAME   = 'admin'
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
                    sh 'npm ci || npm install'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                echo '--- Installing frontend dependencies ---'
                dir('frontend') {
                    sh 'npm ci || npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo '--- Running backend smoke tests ---'
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

        stage('Build Frontend') {
            steps {
                echo '--- Building React frontend ---'
                dir('frontend') {
                    sh 'VITE_API_URL=/api npm run build'
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
                    set -e
                    : > .env
                    printf 'MONGODB_URI=%s\n'    "$MONGODB_URI"    >> .env
                    printf 'GNEWS_API_KEY=%s\n'  "$GNEWS_API_KEY"  >> .env
                    printf 'GEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" >> .env
                    printf 'JWT_SECRET=%s\n'     "$JWT_SECRET"     >> .env
                    printf 'ADMIN_USERNAME=%s\n' "$ADMIN_USERNAME" >> .env
                    printf 'ADMIN_PASSWORD=%s\n' "$ADMIN_PASSWORD" >> .env
                    printf 'PORT=5000\n'                           >> .env
                    docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '--- Checking app health ---'
                sh '''
                    set -e
                    for i in 1 2 3 4 5 6 7 8 9 10; do
                      if curl -fsS http://localhost:5000/health; then
                        echo ""
                        echo "Health check passed"
                        exit 0
                      fi
                      echo "Attempt $i failed, retrying in 3s..."
                      sleep 3
                    done
                    echo "Health check failed after 10 attempts"
                    docker compose logs --tail=100 || true
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded. App is live.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
            sh 'docker compose logs --tail=100 || true'
        }
        always {
            sh 'rm -f .env || true'
            sh 'docker image prune -f || true'
        }
    }
}
