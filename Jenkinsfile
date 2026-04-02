pipeline {
    agent any
    stages {
        stage('Pull Images') {
            steps {
                sh 'cd /home/ubuntu/devops && git fetch --all && git reset --hard origin/main'
            }
        }
        stage('Deploy') {
            steps {
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env pull'
                sh 'cd /home/ubuntu/devops && docker-compose down'
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env up -d'
            }
        }
    }
}