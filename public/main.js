document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    const templateRequest = axios.get('/template.hbs')
        .then(({data}) => Handlebars.compile(data));

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
        Promise.all([templateRequest, axios.get('/cluster')])
            .then(([template, {data}]) => {
                if (!_.isEqual(model, data.items)) {
                    model = data.items;
                    container.innerHTML = template(model);
                    handleClusterItems();
                }
            });
    }

    setInterval(refresh, 1000);
    refresh();
});
