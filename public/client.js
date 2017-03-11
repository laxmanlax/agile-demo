document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    const templateRequest = axios.get('/template.hbs')
        .then(({data}) => Handlebars.compile(data));

    const configRequest = axios.get('/config')
        .then(({data}) => data);

    function handleClusterItems() {
        document.querySelectorAll('.cluster-item').forEach((item) => {
            const image = item.querySelector('img');
            image.addEventListener('error', () => {
                item.classList.add('cluster-item-with-header');
            });
        });
    }

    let model;
    function refresh() {
        Promise.all([configRequest, templateRequest, axios.get('/cluster')])
            .then(([config, template, {data}]) => {
                let items = data.items;
                if (!config.showSelf) {
                    items = items.filter((item) => {
                        const image = _.get(item, 'spec.containers[0].image') || '';
                        return !image.startsWith(config.self);
                    });
                }
                if (!_.isEqual(model, items)) {
                    model = items;
                    container.innerHTML = template({config, model});
                    handleClusterItems();
                }
            });
    }

    setInterval(refresh, 1000);
    refresh();
});
