pipeline {
    agent {
        dockerfile true
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
    }

    post {
        always {
            junit '${MOCHA_REPORT_FILE}'
        }
    }
}
