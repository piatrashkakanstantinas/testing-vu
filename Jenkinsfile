pipeline {
    agent {
        dockerfile true
    }

    triggers {
        cron(BRANCH_NAME == "main" ? "H/2 * * * *" : "")
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
                sh 'npm test -- --retries 1 --reporter mocha-junit-reporter --reporter-options mochaFile=${MOCHA_REPORT_FILE}'
            }
        }
    }

    post {
        always {
            junit '**/test-results.xml'
        }
    }
}
