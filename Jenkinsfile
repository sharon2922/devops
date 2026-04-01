pipeline {
    agent any
    stages {
        stage('Pull') {
            steps {
                sh 'git -C /home/ubuntu/devops pull'
            }
        }
        stage('Deploy') {
            steps {
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env pull'
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env up -d'
            }
        }
    }
}