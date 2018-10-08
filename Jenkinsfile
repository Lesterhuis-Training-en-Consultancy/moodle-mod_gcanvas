pipeline {
    # This file should be removed on a production, has no value there.
    agent any
    triggers {
        #https://stackoverflow.com/questions/47565446/no-build-triggers-option-for-blue-ocean-pipeline
        pollSCM('H */10 * * *')
    }
    stages {
        stage('Init') {
            steps {
                echo 'Testing the plugin '
            }
        }

        stage("build") {
            steps {
                script {
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
    }
}