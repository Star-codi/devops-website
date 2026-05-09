# 🤖 Jenkins — Continuous Integration & Delivery

> Module 07 — CI/CD


## What is CI/CD?

CI (Continuous Integration) means: every time a developer pushes code, it's automatically built and tested. No more "it works on my machine!" problems.

CD (Continuous Delivery/Deployment) means: if all tests pass, the code is automatically deployed to production. No manual deployment steps.


> **🏭 Analogy — Factory Assembly Line**
> Imagine a car factory. Old way: workers build the whole car, then quality checks it at the end — finding defects when it's too late. CI/CD way: at every step of the assembly line, the car part is automatically checked. Problems are caught immediately. Jenkins is the factory manager running the assembly line — triggering each step automatically.


## Jenkins Pipeline — How It Works


## Your First Jenkinsfile

A Jenkinsfile is a script that defines what Jenkins should do. It lives in your project's root directory alongside your code.

```jenkinsfile — ci/cd pipeline
pipeline {
    agent any    // run on any available server
stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/arjun/my-app.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Docker Build & Push') {
            steps {
                sh 'docker build -t arjun/my-app:${BUILD_NUMBER} .'
                sh 'docker push arjun/my-app:${BUILD_NUMBER}'
            }
        }

        stage('Deploy') {
            steps {
                sh 'kubectl set image deployment/my-app my-app=arjun/my-app:${BUILD_NUMBER}'
            }
        }
    }

    post {
        success { echo '✅ Pipeline succeeded!' }
        failure { echo '❌ Pipeline failed — check logs!' }
    }
}
```


## Why Docker After Jenkins?

> **⚠️ Problem Jenkins Reveals**
> Jenkins builds and deploys perfectly on the build server. But on the production server: "It works in Jenkins but crashes in prod!" Why? Different Java version, different OS, missing libraries. Jenkins automates deployment — but doesn't guarantee the environment is the same everywhere. That's where Docker comes in.


> **🚀 Mini Project — CI/CD Pipeline for a Java App**
> Set up Jenkins → Connect to GitHub → Create a pipeline that builds with Maven, runs tests, builds a Docker image, and deploys to Kubernetes on every push to main branch.


> **✅ Module Summary**
> CI = Automatically build & test on every code push CD = Automatically deploy if tests pass Jenkinsfile defines your pipeline as code — stored in Git Jenkins catches bugs early and eliminates manual deployments
