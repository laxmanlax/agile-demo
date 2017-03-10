#!/usr/bin/env groovy

@NonCPS
def render(template, bindings = [:]) {
    return new groovy.text.SimpleTemplateEngine()
        .createTemplate(template)
        .make(bindings)
        .toString()
}

def app = 'agile-demo'
def host

node('master') {
    host = "${app}.app.${env.ROOT_DOMAIN_NAME}"

    stage('Checkout') {
        checkout scm
    }
}

podTemplate(
    inheritFrom: 'agilestacks',
    label: 'agile-demo',
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
    node('agile-demo') {
        stage('Deploy') {
            container('kubectl') {
                def namespace = "$app"
                def template = readFile 'deployment.yaml'
                def deployment = render template, [
                    app: app,
                    namespace: namespace,
                    host: host,
                    replicas: replicas,
                    version: version
                ]
                writeFile file: "deployment.${namespace}.yaml", text: deployment
                sh "kubectl apply -f ./deployment.${namespace}.yaml -n '$namespace'"
            }
        }
        stage('Verify') {
            container('kubectl') {
                def namespace = "$app"
                try {
                    sh """
                    for i in `seq 20`; do
                        kubectl rollout status deployment agile-demo \\
                            -n '$namespace' \\
                            --watch=false \\
                            | grep 'rolled out' > status && break
                        sleep 1
                    done
                    cat status | grep 'rolled out'
                    """
                } catch (err) {
                    sh "kubectl rollout undo deployment agile-demo -n '$namespace'"
                    throw err
                }
            }
        }

    }
}
