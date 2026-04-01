pipeline {
    agent any
    stages {
        stage('Pull') {
            steps {
                sh 'git -C /home/ubuntu/devops pull'
            }
        }
        stage('Deploy Backend') {
            steps {
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env up -d --build backend'
            }
        }
        stage('Deploy Frontend') {
            when {
                changeset "shoplite-frontend/**"
            }
            steps {
                sh 'cd /home/ubuntu/devops && docker-compose --env-file .env up -d --build frontend'
            }
        }
    }
}
