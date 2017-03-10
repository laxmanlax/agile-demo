#!/usr/bin/env groovy

@NonCPS
def render(template, bindings = [:]) {
    return new groovy.text.SimpleTemplateEngine()
        .createTemplate(template)
        .make(bindings)
        .toString()
}

def app = 'update-demo'
def host

node('master') {
    host = "${app}.app.${env.ROOT_DOMAIN_NAME}"

    stage('Checkout') {
        checkout scm
    }
}

podTemplate(
    inheritFrom: 'agilestacks',
    label: 'update-demo',
    containers: [
        containerTemplate(
            name: 'kubectl',
            image: 'agilestacks/kubectl',
            ttyEnabled: true,
            command: 'cat'
        ),
        containerTemplate(
            name: 'curl',
            image: 'appropriate/curl',
            ttyEnabled: true,
            command: 'cat'
        )
    ]
) {
    node('update-demo') {
        stage('Deploy') {
            container('kubectl') {
                def namespace = "$app"
                def template = readFile 'deployment.yaml'
                def deployment = render template, [
                    namespace: namespace,
                    host: host,
                    replicas: replicas,
                    version: version
                ]
                writeFile file: "deployment.${namespace}.yaml", text: deployment
                sh "kubectl apply -f ./deployment.${namespace}.yaml --namespace '$namespace'"
            }
        }
    }
}
