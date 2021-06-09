pipeline {
    agent any
    environment {
        COMMIT_HASH = "${sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()}"
        S3_BUCKET = 'utopiacustomerportal'
    }

    stages {
        stage('installs') {
            steps {
                sh 'export NG_CLI_ANALYTICS=false'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm run build'
            }
        }
        stage('Deploy to S3') {
            steps {
                echo 'Deploying to S3'
                sh 'aws s3 sync build/ s3://${S3_BUCKET}'
                echo 'Finished Deploying'
            }
        }
    }
    post {
        always {
            echo 'Post-build'
        }
    }
}
