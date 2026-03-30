pipeline {
    agent any
    stages {
        stage('Pull') {
            steps {
                sh 'cd /home/ubuntu/devops && git pull'
            }
        }
        stage('Deploy') {
            steps {
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env up -d --build'
            }
        }
    }
}

// testing auto deploy