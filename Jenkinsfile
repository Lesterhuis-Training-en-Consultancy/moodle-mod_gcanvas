pipeline {
  agent any
  stages {
    stage('Plugin Tests') {
      steps {
        echo 'Testing the plugin '
      }
    }

    stage("build") {

        docker.withServer('tcp://192.168.86.125:4243') {
            docker.image('moodlefreak/docker-md:moodle35').inside('-u root'){
                 sh 'php -v'
                 sh 'ls -lat'
                 sh 'pwd'
                 sh 'mkdir -p /var/www/html/mod/gcanvas'
                 sh 'cp -R . /var/www/html/mod/gcanvas'

                 stage("plugin-test") {
                    sh 'cd /var/www/html/ && bash plugin-test.sh mod/gcanvas'
                }
             }
        }
    }
  }
}