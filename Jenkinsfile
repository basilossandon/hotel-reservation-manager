pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Git') {
      steps {
         git 'https://github.com/l-pizarro/hotel-reservation-manager'
      }
    }
        
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
        steps {
            sh 'npm run build'
        }
    }
     
    stage('Test') {
      steps {
         sh 'npm test'
      }
    }      
  }
}