document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    const templateRequest = axios.get('/template.hbs')
        .then(({data}) => Handlebars.compile(data));

    let model;
    function refresh() {
        Promise.all([templateRequest, axios.get('/cluster')])
            .then(([template, {data}]) => {
                if (!_.isEqual(model, data.items)) {
                    model = data.items;
                    container.innerHTML = template(model);
                }
            });
    }

    setInterval(refresh, 1000);
    refresh();
});
