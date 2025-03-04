pipeline {
    agent {
        docker 'node:22-alpine'
    }

    environment {
        MOCHA_REPORT_FILE = 'reports/test-results.xml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test -- --reporter mocha-junit-reporter --reporter-options mochaFile=${MOCHA_REPORT_FILE}'
            }
        }

        stage('Publish test results') {
            steps {
                junit '${MOCHA_REPORT_FILE}'
            }
        }
    }
}
